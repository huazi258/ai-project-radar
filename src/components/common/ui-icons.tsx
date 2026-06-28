import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
};

export function RadarIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 12 18.5 7.5" />
      <circle cx="17.2" cy="8.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LearningIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </svg>
  );
}

export function StructureIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProjectIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M9 18h6M10 22h4" />
      <path d="M8.3 14.8A7 7 0 1 1 15.7 14.8c-.9.7-1.4 1.5-1.5 2.2h-4.4c-.1-.7-.6-1.5-1.5-2.2Z" />
      <path d="M12 2v2M4.9 4.9l1.4 1.4M19.1 4.9l-1.4 1.4" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...sharedProps} {...props}>
      <path d="M12 2.5c.6 4.4 3.1 6.9 7.5 7.5-4.4.6-6.9 3.1-7.5 7.5-.6-4.4-3.1-6.9-7.5-7.5C8.9 9.4 11.4 6.9 12 2.5Z" />
      <path d="M18.5 16.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5Z" />
    </svg>
  );
}
