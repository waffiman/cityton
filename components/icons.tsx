import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
  title?: string;
};

function base(props: IconProps, paths: React.ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", props.className)}
      role={props.title ? "img" : "presentation"}
      aria-hidden={!props.title}
      aria-label={props.title}
    >
      {paths}
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>,
  );
}

export function IconUv(props: IconProps) {
  return base(
    props,
    <>
      <path d="M12 3v6" />
      <path d="M8 9h8" />
      <path d="M7 14a5 5 0 0010 0" />
      <path d="M9 21h6" />
    </>,
  );
}

export function IconEnergy(props: IconProps) {
  return base(props, <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />);
}

export function IconShield(props: IconProps) {
  return base(
    props,
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </>,
  );
}

export function IconHome(props: IconProps) {
  return base(
    props,
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>,
  );
}

export function IconBuilding(props: IconProps) {
  return base(
    props,
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </>,
  );
}

export function IconStore(props: IconProps) {
  return base(
    props,
    <>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </>,
  );
}

export function IconUsers(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 19c0-2 1.5-3.5 4-3.5" />
    </>,
  );
}

export function IconMenu(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>,
  );
}

export function IconClose(props: IconProps) {
  return base(
    props,
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>,
  );
}

export function IconCheck(props: IconProps) {
  return base(props, <path d="M5 13l4 4L19 7" />);
}

export function IconArrowRight(props: IconProps) {
  return base(props, <path d="M5 12h14M13 6l6 6-6 6" />);
}
