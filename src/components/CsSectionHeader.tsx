import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsSectionHeaderVariant = 'default' | 'divider';

export interface CsSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CsSectionHeaderVariant;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

// ─── Styled slots ─────────────────────────────────────────────────────────────

const CsSectionHeaderRoot = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'root',
  shouldForwardProp: (prop) =>
    !['variant', 'title', 'subtitle', 'action'].includes(prop as string),
})<{ variant?: CsSectionHeaderVariant }>(({ theme }) => ({
  marginBottom: theme.spacing(3),

  variants: [
    {
      props: { variant: 'divider' as const },
      style: {
        paddingBottom: theme.spacing(2),
        borderBottom: `1px solid ${theme.border.default}`,
        ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
      },
    },
  ],
}));

const CsSectionHeaderRow = styled('div', { name: 'MuiCsSectionHeader', slot: 'row' })(
  () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  }),
);

const CsSectionHeaderContent = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'content',
})(() => ({
  minWidth: 0,
}));

const CsSectionHeaderTitle = styled('div', { name: 'MuiCsSectionHeader', slot: 'title' })(
  ({ theme }) => ({
    ...theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightSemibold,
    color: theme.vars.palette.text.primary,
  }),
);

const CsSectionHeaderSubtitle = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'subtitle',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.vars.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const CsSectionHeaderAction = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'action',
})(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flexShrink: 0,
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const CsSectionHeader = React.forwardRef<HTMLDivElement, CsSectionHeaderProps>(
  function CsSectionHeader(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiCsSectionHeader' });
    const { variant = 'default', title, subtitle, action, ...other } = props;

    return (
      <CsSectionHeaderRoot ref={ref} variant={variant} {...other}>
        <CsSectionHeaderRow>
          <CsSectionHeaderContent>
            <CsSectionHeaderTitle>{title}</CsSectionHeaderTitle>
            {subtitle && (
              <CsSectionHeaderSubtitle>{subtitle}</CsSectionHeaderSubtitle>
            )}
          </CsSectionHeaderContent>
          {action && <CsSectionHeaderAction>{action}</CsSectionHeaderAction>}
        </CsSectionHeaderRow>
      </CsSectionHeaderRoot>
    );
  },
);
