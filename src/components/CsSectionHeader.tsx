import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsSectionHeaderVariant = 'default' | 'divider' | 'eyebrow';

export interface CsSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CsSectionHeaderVariant;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

// ─── Styled slots ─────────────────────────────────────────────────────────────

const CsSectionHeaderRoot = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'root',
  shouldForwardProp: (prop) =>
    !['variant', 'icon', 'title', 'subtitle', 'action'].includes(prop as string),
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
    {
      props: { variant: 'eyebrow' as const },
      style: {
        marginBottom: theme.spacing(2),
      },
    },
  ],
}));

const CsSectionHeaderRow = styled('div', { name: 'MuiCsSectionHeader', slot: 'row' })<{
  variant?: CsSectionHeaderVariant;
}>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',

  variants: [
    {
      props: { variant: 'eyebrow' as const },
      style: { alignItems: 'center' },
    },
  ],
}));

const CsSectionHeaderIcon = styled('div', { name: 'MuiCsSectionHeader', slot: 'icon' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: theme.space.xs,
    color: theme.vars.palette.text.secondary,
  }),
);

const CsSectionHeaderContent = styled('div', {
  name: 'MuiCsSectionHeader',
  slot: 'content',
})(() => ({
  minWidth: 0,
}));

const CsSectionHeaderTitle = styled('div', { name: 'MuiCsSectionHeader', slot: 'title' })<{
  variant?: CsSectionHeaderVariant;
}>(({ theme }) => ({
  ...theme.typography.subtitle1,
  fontWeight: theme.typography.fontWeightSemibold,
  color: theme.vars.palette.text.primary,

  variants: [
    {
      props: { variant: 'eyebrow' as const },
      style: {
        ...theme.typography.caption,
        fontWeight: theme.typography.fontWeightSemibold,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
      },
    },
  ],
}));

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
    const { variant = 'default', icon, title, subtitle, action, ...other } = props;

    return (
      <CsSectionHeaderRoot ref={ref} variant={variant} {...other}>
        <CsSectionHeaderRow variant={variant}>
          {icon && <CsSectionHeaderIcon aria-hidden="true">{icon}</CsSectionHeaderIcon>}
          <CsSectionHeaderContent>
            <CsSectionHeaderTitle variant={variant}>{title}</CsSectionHeaderTitle>
            {subtitle && variant !== 'eyebrow' && (
              <CsSectionHeaderSubtitle>{subtitle}</CsSectionHeaderSubtitle>
            )}
          </CsSectionHeaderContent>
          {action && <CsSectionHeaderAction>{action}</CsSectionHeaderAction>}
        </CsSectionHeaderRow>
      </CsSectionHeaderRoot>
    );
  },
);
