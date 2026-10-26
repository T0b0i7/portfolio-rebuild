#!/usr/bin/env node
/**
 * Smoke test — export PDF réglementaire + versioning EF-35.
 * Usage: npm run test:smoke            (serveur déjà démarré sur BASE_URL)
 *        node tests/smoke-pdf.mjs --base http://localhost:3111
 */
const baseFlag = process.argv.indexOf("--base");
const BASE = (
  baseFlag > -1 ? process.argv[baseFlag + 1] : process.env.BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

let passed = 0;
const failures = [];

function check(label, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function json(path, init) {
  const response = await fetch(`${BASE}${path}`, init);
  const body = await response.json().catch(() => null);
  return { response, body };
}

async function main() {
  console.log(`\nNaviGarde smoke test → ${BASE}\n`);

  // 1. create
  const created = await json("/api/v1/reports", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      subject: { name: "Smoke Test SARL", site: "smoke.example", siret: "SIRET 111 222 333" },
      control: {
        type: "Contrôle de fumée",
        date: "2026-10-27T08:00:00.000Z",
        operator: "smoke-test",
        framework: "EF-35",
      },
      findings: [
        {
          id: "S-1",
          severity: "majeur",
          title: "Constat de test",
          detail: "Généré par tests/smoke-pdf.mjs.",
          evidence: "smoke",
          aiConfidence: 0.9,
        },
      ],
    }),
  });
  check("POST /reports → 201", created.response.status === 201, `status ${created.response.status}`);
  const v1 = created.body?.data;
  check("v1 créée en brouillon", v1?.version === 1 && v1?.status === "brouillon");
  check("hash SHA-256 de 64 caractères", /^[a-f0-9]{64}$/.test(v1?.cryptographic_hash ?? ""));
  if (!v1?.id) throw new Error("Impossible de créer le rapport de test.");
  // 2. download PDF (draft)
  const pdf1 = await fetch(`${BASE}/api/v1/reports/${v1.id}/download`);
  const buffer = new Uint8Array(await pdf1.arrayBuffer());
  check(
    "GET /download → 200",
    pdf1.status === 200,
    `status ${pdf1.status}`,
  );
  check(
    "Content-Type: application/pdf",
    pdf1.headers.get("content-type") === "application/pdf",
    String(pdf1.headers.get("content-type")),
  );
  check(
    "corps = signature %PDF-",
    new TextDecoder().decode(buffer.slice(0, 5)) === "%PDF-",
  );
  check("PDF non vide (> 8 Ko)", buffer.byteLength > 8192, `${buffer.byteLength} octets`);

  const { PDFDocument } = await import("pdf-lib");
  const parsed = await PDFDocument.load(buffer);
  check("PDF parseable par pdf-lib", parsed.getPageCount() >= 1, `${parsed.getPageCount()} pages`);
  check(
    "métadonnée titre = référence + version",
    (parsed.getTitle() ?? "").includes(v1.reference),
    parsed.getTitle() ?? "",
  );
  check("métadonnée auteur = NaviGarde IA", (parsed.getAuthor() ?? "").includes("NAVIGARDE"));
  check(
    "en-tête X-Report-Hash aligné",
    pdf1.headers.get("x-report-hash") === v1.cryptographic_hash,
  );
  // 3. validate v1
  const validated = await json(`/api/v1/reports/${v1.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-actor": "smoke-test" },
    body: JSON.stringify({ status: "validé", note: "Validation initiale" }),
  });
  check("PATCH validation → 200", validated.response.status === 200, `status ${validated.response.status}`);
  check(
    "v1 reste validée en place",
    validated.body?.data?.version === 1 && validated.body?.data?.status === "validé",
  );
  check(
    "en-tête X-Versioning: in-place",
    validated.response.headers.get("x-versioning") === "in-place",
  );
  // 4. EF-35: patch a validated report → new draft v2
  const patched = await json(`/api/v1/reports/${v1.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-actor": "smoke-test" },
    body: JSON.stringify({
      findings: [
        {
          id: "S-2",
          severity: "critique",
          title: "Constat ajouté après validation",
          detail: "Cette modification doit créer une nouvelle version.",
          aiConfidence: 0.95,
        },
      ],
    }),
  });
  const v2 = patched.body?.data;

  check("PATCH sur rapport validé → 201", patched.response.status === 201, `status ${patched.response.status}`);
  check("meta.versioned = true", patched.body?.meta?.versioned === true);
  check("nouvelle version = 2", v2?.version === 2, `v${v2?.version}`);
  check("nouvelle version en brouillon", v2?.status === "brouillon", String(v2?.status));
  check("lignée conservée (parentId = v1)", v2?.parentId === v1.id);
  check("même rootId", v2?.rootId === v1.rootId);
  check("nouvel identifiant", v2?.id !== v1.id);
  check("historique étendu", (v2?.history?.length ?? 0) >= 3, `${v2?.history?.length} entrées`);
  check("hash recalculé", v2?.cryptographic_hash !== v1.cryptographic_hash);
  check(
    "en-tête X-Versioning: cloned",
    patched.response.headers.get("x-versioning") === "cloned",
  );
  // 5. audit trail intact + PDF of each version
  const reloadV1 = await json(`/api/v1/reports/${v1.id}`);
  check("v1 toujours validée (immuable)", reloadV1.body?.data?.status === "validé");
  check("v1 pointe vers v2 (supersededBy)", reloadV1.body?.data?.supersededBy === v2.id);
  check(
    "v1 conserve le hash de sa version validée",
    reloadV1.body?.data?.cryptographic_hash === validated.body?.data?.cryptographic_hash,
  );

  const pdf2 = await fetch(`${BASE}/api/v1/reports/${v2.id}/download`);
  const buffer2 = new Uint8Array(await pdf2.arrayBuffer());
  check("v2 se télécharge en PDF", pdf2.headers.get("content-type") === "application/pdf");
  check("v2 PDF valide", new TextDecoder().decode(buffer2.slice(0, 5)) === "%PDF-");
  check("X-Report-Version: 2", pdf2.headers.get("x-report-version") === "2");

  // 6. in-place update on a draft
  const draftPatch = await json(`/api/v1/reports/${v2.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ subject: { name: "Smoke Test SARL (renommé)" } }),
  });
  check("PATCH sur brouillon → 200 (pas de clone)", draftPatch.response.status === 200);
  check("brouillon modifié en place", draftPatch.body?.data?.version === 2);

  // 7. errors
  const missing = await fetch(`${BASE}/api/v1/reports/inexistant/download`);
  check("rapport inconnu → 404", missing.status === 404, `status ${missing.status}`);
  const bad = await fetch(`${BASE}/api/v1/reports`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ subject: {} }),
  });
  check("payload invalide → 400", bad.status === 400, `status ${bad.status}`);

  const total = passed + failures.length;
  console.log(`\n${passed}/${total} assertions ok`);
  if (failures.length) {
    console.error("\nÉchecs:");
    for (const failure of failures) console.error(` - ${failure}`);
    process.exit(1);
  }
  console.log("Smoke test PDF + versioning: PASS\n");
}

main().catch((error) => {
  console.error("\nErreur fatale:", error.message);
  process.exit(1);
});
