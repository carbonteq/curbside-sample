import React, { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { focusRing } from '@/theme/recipes';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {
  Search, ChevronDown, LayoutGrid, AlignJustify, ShoppingCart, X as XIcon,
  Globe, Check, Sun, Bell, Calculator, Heart, Zap, Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────────

type InstKey = 'chla' | 'curbside' | 'osf' | 'ih' | 'rainbow';
type ViewMode = 'grid' | 'list';

interface CommunityCard {
  id: number;
  institution: string;
  instKey: InstKey;
  title: string;
  purpleThumb?: boolean;
}

interface CartEntry {
  id: number;
  title: string;
  institution: string;
}

// ── Static data ────────────────────────────────────────────────────────────────

const CARDS: CommunityCard[] = [
  { id: 1, institution: 'Memorial Sloan Kettering',          instKey: 'chla',    title: 'Acute Graft Versus Host Disease (AG…' },
  { id: 2, institution: 'Curbside Open',                     instKey: 'curbside', title: 'Measles Screening, Diagnosis And Tes…' },
  { id: 3, institution: 'OSF Medical Care Guidelines',       instKey: 'osf',     title: 'Timing Of Cesarean Section' },
  { id: 4, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow', title: 'Asthma (5-11 Years) - Pediatric Initial…' },
  { id: 5, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow', title: 'Appendicitis - Diagnosis And Initial M…' },
  { id: 6, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow', title: 'Asthma 12+ Years - Pediatric Initial V…' },
  { id: 7, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow', title: 'Obesity Or Overweight (≥/=10 Years)…' },
  { id: 8, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow', title: 'Asthma (0-4 Years) - Pediatric Initial…', purpleThumb: true },
];

const INSTITUTIONS = [
  'Memorial Sloan Kettering',
  "Children's Hospital Los Angeles",
  'Curbside Open',
  'OSF Medical Care Guidelines',
  "Rainbow Babies Children's",
];
const CONTENT_TYPES   = ['Pathway', 'Protocol', 'Document', 'Calculator'];
const SPECIALTIES     = ['Pediatric Medicine', 'Emergency Medicine', 'Internal Medicine', 'Cardiology', 'Oncology', 'Neurology'];
const PRICING_OPTIONS = ['All', 'Free only', 'Paid only'];
const KIT_OPTIONS     = ['Standard Kit', 'Premium Kit', 'Bundle'];
const SORT_OPTIONS    = ['Most Popular', 'Newest First', 'Alphabetical A–Z', 'Most Downloaded'];
const CATEGORY_OPTIONS: { value: string; icon: React.ElementType }[] = [
  { value: 'New',               icon: Sun        },
  { value: 'Popular',           icon: Bell       },
  { value: 'Calculators',       icon: Calculator },
  { value: 'Pediatric Medicine',icon: Heart      },
  { value: 'Emergency Medicine',icon: Zap        },
];

// ── Inst logo colors (mapped to palette / custom tokens) ──────────────────────

type InstColorFn = (t: Theme) => { bg: string; border: string };

const INST_COLORS: Record<InstKey, InstColorFn> = {
  chla:     (t) => ({ bg: t.surface.canvas,                              border: t.border.default }),
  curbside: (t) => ({ bg: t.palette.primary.main,                        border: 'transparent' }),
  osf:      (t) => ({ bg: alpha(t.palette.info.light, 0.18),             border: t.border.subtle }),
  ih:       (t) => ({ bg: t.palette.error.light,                         border: 'transparent' }),
  rainbow:  (t) => ({ bg: t.surface.canvas,                              border: t.border.default }),
};

const CARD_INST_GRADIENT: Record<InstKey, (t: Theme) => string> = {
  rainbow:  (t) => `linear-gradient(135deg, ${t.palette.error.light}, ${t.palette.warning.light}, ${t.palette.success.light}, ${t.palette.info.light})`,
  chla:     (t) => `linear-gradient(135deg, ${t.palette.warning.main}, ${t.palette.warning.light})`,
  curbside: (t) => t.brand.gradient,
  osf:      (t) => `linear-gradient(135deg, ${t.palette.success.main}, ${t.palette.success.dark})`,
  ih:       (t) => `linear-gradient(135deg, ${t.palette.error.main}, ${t.palette.error.light})`,
};

// ── Institution logo SVGs for the hero strip ──────────────────────────────────

function ChlaLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <ellipse cx="18" cy="18" rx="1.1" ry="6" fill="#2B2B2B" />
      <path d="M17 14 C12 10 7 9 5 12 C4 14 5 17 8 18 C11 19 14 18 17 16 Z" fill="#4FB3E8" />
      <path d="M19 14 C24 10 29 9 31 12 C32 14 31 17 28 18 C25 19 22 18 19 16 Z" fill="#E85A9B" />
      <path d="M17 19 C13 21 9 23 8 26 C7 28 9 30 12 29 C15 28 17 25 17.5 22 Z" fill="#7ED06B" />
      <path d="M19 19 C23 21 27 23 28 26 C29 28 27 30 24 29 C21 28 19 25 18.5 22 Z" fill="#F5A843" />
      <path d="M17.5 12 C17 10 15.5 9 14 9" stroke="#2B2B2B" strokeWidth="0.7" strokeLinecap="round" fill="none" />
      <path d="M18.5 12 C19 10 20.5 9 22 9" stroke="#2B2B2B" strokeWidth="0.7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CurbsideLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <path d="M12 8 C12 8 12 16 12 19 C12 23 15 26 19 26 C23 26 26 23 26 19 L26 15"
        stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="8" r="1.6" fill="#FFFFFF" />
      <circle cx="26" cy="13" r="3.2" fill="#FFFFFF" />
      <circle cx="26" cy="13" r="1.6" fill="#6846E6" />
    </svg>
  );
}

function OsfLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <circle cx="18" cy="11" r="3" fill="#5B8AA5" />
      <path d="M10 26 C10 20 14 18 18 18 C22 18 26 20 26 26" stroke="#5B8AA5" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M12 17 L15 13" stroke="#5B8AA5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 17 L21 13" stroke="#5B8AA5" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="18" cy="6" r="2.2" fill="none" stroke="#5B8AA5" strokeWidth="1.4" />
    </svg>
  );
}

function RainbowLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <path d="M6 24 A12 12 0 0 1 30 24" stroke="#E74C3C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M9 24 A9 9 0 0 1 27 24"   stroke="#F5A843" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M12 24 A6 6 0 0 1 24 24"  stroke="#7ED06B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M15 24 A3 3 0 0 1 21 24"  stroke="#4FB3E8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── InstitutionHeroBadge ───────────────────────────────────────────────────────

interface InstitutionHeroBadgeProps {
  instKey: InstKey;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function InstitutionHeroBadge({ instKey, label, active, onClick }: InstitutionHeroBadgeProps) {
  const t = useTheme();
  const { bg, border } = INST_COLORS[instKey](t);
  return (
    <Tooltip title={label} placement="top">
      <ButtonBase
        onClick={onClick}
        aria-label={label}
        sx={{
          width: 44, height: 44,
          borderRadius: `${t.radius.xl}px`,
          bgcolor: bg,
          border: `1px solid ${border}`,
          display: 'grid', placeItems: 'center',
          cursor: 'pointer',
          boxShadow: t.shadows[active ? t.elevation.low : t.elevation.none],
          transition: t.motion.short,
          outline: active ? `2px solid ${t.palette.primary.main}` : 'none',
          outlineOffset: active ? 2 : 0,
          '&:hover': { boxShadow: t.shadows[t.elevation.low], transform: 'translateY(-4px)' },
          ...t.applyStyles('dark', { bgcolor: active ? alpha(t.palette.primary.main, 0.2) : t.palette.grey[800] }),
        }}
      >
        {instKey === 'chla'     && <ChlaLogo />}
        {instKey === 'curbside' && <CurbsideLogo />}
        {instKey === 'osf'      && <OsfLogo />}
        {instKey === 'ih'       && (
          <Typography sx={(t) => ({ fontSize: t.typography.h4.fontSize, fontWeight: 'fontWeightBold', color: 'common.white', letterSpacing: t.letterSpacing.tighter, lineHeight: 1 })}>
            iH
          </Typography>
        )}
        {instKey === 'rainbow'  && <RainbowLogo />}
      </ButtonBase>
    </Tooltip>
  );
}

// ── FilterDropdown ─────────────────────────────────────────────────────────────

interface FilterDropdownProps {
  label: React.ReactNode;
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  multiSelect?: boolean;
  badgeCount?: number;
  rightAlign?: boolean;
}

function FilterDropdown({ label, options, selected, onToggle, multiSelect = true, badgeCount, rightAlign }: FilterDropdownProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  const t = useTheme();
  const hasSelection = selected.length > 0;

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={open}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1,
          height: 30, px: 2,
          borderRadius: `${t.radius.md}px`,
          fontSize: t.typography.caption.fontSize,
          fontWeight: hasSelection ? t.typography.fontWeightSemibold : t.typography.fontWeightMedium,
          color: hasSelection ? t.palette.primary.main : t.palette.text.secondary,
          border: `1px solid ${hasSelection ? t.palette.primary.main : t.border.default}`,
          bgcolor: hasSelection ? alpha(t.palette.primary.main, 0.07) : t.surface.canvas,
          transition: t.motion.short,
          whiteSpace: 'nowrap',
          '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
          ...t.applyStyles('dark', { bgcolor: hasSelection ? alpha(t.palette.primary.main, 0.15) : t.surface.subtle }),
        }}
      >
        {label}
        {(badgeCount != null && badgeCount > 0) && (
          <Box sx={{
            minWidth: 16, height: 16, px: 1,
            bgcolor: 'primary.main', color: 'common.white',
            borderRadius: `${t.radius.pill}px`,
            ...t.typography.badge,
            display: 'inline-grid', placeItems: 'center',
            flexShrink: 0,
          }}>
            {badgeCount}
          </Box>
        )}
        <ChevronDown size={12} />
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: rightAlign ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: rightAlign ? 'right' : 'left' }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              mt: 1, minWidth: 220,
              borderRadius: `${theme.radius.lg}px`,
              border: `1px solid ${theme.border.default}`,
              boxShadow: theme.shadows[theme.elevation.high],
              bgcolor: theme.surface.overlay,
              py: 1, px: 1,
              ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800], borderColor: theme.palette.grey[600] }),
            }),
          },
        }}
      >
        <Typography sx={(theme) => ({
          ...theme.typography.overline,
          color: 'text.disabled',
          px: 2, pt: 1, pb: 1, display: 'block',
        })}>
          {label}
        </Typography>
        {options.map((opt) => {
          const isSel = selected.includes(opt);
          return (
            <ButtonBase
              key={opt}
              role="option"
              aria-selected={isSel}
              onClick={() => { onToggle(opt); if (!multiSelect) setAnchor(null); }}
              sx={(theme) => ({
                display: 'flex', alignItems: 'center', gap: 2,
                height: 44, px: 2, width: '100%', textAlign: 'left',
                borderRadius: `${theme.radius.md}px`,
                fontSize: theme.typography.body2.fontSize,
                fontWeight: isSel ? theme.typography.fontWeightSemibold : theme.typography.fontWeightMedium,
                color: isSel ? 'primary.main' : 'text.secondary',
                transition: theme.motion.short,
                '&:hover': { bgcolor: theme.fill.default, color: 'text.primary' },
              })}
            >
              {multiSelect ? (
                <Box sx={(theme) => ({
                  width: 16, height: 16, flexShrink: 0,
                  borderRadius: `${theme.radius.sm}px`,
                  border: `1px solid ${isSel ? theme.palette.primary.main : theme.border.strong}`,
                  bgcolor: isSel ? 'primary.main' : theme.surface.canvas,
                  display: 'grid', placeItems: 'center',
                  transition: theme.motion.short,
                })}>
                  {isSel && <Check size={10} strokeWidth={2.5} color="white" />}
                </Box>
              ) : (
                <Box sx={(theme) => ({
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${isSel ? theme.palette.primary.main : theme.border.strong}`,
                  display: 'grid', placeItems: 'center',
                  transition: theme.motion.short,
                })}>
                  {isSel && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                </Box>
              )}
              <Box sx={{ flex: 1 }}>{opt}</Box>
            </ButtonBase>
          );
        })}
      </Popover>
    </>
  );
}

// ── CategoryDropdown ───────────────────────────────────────────────────────────

interface CategoryDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  const t = useTheme();

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={open}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1,
          height: 30, px: 2,
          borderRadius: `${t.radius.md}px`,
          fontSize: t.typography.caption.fontSize,
          fontWeight: t.typography.fontWeightSemibold,
          color: t.palette.primary.main,
          border: `1px solid ${t.palette.primary.main}`,
          bgcolor: alpha(t.palette.primary.main, 0.07),
          transition: t.motion.short,
          whiteSpace: 'nowrap',
          '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.12) },
          ...t.applyStyles('dark', { bgcolor: alpha(t.palette.primary.main, 0.15) }),
        }}
      >
        <AlignJustify size={12} />
        {value}
        <ChevronDown size={12} />
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              mt: 1, minWidth: 200,
              borderRadius: `${theme.radius.lg}px`,
              border: `1px solid ${theme.border.default}`,
              boxShadow: theme.shadows[theme.elevation.high],
              bgcolor: theme.surface.overlay,
              py: 1, px: 1,
              ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800], borderColor: theme.palette.grey[600] }),
            }),
          },
        }}
      >
        <MenuList disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {CATEGORY_OPTIONS.map(({ value: opt, icon: Icon }) => {
            const isSel = value === opt;
            return (
              <MenuItem
                key={opt}
                selected={isSel}
                onClick={() => { onChange(opt); setAnchor(null); }}
                sx={(theme) => ({
                  display: 'flex', alignItems: 'center', gap: 2,
                  height: 36, px: 2,
                  borderRadius: `${theme.radius.md}px`,
                  fontSize: theme.typography.body2.fontSize,
                  fontWeight: isSel ? theme.typography.fontWeightSemibold : theme.typography.fontWeightMedium,
                  color: isSel ? 'primary.main' : 'text.secondary',
                  bgcolor: isSel ? alpha(theme.palette.primary.main, 0.07) : 'transparent',
                  '&:hover': { bgcolor: theme.fill.default, color: 'text.primary' },
                })}
              >
                <Icon size={15} />
                {opt}
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    </>
  );
}

// ── ThumbPlaceholder ───────────────────────────────────────────────────────────

function ThumbPlaceholder() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '72%', opacity: 0.5 }}>
      {[100, 80, 65, 90, 55].map((w, i) => (
        <Box key={i} sx={(t) => ({ height: 6, borderRadius: `${t.radius.sm}px`, bgcolor: t.border.strong, width: `${w}%` })} />
      ))}
    </Box>
  );
}

// ── ContentCard ────────────────────────────────────────────────────────────────

function ContentCard({ card, listView }: { card: CommunityCard; listView?: boolean }) {
  const t = useTheme();
  const instGrad = CARD_INST_GRADIENT[card.instKey](t);

  if (listView) {
    return (
      <ButtonBase
        sx={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          height: 92, width: '100%', textAlign: 'left',
          bgcolor: t.surface.canvas,
          border: `1px solid ${t.border.default}`,
          borderRadius: `${t.radius.lg}px`,
          overflow: 'hidden',
          transition: t.motion.short,
          '&:hover': { borderColor: t.border.strong, boxShadow: t.shadows[t.elevation.low], transform: 'translateY(-4px)' },
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[700] }),
        }}
      >
        <Box sx={(theme) => ({
          width: 130, height: 92, flexShrink: 0,
          bgcolor: card.purpleThumb ? 'primary.dark' : theme.surface.subtle,
          backgroundImage: card.purpleThumb ? theme.brand.gradient : undefined,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: `1px solid ${theme.border.default}`,
        })}>
          {!card.purpleThumb && <ThumbPlaceholder />}
        </Box>
        <Box sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 180, flexShrink: 0 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundImage: instGrad, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'fontWeightMedium' }}>
              {card.institution}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {card.title}
          </Typography>
        </Box>
      </ButtonBase>
    );
  }

  return (
    <ButtonBase
      sx={(theme) => ({
        display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'left',
        bgcolor: theme.surface.canvas,
        border: `1px solid ${theme.border.default}`,
        borderRadius: `${theme.radius.lg}px`,
        overflow: 'hidden',
        transition: theme.motion.short,
        '&:hover': { borderColor: theme.border.strong, boxShadow: theme.shadows[theme.elevation.low], transform: 'translateY(-4px)' },
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
      })}
    >
      {/* Thumb */}
      <Box sx={(theme) => ({
        height: 130, width: '100%', flexShrink: 0,
        bgcolor: card.purpleThumb ? 'primary.dark' : theme.surface.subtle,
        backgroundImage: card.purpleThumb ? theme.brand.gradient : undefined,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      })}>
        {!card.purpleThumb && <ThumbPlaceholder />}
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 20, height: 20, borderRadius: '50%',
            backgroundImage: instGrad, flexShrink: 0,
            border: (theme) => `1px solid ${theme.border.default}`,
          }} />
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'fontWeightMedium' }}>
            {card.institution}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold', lineHeight: 1.35 }}>
          {card.title}
        </Typography>
      </Box>
    </ButtonBase>
  );
}

// ── CartDrawer ─────────────────────────────────────────────────────────────────

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartEntry[];
  onRemove: (id: number) => void;
}

function CartDrawer({ open, onClose, items, onRemove }: CartDrawerProps) {
  const t = useTheme();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { bgcolor: t.surface.scrim } },
      }}
      PaperProps={{
        sx: (theme) => ({
          width: 300,
          bgcolor: theme.surface.canvas,
          borderLeft: `1px solid ${theme.border.default}`,
          p: 5,
          display: 'flex', flexDirection: 'column', gap: 4,
          position: 'relative',
          ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
        }),
      }}
    >
      {/* Close button */}
      <Tooltip title="Close">
        <IconButton
          onClick={onClose}
          aria-label="Close cart"
          size="small"
          sx={(theme) => ({
            position: 'absolute', top: theme.spacing(3), right: theme.spacing(3),
            color: 'text.secondary',
            '&:hover': { bgcolor: theme.fill.default },
          })}
        >
          <XIcon size={16} />
        </IconButton>
      </Tooltip>

      {/* Title row */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'fontWeightBold', pr: 4 }}>
          Your cart
        </Typography>
      </Box>

      {/* Count header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h4" component="span" sx={{ fontWeight: 'fontWeightBold', lineHeight: 1 }}>
          {items.length}
        </Typography>
        <Box sx={{ color: 'text.secondary', display: 'flex' }}>
          <ShoppingCart size={20} />
        </Box>
      </Box>

      {/* Subtotal */}
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Subtotal: <Box component="span" sx={{ color: 'text.primary', fontWeight: 'fontWeightSemibold' }}>$0</Box>
      </Typography>

      <Button variant="contained" fullWidth>
        Checkout
      </Button>

      <Divider sx={(theme) => ({ borderColor: theme.border.subtle, mx: -5 })} />

      {/* Cart items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={(theme) => ({
              display: 'flex', gap: 3, p: 3,
              borderRadius: `${theme.radius.md}px`,
              border: `1px solid ${theme.border.default}`,
              bgcolor: theme.surface.subtle,
              position: 'relative',
              ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800], borderColor: theme.palette.grey[600] }),
            })}
          >
            {/* Thumb */}
            <Box sx={(theme) => ({
              width: 48, height: 40, borderRadius: `${theme.radius.sm}px`,
              bgcolor: theme.surface.raised, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            })}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '80%' }}>
                {[100, 70, 85].map((w, i) => (
                  <Box key={i} sx={(theme) => ({ height: 3, borderRadius: 1, bgcolor: theme.border.strong, width: `${w}%` })} />
                ))}
              </Box>
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 'fontWeightSemibold', lineHeight: 1.3, display: 'block' }}>
                {item.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block', fontWeight: 'fontWeightRegular' }}>
                {item.institution}
              </Typography>
            </Box>

            {/* Remove */}
            <IconButton
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.title} from cart`}
              size="small"
              sx={(theme) => ({
                position: 'absolute', top: theme.spacing(1), right: theme.spacing(1),
                width: 22, height: 22, color: 'text.disabled',
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' },
              })}
            >
              <XIcon size={12} />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}

// ── CommunityPage ──────────────────────────────────────────────────────────────

export function CommunityPage() {
  const t = useTheme();
  const navigate = useNavigate();

  // View / cart state
  const [viewMode, setViewMode]           = useState<ViewMode>('grid');
  const [cartOpen, setCartOpen]           = useState(false);
  const [cartItems, setCartItems]         = useState<CartEntry[]>([
    { id: 1, title: 'Status Asthmaticus - PAS B…', institution: "Children's Hospital Los Angeles" },
  ]);

  // Filter state
  const [searchQuery, setSearchQuery]             = useState('');
  const [selInstitutions, setSelInstitutions]     = useState<string[]>([]);
  const [selTypes, setSelTypes]                   = useState<string[]>([]);
  const [selSpecialties, setSelSpecialties]       = useState<string[]>([]);
  const [pricingFilter, setPricingFilter]         = useState('Free only');
  const [selKits, setSelKits]                     = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter]       = useState('Popular');
  const [sortFilter, setSortFilter]               = useState('Most Popular');

  // Active institution filter in hero strip
  const [activeInst, setActiveInst] = useState<InstKey | null>(null);

  function toggleMulti(setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) {
    setter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);
  }

  function removeCartItem(id: number) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <Box sx={(theme) => ({
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      bgcolor: theme.surface.canvas,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
    })}>

      {/* Skip link */}
      <Box
        component="a"
        href="#community-main"
        sx={{ position: 'absolute', left: '-999px', top: 0, zIndex: 9999, '&:focus': { left: 8, top: 8 } }}
      >
        Skip to main content
      </Box>

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={(theme) => ({
          position: 'sticky', top: 0, zIndex: theme.zIndex.appBar,
          display: 'flex', alignItems: 'center', gap: 2,
          px: 4, height: 60, flexShrink: 0,
          bgcolor: theme.surface.canvas,
          borderBottom: `1px solid ${theme.border.default}`,
          ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
        })}
      >
        {/* Logo */}
        <Tooltip title="Home">
          <ButtonBase
            onClick={() => navigate('/')}
            aria-label="Curbside Health home"
            sx={(theme) => ({
              width: 30, height: 30, borderRadius: `${theme.radius.md}px`,
              backgroundImage: theme.brand.gradient,
              display: 'grid', placeItems: 'center',
              color: 'common.white',
              fontWeight: theme.typography.fontWeightBold,
              fontFamily: theme.typography.h6.fontFamily,
              fontSize: theme.typography.h5.fontSize,
              letterSpacing: theme.letterSpacing.tight,
              flexShrink: 0,
              transition: theme.motion.short,
              '&:hover': { opacity: 0.9 },
            })}
          >
            C
          </ButtonBase>
        </Tooltip>

        {/* Nav */}
        <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          <ButtonBase
            aria-current="page"
            sx={(theme) => ({
              display: 'inline-flex', alignItems: 'center', gap: 1,
              height: 36, px: 2,
              borderRadius: `${theme.radius.md}px`,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontSize: theme.typography.body2.fontSize,
              fontWeight: theme.typography.fontWeightSemibold,
              transition: theme.motion.short,
            })}
          >
            <Globe size={16} />
            Community
          </ButtonBase>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Cart button */}
        <Tooltip title={`Cart, ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`}>
          <ButtonBase
            onClick={() => setCartOpen(true)}
            aria-label={`Cart, ${cartItems.length} items`}
            sx={(theme) => ({
              display: 'inline-flex', alignItems: 'center',
              height: 36, px: 2, position: 'relative',
              borderRadius: `${theme.radius.md}px`,
              color: 'text.secondary',
              transition: theme.motion.short,
              '&:hover': { bgcolor: theme.fill.default, color: 'text.primary' },
            })}
          >
            <ShoppingCart size={18} />
            {cartItems.length > 0 && (
              <Box sx={(theme) => ({
                position: 'absolute', top: 4, right: 2,
                minWidth: 16, height: 16, px: 1,
                bgcolor: 'primary.main', color: 'common.white',
                borderRadius: `${theme.radius.pill}px`,
                ...theme.typography.badge,
                display: 'grid', placeItems: 'center',
              })}>
                {cartItems.length}
              </Box>
            )}
          </ButtonBase>
        </Tooltip>

        {/* Avatar */}
        <Tooltip title="Account">
          <Avatar
            sx={(theme) => ({
              width: 32, height: 32,
              backgroundImage: theme.brand.gradient,
              fontSize: theme.typography.caption.fontSize,
              fontWeight: theme.typography.fontWeightBold,
              cursor: 'pointer',
            })}
            aria-label="Account"
          >
            H
          </Avatar>
        </Tooltip>
      </Box>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <Box
        component="section"
        aria-label="Community search"
        sx={(theme) => ({
          bgcolor: theme.surface.canvas,
          borderBottom: `1px solid ${theme.border.default}`,
          py: 7, px: { xs: 4, md: 9 },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 4, textAlign: 'center',
          ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
        })}
      >
        <Typography
          variant="h2"
          sx={{ maxWidth: 880, letterSpacing: '-0.02em', textWrap: 'balance' }}
        >
          Explore &amp; customize what other world-class institutions have created with Curbside!
        </Typography>

        {/* Search */}
        <Box sx={{ width: '100%', maxWidth: 680 }}>
          <Box
            component="label"
            htmlFor="community-search"
            sx={(theme) => ({
              display: 'flex', alignItems: 'center', gap: 2,
              height: 58, px: 3,
              border: `1px solid ${theme.border.default}`,
              borderRadius: `${theme.radius.pill}px`,
              bgcolor: theme.surface.canvas,
              transition: theme.motion.short,
              cursor: 'text',
              '&:focus-within': {
                borderColor: 'primary.main',
                ...focusRing(theme),
              },
              ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800], borderColor: theme.palette.grey[600] }),
            })}
          >
            <Box sx={{ color: 'text.disabled', display: 'flex', flexShrink: 0 }}>
              <Search size={20} />
            </Box>
            <InputBase
              id="community-search"
              type="search"
              placeholder="Search Pathways, Protocols, Documents & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{ 'aria-label': 'Search community content' }}
              sx={(t) => ({ flex: 1, fontSize: t.typography.h5.fontSize })}
            />
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                display: 'inline-flex', alignItems: 'center', gap: 1,
                px: 1, py: 1,
                bgcolor: theme.surface.subtle,
                border: `1px solid ${theme.border.default}`,
                borderRadius: `${theme.radius.sm}px`,
                ...theme.typography.kbd,
                color: 'text.disabled', whiteSpace: 'nowrap', flexShrink: 0,
              })}
            >
              ⌘ K
            </Box>
          </Box>
        </Box>

        {/* Institution logo strip */}
        <Box
          component="div"
          role="list"
          aria-label="Featured institutions"
          sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Typography sx={(theme) => ({
            ...theme.typography.overline,
            color: 'text.disabled',
          })}>
            Trusted by
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {([
              { instKey: 'chla' as InstKey,    label: "Children's Hospital Los Angeles" },
              { instKey: 'curbside' as InstKey, label: 'Curbside Open' },
              { instKey: 'osf' as InstKey,     label: 'OSF Medical Care Guidelines' },
              { instKey: 'ih' as InstKey,      label: 'iHealth' },
              { instKey: 'rainbow' as InstKey, label: "Rainbow Babies Children's Hospital" },
            ]).map(({ instKey, label }) => (
              <InstitutionHeroBadge
                key={instKey}
                instKey={instKey}
                label={label}
                active={activeInst === instKey}
                onClick={() => setActiveInst(activeInst === instKey ? null : instKey)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Content section ─────────────────────────────────────────────── */}
      <Box
        id="community-main"
        component="section"
        aria-label="Community content"
        sx={{ flex: 1, py: 5, px: { xs: 4, md: 9 }, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        {/* Filter bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>

          <FilterDropdown
            label="Institution"
            options={INSTITUTIONS}
            selected={selInstitutions}
            onToggle={(v) => toggleMulti(setSelInstitutions, v)}
          />

          <FilterDropdown
            label="Type"
            options={CONTENT_TYPES}
            selected={selTypes}
            onToggle={(v) => toggleMulti(setSelTypes, v)}
          />

          <FilterDropdown
            label="Specialties"
            options={SPECIALTIES}
            selected={selSpecialties}
            onToggle={(v) => toggleMulti(setSelSpecialties, v)}
          />

          <FilterDropdown
            label="Paid & free"
            options={PRICING_OPTIONS}
            selected={[pricingFilter]}
            onToggle={(v) => setPricingFilter(v)}
            multiSelect={false}
            badgeCount={pricingFilter !== 'All' ? 1 : 0}
          />

          <FilterDropdown
            label="Content Kit"
            options={KIT_OPTIONS}
            selected={selKits}
            onToggle={(v) => toggleMulti(setSelKits, v)}
          />

          <CategoryDropdown value={categoryFilter} onChange={setCategoryFilter} />

          {/* Right-side controls */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterDropdown
              label="Sort by"
              options={SORT_OPTIONS}
              selected={[sortFilter]}
              onToggle={(v) => setSortFilter(v)}
              multiSelect={false}
              badgeCount={1}
              rightAlign
            />

            {/* View toggles */}
            <Tooltip title="List view">
              <IconButton
                size="small"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                sx={(theme) => ({
                  width: 30, height: 30,
                  borderRadius: `${theme.radius.md}px`,
                  border: `1px solid ${viewMode === 'list' ? theme.palette.primary.main : theme.border.default}`,
                  bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : theme.surface.canvas,
                  color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                  transition: theme.motion.short,
                  '&:hover': { bgcolor: theme.fill.default, color: 'text.primary' },
                })}
              >
                <AlignJustify size={14} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Grid view">
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                sx={(theme) => ({
                  width: 30, height: 30,
                  borderRadius: `${theme.radius.md}px`,
                  border: `1px solid ${viewMode === 'grid' ? theme.palette.primary.main : theme.border.default}`,
                  bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : theme.surface.canvas,
                  color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                  transition: theme.motion.short,
                  '&:hover': { bgcolor: theme.fill.default, color: 'text.primary' },
                })}
              >
                <LayoutGrid size={14} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Cards */}
        <Box
          role="list"
          aria-label="Community pathways"
          sx={viewMode === 'grid' ? {
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          } : {
            display: 'flex', flexDirection: 'column', gap: 2,
          }}
        >
          {CARDS.map((card) => (
            <Box key={card.id} role="listitem">
              <ContentCard card={card} listView={viewMode === 'list'} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Cart drawer ──────────────────────────────────────────────────── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeCartItem}
      />
    </Box>
  );
}
