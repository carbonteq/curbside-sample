import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsStatCardColor =
  | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

export type CsStatCardTrend = 'up' | 'down' | 'neutral';

export interface CsStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: string;
  trend?: CsStatCardTrend;
  icon?: React.ReactNode;
  color?: CsStatCardColor;
}

// ─── Styled slots ─────────────────────────────────────────────────────────────

const INTENT_COLORS: CsStatCardColor[] = [
  'primary', 'secondary', 'success', 'error', 'warning', 'info', 'neutral',
];

const CsStatCardRoot = styled('div', {
  name: 'MuiCsStatCard',
  slot: 'root',
  shouldForwardProp: (prop) =>
    !['label', 'value', 'delta', 'trend', 'icon', 'color'].includes(prop as string),
})(({ theme }) => ({
  minWidth: 200,
  flex: '1 1 200px',
  padding: theme.spacing(3),
  borderRadius: `${theme.radius.lg}px`,
  backgroundColor: theme.surface.canvas,
  border: `1px solid ${theme.border.default}`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800],
    borderColor: theme.palette.grey[700],
  }),
}));

const CsStatCardHeader = styled('div', { name: 'MuiCsStatCard', slot: 'header' })(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  }),
);

const CsStatCardLabel = styled('div', { name: 'MuiCsStatCard', slot: 'label' })(
  ({ theme }) => ({
    ...theme.typography.body2,
    color: theme.vars.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  }),
);

const CsStatCardIcon = styled('div', {
  name: 'MuiCsStatCard',
  slot: 'icon',
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: CsStatCardColor }>(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: `${theme.radius.md}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  variants: INTENT_COLORS.map((color) => ({
    props: { color },
    style: {
      backgroundColor: theme.vars.palette[color].main,
      color: theme.vars.palette[color].contrastText,
    },
  })),
}));

const CsStatCardValue = styled('div', { name: 'MuiCsStatCard', slot: 'value' })(
  ({ theme }) => ({
    ...theme.typography.h4,
    fontWeight: theme.typography.fontWeightSemibold,
    lineHeight: 1.1,
    marginBottom: theme.spacing(1),
  }),
);

const CsStatCardDelta = styled('div', {
  name: 'MuiCsStatCard',
  slot: 'delta',
  shouldForwardProp: (prop) => prop !== 'trend',
})<{ trend: CsStatCardTrend }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  ...theme.typography.caption,
  fontWeight: theme.typography.fontWeightMedium,
  variants: [
    { props: { trend: 'up' as const },      style: { color: theme.vars.palette.success.main } },
    { props: { trend: 'down' as const },    style: { color: theme.vars.palette.error.main } },
    { props: { trend: 'neutral' as const }, style: { color: theme.vars.palette.text.secondary } },
  ],
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const CsStatCard = React.forwardRef<HTMLDivElement, CsStatCardProps>(
  function CsStatCard(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiCsStatCard' });
    const {
      label, value, delta, trend = 'neutral', icon, color = 'primary',
      ...other
    } = props;

    const TrendIcon =
      trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    return (
      <CsStatCardRoot ref={ref} {...other}>
        <CsStatCardHeader>
          <CsStatCardLabel>{label}</CsStatCardLabel>
          {icon && (
            <CsStatCardIcon color={color} aria-hidden="true">
              {icon}
            </CsStatCardIcon>
          )}
        </CsStatCardHeader>
        <CsStatCardValue>{value}</CsStatCardValue>
        {delta && (
          <CsStatCardDelta trend={trend}>
            <TrendIcon size={13} aria-hidden="true" />
            {delta}
          </CsStatCardDelta>
        )}
      </CsStatCardRoot>
    );
  },
);
