import * as React from 'react';

export interface LogoMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  /** Color of grid + chart line + eye. The bear silhouette stays Bear Red. */
  color?: string;
}

/**
 * OVERVALUED · Logo mark
 * Square chart-bear icon. Use ≥ 16px. Bear stays #E63946; pass `color` to
 * recolor the grid/chart/eye for dark vs light backgrounds.
 */
export const LogoMark = React.forwardRef<SVGSVGElement, LogoMarkProps>(
  ({ size = 40, color = '#FFFFFF', ...rest }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', color }}
      aria-label="Overvalued"
      role="img"
      {...rest}
    >
      <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
        <line x1="0" y1="25" x2="100" y2="25" />
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="0" y1="75" x2="100" y2="75" />
        <line x1="25" y1="0" x2="25" y2="100" />
        <line x1="50" y1="0" x2="50" y2="100" />
        <line x1="75" y1="0" x2="75" y2="100" />
      </g>
      <path
        fill="#E63946"
        d="M 8 20 L 22 20 L 22 12 L 34 12 L 34 22 L 50 22 L 50 30 L 64 30 L 64 42 L 82 42 L 82 56 L 96 56 L 96 78 L 88 78 L 88 86 L 76 86 L 76 78 L 30 78 L 30 86 L 18 86 L 18 78 L 10 78 L 10 56 L 8 56 Z"
      />
      <path fill="currentColor" d="M 18 38 L 22 34 L 26 38 L 22 42 Z" />
      <path fill="#E63946" d="M 8 56 L 8 64 L 0 56 Z" />
      <polyline
        points="2,10 22,18 38,28 58,42 80,54 98,72"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M 98 72 L 92 66 M 98 72 L 92 76"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  )
);
LogoMark.displayName = 'LogoMark';
