type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
