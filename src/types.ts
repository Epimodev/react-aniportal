type PortalTimeout = number | { enter: number; exit: number };

interface AnimationClassNames {
  enter?: string;
  enterActive?: string;
  exit?: string;
  exitActive?: string;
}

interface AnimationStyles {
  enter?: React.CSSProperties;
  enterActive?: React.CSSProperties;
  exit?: React.CSSProperties;
  exitActive?: React.CSSProperties;
}

export { PortalTimeout, AnimationClassNames, AnimationStyles };
