import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsPresenceStatus = 'online' | 'away' | 'busy' | 'offline';
export type CsStatusDotSize = 'sm' | 'md' | 'lg';

export interface CsStatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: CsPresenceStatus;
  label?: string;
  size?: CsStatusDotSize;
  showLabel?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<CsPresenceStatus, string> = {
  online:  'Online',
  away:    'Away',
  busy:    'Busy',
  offline: 'Offline',
};

// ─── Styled slots ─────────────────────────────────────────────────────────────

const CsStatusDotRoot = styled('span', {
  name: 'MuiCsStatusDot',
  slot: 'root',
  shouldForwardProp: (prop) =>
    !['status', 'label', 'size', 'showLabel'].includes(prop as string),
})<CsStatusDotProps>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const CsStatusDotDot = styled('span', {
  name: 'MuiCsStatusDot',
  slot: 'dot',
  shouldForwardProp: (prop) => !['status', 'size'].includes(prop as string),
})<{ status: CsPresenceStatus; size: CsStatusDotSize }>(({ theme }) => ({
  display: 'inline-block',
  borderRadius: '50%',
  flexShrink: 0,
  variants: [
    // ── sizes ──
    { props: { size: 'sm' as const }, style: { width: 6,  height: 6 } },
    { props: { size: 'md' as const }, style: { width: 8,  height: 8 } },
    { props: { size: 'lg' as const }, style: { width: 12, height: 12 } },

    // ── statuses ──
    {
      props: { status: 'online' as const },
      style: {
        backgroundColor: theme.vars.palette.success.main,
        boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}, 0 0 0 3px ${theme.vars.palette.success.main}`,
      },
    },
    {
      props: { status: 'away' as const },
      style: { backgroundColor: theme.vars.palette.warning.main },
    },
    {
      props: { status: 'busy' as const },
      style: { backgroundColor: theme.vars.palette.error.main },
    },
    {
      props: { status: 'offline' as const },
      style: { backgroundColor: theme.vars.palette.action.disabled },
    },
  ],
}));

const CsStatusDotLabel = styled('span', { name: 'MuiCsStatusDot', slot: 'label' })(
  ({ theme }) => ({
    ...theme.typography.caption,
    color: theme.vars.palette.text.secondary,
  }),
);

// ─── Component ────────────────────────────────────────────────────────────────

export const CsStatusDot = React.forwardRef<HTMLSpanElement, CsStatusDotProps>(
  function CsStatusDot(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiCsStatusDot' });
    const { status, label, size = 'md', showLabel = false, ...other } = props;

    return (
      <CsStatusDotRoot ref={ref} {...other}>
        <CsStatusDotDot
          role="img"
          aria-label={`Status: ${label ?? STATUS_LABEL[status]}`}
          status={status}
          size={size}
        />
        {showLabel && (
          <CsStatusDotLabel>{label ?? STATUS_LABEL[status]}</CsStatusDotLabel>
        )}
      </CsStatusDotRoot>
    );
  },
);
