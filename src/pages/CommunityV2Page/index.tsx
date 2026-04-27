import { useState, type MouseEvent, type ReactNode } from 'react';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  Search, ChevronDown, LayoutGrid, AlignJustify, ShoppingCart, X as XIcon,
  Sparkles, Bell, Calculator, Heart, Zap, Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { focusRing } from '@/theme/recipes';
import { ChlaLogo, CurbsideOpenLogo, OsfLogo, IHealthMark, RainbowLogo } from './InstitutionLogos';

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
  { id: 1, institution: 'Memorial Sloan Kettering',           instKey: 'chla',     title: 'Acute Graft Versus Host Disease (AG…' },
  { id: 2, institution: 'Curbside Open',                      instKey: 'curbside', title: 'Measles Screening, Diagnosis And Tes…' },
  { id: 3, institution: 'OSF Medical Care Guidelines',        instKey: 'osf',     title: 'Timing Of Cesarean Section' },
  { id: 4, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow',  title: 'Asthma (5-11 Years) - Pediatric Initial…' },
  { id: 5, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow',  title: 'Appendicitis - Diagnosis And Initial M…' },
  { id: 6, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow',  title: 'Asthma 12+ Years - Pediatric Initial V…' },
  { id: 7, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow',  title: 'Obesity Or Overweight (≥/=10 Years)…' },
  { id: 8, institution: "Rainbow Babies Children's Hospital", instKey: 'rainbow',  title: 'Asthma (0-4 Years) - Pediatric Initial…', purpleThumb: true },
];

const INSTITUTIONS   = ['Memorial Sloan Kettering', "Children's Hospital Los Angeles", 'Curbside Open', 'OSF Medical Care Guidelines', "Rainbow Babies Children's"];
const CONTENT_TYPES  = ['Pathway', 'Protocol', 'Document', 'Calculator'];
const SPECIALTIES    = ['Pediatric Medicine', 'Emergency Medicine', 'Internal Medicine', 'Cardiology', 'Oncology', 'Neurology'];
const PRICING_OPTS   = ['All', 'Free only', 'Paid only'];
const KIT_OPTS       = ['Standard Kit', 'Premium Kit', 'Bundle'];
const SORT_OPTS      = ['Most Popular', 'Newest First', 'Alphabetical A–Z', 'Most Downloaded'];
const CATEGORY_OPTS: { value: string; icon: typeof Sparkles }[] = [
  { value: 'New',                icon: Sparkles   },
  { value: 'Popular',            icon: Bell       },
  { value: 'Calculators',        icon: Calculator },
  { value: 'Pediatric Medicine', icon: Heart      },
  { value: 'Emergency Medicine', icon: Zap        },
];

const HERO_INSTITUTIONS: { key: InstKey; label: string }[] = [
  { key: 'chla',     label: "Children's Hospital Los Angeles"    },
  { key: 'curbside', label: 'Curbside Open'                      },
  { key: 'osf',      label: 'OSF Medical Care Guidelines'        },
  { key: 'ih',       label: 'iHealth'                            },
  { key: 'rainbow',  label: "Rainbow Babies Children's Hospital" },
];

// ── Institution color recipes ─────────────────────────────────────────────────

const instHeroBg = (t: Theme, key: InstKey): string => {
  switch (key) {
    case 'chla':     return t.surface.canvas;
    case 'curbside': return t.palette.primary.main;
    case 'osf':      return alpha(t.palette.info.light, 0.18);
    case 'ih':       return t.palette.error.main;
    case 'rainbow':  return t.surface.canvas;
  }
};

const cardInstGradient = (t: Theme, key: InstKey): string => {
  switch (key) {
    case 'rainbow':  return `linear-gradient(135deg, ${t.palette.error.light}, ${t.palette.warning.light}, ${t.palette.success.light}, ${t.palette.info.light})`;
    case 'chla':     return `linear-gradient(135deg, ${t.palette.warning.main}, ${t.palette.warning.light})`;
    case 'curbside': return t.brand.gradient;
    case 'osf':      return `linear-gradient(135deg, ${t.palette.success.main}, ${t.palette.success.dark})`;
    case 'ih':       return `linear-gradient(135deg, ${t.palette.error.main}, ${t.palette.error.light})`;
  }
};

// ── InstitutionLogo ────────────────────────────────────────────────────────────

function InstitutionLogo({ instKey }: { instKey: InstKey }) {
  switch (instKey) {
    case 'chla':     return <ChlaLogo />;
    case 'curbside': return <CurbsideOpenLogo />;
    case 'osf':      return <OsfLogo />;
    case 'ih':       return <IHealthMark />;
    case 'rainbow':  return <RainbowLogo />;
  }
}

// ── FilterChipMenu ─────────────────────────────────────────────────────────────

interface FilterChipMenuProps {
  label: string;
  selectedCount?: number;
  hasSelection?: boolean;
  startIcon?: ReactNode;
  menuAlign?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
}

function FilterChipMenu({ label, selectedCount, hasSelection, startIcon, menuAlign = 'start', children }: FilterChipMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  const active = hasSelection ?? (selectedCount ?? 0) > 0;

  return (
    <>
      <Button
        onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
        aria-haspopup="listbox"
        aria-expanded={open}
        startIcon={startIcon}
        endIcon={<ChevronDown size={14} />}
        sx={(t) => ({
          height: 30,
          px: 3,
          borderRadius: `${t.radius.md}px`,
          fontSize: t.typography.caption.fontSize,
          fontWeight: 'medium',
          color: active ? t.palette.primary.main : t.palette.text.secondary,
          border: `1px solid ${active ? t.palette.primary.main : t.border.default}`,
          bgcolor: active ? alpha(t.palette.primary.main, t.palette.action.hoverOpacity * 2) : t.surface.canvas,
          textTransform: 'none',
          whiteSpace: 'nowrap',
          transition: t.motion.short,
          '&:hover': { bgcolor: active ? alpha(t.palette.primary.main, t.palette.action.hoverOpacity * 3) : t.palette.action.hover },
        })}
      >
        {label}
        {selectedCount && selectedCount > 0 ? (
          <Box
            component="span"
            sx={(t) => ({
              ml: 1,
              minWidth: t.spacing(4),
              height: t.spacing(4),
              px: 1,
              borderRadius: `${t.radius.pill}px`,
              bgcolor: t.palette.primary.main,
              color: t.palette.primary.contrastText,
              fontSize: t.typography.badge.fontSize,
              fontWeight: 'bold',
              display: 'inline-grid',
              placeItems: 'center',
              lineHeight: 1,
            })}
          >
            {selectedCount}
          </Box>
        ) : null}
      </Button>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: menuAlign === 'end' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: menuAlign === 'end' ? 'right' : 'left' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1,
              minWidth: 220,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              bgcolor: t.surface.overlay,
              boxShadow: t.shadows[t.elevation.high],
            }),
          },
        }}
      >
        {children(() => setAnchor(null))}
      </Menu>
    </>
  );
}

function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={(t) => ({
        display: 'block',
        px: 3,
        pt: 2,
        pb: 1,
        fontSize: t.typography.badge.fontSize,
        fontWeight: 'fontWeightSemibold',
        color: t.palette.text.muted,
        letterSpacing: t.letterSpacing.tight,
      })}
    >
      {children}
    </Typography>
  );
}

// ── MultiCheckMenu ─────────────────────────────────────────────────────────────

function MultiCheckMenu({
  label, options, selected, setSelected, heading,
}: {
  label: string;
  heading: string;
  options: string[];
  selected: string[];
  setSelected: (next: string[]) => void;
}) {
  return (
    <FilterChipMenu label={label} selectedCount={selected.length}>
      {() => (
        <>
          <DropdownLabel>{heading}</DropdownLabel>
          <MenuList sx={{ py: 0 }}>
            {options.map((opt) => {
              const isSel = selected.includes(opt);
              return (
                <MenuItem
                  key={opt}
                  onClick={() => setSelected(isSel ? selected.filter((o) => o !== opt) : [...selected, opt])}
                  selected={isSel}
                  sx={(t) => ({
                    borderRadius: `${t.radius.md}px`,
                    mx: 1,
                    fontSize: t.typography.body2.fontSize,
                    fontWeight: isSel ? 'fontWeightSemibold' : 'medium',
                    color: isSel ? t.palette.primary.main : t.palette.text.secondary,
                  })}
                >
                  <Checkbox checked={isSel} size="small" disableRipple sx={{ mr: 1, p: 0 }} />
                  <ListItemText primary={opt} />
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </FilterChipMenu>
  );
}

// ── SingleRadioMenu ────────────────────────────────────────────────────────────

function SingleRadioMenu({
  label, heading, options, value, onChange, menuAlign,
}: {
  label: string;
  heading: string;
  options: string[];
  value: string | null;
  onChange: (next: string) => void;
  menuAlign?: 'start' | 'end';
}) {
  return (
    <FilterChipMenu label={label} hasSelection={value !== null} selectedCount={value !== null ? 1 : 0} menuAlign={menuAlign}>
      {(close) => (
        <>
          <DropdownLabel>{heading}</DropdownLabel>
          <MenuList sx={{ py: 0 }}>
            {options.map((opt) => {
              const isSel = value === opt;
              return (
                <MenuItem
                  key={opt}
                  onClick={() => { onChange(opt); close(); }}
                  selected={isSel}
                  sx={(t) => ({
                    borderRadius: `${t.radius.md}px`,
                    mx: 1,
                    fontSize: t.typography.body2.fontSize,
                    fontWeight: isSel ? 'fontWeightSemibold' : 'medium',
                    color: isSel ? t.palette.primary.main : t.palette.text.secondary,
                  })}
                >
                  <Radio checked={isSel} size="small" disableRipple sx={{ mr: 1, p: 0 }} />
                  <ListItemText primary={opt} />
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </FilterChipMenu>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function CommunityV2Page() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [types,        setTypes]        = useState<string[]>([]);
  const [specs,        setSpecs]        = useState<string[]>([]);
  const [pricing,      setPricing]      = useState<string | null>('Free only');
  const [kits,         setKits]         = useState<string[]>([]);
  const [category,     setCategory]     = useState<string>('Popular');
  const [sort,         setSort]         = useState<string | null>('Most Popular');
  const [view,         setView]         = useState<ViewMode>('grid');
  const [cartOpen,     setCartOpen]     = useState(false);
  const [cart,         setCart]         = useState<CartEntry[]>([
    { id: 1, title: 'Status Asthmaticus - PAS B…', institution: "Children's Hospital Los Angeles" },
  ]);

  const removeCartItem = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));
  const CategoryIcon = CATEGORY_OPTS.find((o) => o.value === category)?.icon ?? Flame;

  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        bgcolor: t.surface.canvas,
        color: t.palette.text.primary,
        fontSize: t.typography.body2.fontSize,
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
      })}
    >
      {/* ── Topbar ────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={(t) => ({
          bgcolor: t.surface.canvas,
          borderBottom: `1px solid ${t.border.default}`,
          color: t.palette.text.primary,
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[700] }),
        })}
      >
        <Toolbar
          sx={(t) => ({
            gap: 4,
            px: { xs: 5, md: 7 },
            minHeight: 60,
          })}
        >
          <Box
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            sx={(t) => ({
              width: 30,
              height: 30,
              borderRadius: `${t.radius.md}px`,
              background: t.brand.gradient,
              display: 'grid',
              placeItems: 'center',
              color: t.palette.primary.contrastText,
              fontFamily: t.typography.h6.fontFamily,
              fontWeight: 'bold',
              fontSize: t.typography.subtitle2.fontSize,
              letterSpacing: t.letterSpacing.tight,
              cursor: 'pointer',
              flexShrink: 0,
            })}
            aria-label="Go to home"
          >
            C
          </Box>

          <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Button
              variant="text"
              startIcon={<Globe size={16} aria-hidden />}
              sx={(t) => ({
                height: 36,
                px: 3,
                borderRadius: `${t.radius.md}px`,
                fontSize: t.typography.caption.fontSize,
                fontWeight: 'fontWeightSemibold',
                textTransform: 'none',
                color: t.palette.primary.main,
                bgcolor: t.palette.action.selected,
                border: 'none',
                minWidth: 0,
                '&:hover': { bgcolor: t.palette.action.selected },
              })}
            >
              Community
            </Button>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Tooltip title={`Cart, ${cart.length} item${cart.length === 1 ? '' : 's'}`}>
            <IconButton
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${cart.length} items`}
              aria-expanded={cartOpen}
              size="medium"
              sx={(t) => ({
                color: t.palette.text.secondary,
                '&:hover': { color: t.palette.text.primary },
              })}
            >
              <Badge
                badgeContent={cart.length}
                color="primary"
                slotProps={{
                  badge: {
                    sx: (t: Theme) => ({
                      fontSize: t.typography.badge.fontSize,
                      fontWeight: 'bold',
                      height: t.spacing(4),
                      minWidth: t.spacing(4),
                    }),
                  },
                }}
              >
                <ShoppingCart size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <Avatar
              sx={(t) => ({
                width: t.spacing(7),
                height: t.spacing(7),
                fontSize: t.typography.caption.fontSize,
                fontWeight: 'bold',
                color: t.palette.primary.contrastText,
                background: t.brand.gradient,
                cursor: 'pointer',
              })}
            >
              H
            </Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box
        component="section"
        aria-label="Community search"
        sx={(t) => ({
          bgcolor: t.surface.canvas,
          borderBottom: `1px solid ${t.border.default}`,
          px: { xs: 6, md: 11 },
          pt: { xs: 9, md: 11 },
          pb: { xs: 8, md: 9 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          textAlign: 'center',
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[700] }),
        })}
      >
        <Typography
          variant="h2"
          sx={(t) => ({
            fontFamily: t.typography.h2.fontFamily,
            fontSize: { xs: t.typography.h2.fontSize, md: t.typography.h1.fontSize },
            fontWeight: 'bold',
            lineHeight: 1.25,
            color: t.palette.text.primary,
            maxWidth: 880,
            m: 0,
            letterSpacing: t.letterSpacing.tight,
            textWrap: 'balance',
          })}
        >
          Explore &amp; customize what other world-class institutions have created with Curbside!
        </Typography>

        {/* Big search bar */}
        <Box
          sx={(t) => ({
            width: '100%',
            maxWidth: 680,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            height: 58,
            px: 5,
            border: `1px solid ${t.border.default}`,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: t.surface.canvas,
            transition: t.motion.short,
            '&:focus-within': {
              borderColor: t.palette.primary.main,
              ...focusRing(t),
            },
            ...t.applyStyles('dark', { bgcolor: t.palette.grey[800] }),
          })}
        >
          <Search size={20} aria-hidden />
          <InputBase
            type="search"
            placeholder="Search Pathways, Protocols, Documents & more..."
            inputProps={{ 'aria-label': 'Search community content', autoComplete: 'off' }}
            sx={(t) => ({
              flex: 1,
              fontFamily: t.typography.body1.fontFamily,
              fontSize: t.typography.subtitle1.fontSize,
              color: t.palette.text.primary,
            })}
          />
          <Box
            component="kbd"
            sx={(t) => ({
              ...t.typography.kbd,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: t.surface.subtle,
              border: `1px solid ${t.border.default}`,
              borderRadius: `${t.radius.sm}px`,
              color: t.palette.text.muted,
              whiteSpace: 'nowrap',
            })}
            aria-hidden
          >
            ⌘ K
          </Box>
        </Box>

        {/* Institution logo strip */}
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {HERO_INSTITUTIONS.map((inst) => (
            <Tooltip key={inst.key} title={inst.label} placement="top">
              <ButtonBase
                aria-label={inst.label}
                sx={(t) => ({
                  width: 44,
                  height: 44,
                  borderRadius: `${t.radius.xl}px`,
                  bgcolor: instHeroBg(t, inst.key),
                  border: `1px solid ${t.border.subtle}`,
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: t.shadows[t.elevation.low],
                  transition: t.motion.short,
                  '&:hover': {
                    boxShadow: t.shadows[t.elevation.high],
                    transform: 'translateY(-4px)',
                  },
                })}
              >
                <InstitutionLogo instKey={inst.key} />
              </ButtonBase>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <Box
        component="section"
        aria-label="Community content"
        sx={(t) => ({
          flex: 1,
          px: { xs: 6, md: 11 },
          py: { xs: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        })}
      >
        {/* Filter row */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 2 }}>
          <MultiCheckMenu  label="Institution"   heading="Institution"  options={INSTITUTIONS}  selected={institutions} setSelected={setInstitutions} />
          <MultiCheckMenu  label="Type"          heading="Content Type" options={CONTENT_TYPES} selected={types}        setSelected={setTypes} />
          <MultiCheckMenu  label="Specialties"   heading="Specialty"    options={SPECIALTIES}   selected={specs}        setSelected={setSpecs} />
          <SingleRadioMenu label="Paid & free"   heading="Pricing"      options={PRICING_OPTS}  value={pricing}         onChange={setPricing} />
          <MultiCheckMenu  label="Content Kit"   heading="Kit Type"     options={KIT_OPTS}      selected={kits}         setSelected={setKits} />

          <FilterChipMenu
            label={category}
            hasSelection
            startIcon={<AlignJustify size={13} />}
          >
            {(close) => (
              <MenuList sx={{ py: 1 }}>
                {CATEGORY_OPTS.map(({ value, icon: Icon }) => {
                  const isSel = value === category;
                  return (
                    <MenuItem
                      key={value}
                      onClick={() => { setCategory(value); close(); }}
                      selected={isSel}
                      sx={(t) => ({
                        borderRadius: `${t.radius.md}px`,
                        mx: 1,
                        fontSize: t.typography.body2.fontSize,
                        fontWeight: isSel ? 'fontWeightSemibold' : 'medium',
                        color: isSel ? t.palette.primary.main : t.palette.text.secondary,
                        ...(isSel && { bgcolor: alpha(t.palette.primary.main, t.palette.action.hoverOpacity * 2) }),
                      })}
                    >
                      <ListItemIcon sx={(t) => ({ color: isSel ? t.palette.primary.main : t.palette.text.muted, minWidth: t.spacing(7) })}>
                        <Icon size={15} />
                      </ListItemIcon>
                      <ListItemText primary={value} />
                    </MenuItem>
                  );
                })}
              </MenuList>
            )}
          </FilterChipMenu>

          <Box sx={{ flex: 1 }} />

          <SingleRadioMenu
            label="Sort by"
            heading="Sort by"
            options={SORT_OPTS}
            value={sort}
            onChange={setSort}
            menuAlign="end"
          />

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, next: ViewMode | null) => next && setView(next)}
            aria-label="View mode"
            sx={(t) => ({
              gap: 1,
              '& .MuiToggleButton-root': {
                width: 30,
                height: 30,
                p: 0,
                border: `1px solid ${t.border.default}`,
                borderRadius: `${t.radius.md}px !important`,
                color: t.palette.text.secondary,
                transition: t.motion.short,
                '&:hover': { bgcolor: t.palette.action.hover, color: t.palette.text.primary },
                '&.Mui-selected': {
                  bgcolor: t.palette.action.selected,
                  color: t.palette.primary.main,
                  borderColor: t.palette.primary.main,
                  '&:hover': { bgcolor: t.palette.action.selected },
                },
              },
            })}
          >
            <ToggleButton value="list" aria-label="List view"><AlignJustify size={16} /></ToggleButton>
            <ToggleButton value="grid" aria-label="Grid view"><LayoutGrid size={16} /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Cards grid / list */}
        <Box
          role="list"
          aria-label="Community pathways"
          sx={(t) => ({
            display: 'grid',
            gap: view === 'list' ? 3 : 5,
            gridTemplateColumns: view === 'list'
              ? '1fr'
              : { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          })}
        >
          {CARDS.map((card) => (
            <CommunityCardItem key={card.id} card={card} view={view} />
          ))}
        </Box>
      </Box>

      {/* ── Cart drawer ──────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        slotProps={{
          paper: {
            sx: (t: Theme) => ({
              width: 300,
              p: 5,
              gap: 4,
              bgcolor: t.surface.canvas,
              borderLeft: `1px solid ${t.border.default}`,
              boxShadow: t.shadows[t.elevation.high],
              ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[700] }),
            }),
          },
        }}
      >
        <IconButton
          onClick={() => setCartOpen(false)}
          aria-label="Close cart"
          size="small"
          sx={(t) => ({
            position: 'absolute',
            top: t.spacing(3),
            right: t.spacing(3),
            color: t.palette.text.secondary,
            '&:hover': { color: t.palette.text.primary },
          })}
        >
          <XIcon size={16} />
        </IconButton>

        <Stack spacing={4} sx={{ pt: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={(t) => ({
              fontFamily: t.typography.h6.fontFamily,
              fontWeight: 'bold',
              color: t.palette.text.primary,
              m: 0,
            })}
          >
            Your cart
          </Typography>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              sx={(t) => ({
                fontSize: t.typography.h5.fontSize,
                fontWeight: 'bold',
                color: t.palette.text.primary,
                lineHeight: 1,
              })}
            >
              {cart.length}
            </Typography>
            <ShoppingCart size={18} aria-hidden />
          </Stack>

          <Typography variant="body2" sx={(t) => ({ color: t.palette.text.secondary })}>
            Subtotal: <Box component="strong" sx={(t) => ({ color: t.palette.text.primary })}>$0</Box>
          </Typography>

          <Button variant="contained" color="primary" fullWidth>Checkout</Button>

          <Divider />

          <Stack spacing={3}>
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} onRemove={removeCartItem} />
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}

// ── CommunityCardItem ──────────────────────────────────────────────────────────

function CommunityCardItem({ card, view }: { card: CommunityCard; view: ViewMode }) {
  const isList = view === 'list';

  return (
    <Card
      role="listitem"
      sx={(t) => ({
        border: `1px solid ${t.border.default}`,
        borderRadius: `${t.radius.lg}px`,
        bgcolor: t.surface.canvas,
        transition: t.motion.short,
        overflow: 'hidden',
        '&:hover': {
          borderColor: t.border.strong,
          boxShadow: t.shadows[t.elevation.low],
          transform: 'translateY(-4px)',
        },
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[800], borderColor: t.palette.grey[700] }),
      })}
    >
      <CardActionArea
        sx={(t) => ({
          display: 'flex',
          flexDirection: isList ? 'row' : 'column',
          alignItems: 'stretch',
          height: isList ? 92 : 'auto',
        })}
        aria-label={`${card.title}, ${card.institution}`}
      >
        {/* Thumb */}
        <Box
          sx={(t) => ({
            width: isList ? 130 : '100%',
            height: isList ? '100%' : 130,
            flexShrink: 0,
            bgcolor: card.purpleThumb ? undefined : t.surface.subtle,
            ...(card.purpleThumb && {
              background: `linear-gradient(135deg, ${t.palette.primary.light}, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
            }),
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: isList ? `1px solid ${t.border.default}` : 'none',
            ...t.applyStyles('dark', { bgcolor: card.purpleThumb ? undefined : t.palette.grey[900] }),
          })}
        >
          {!card.purpleThumb && <ThumbLines />}
        </Box>

        {/* Body */}
        <Stack
          direction={isList ? 'row' : 'column'}
          spacing={isList ? 6 : 2}
          sx={{
            alignItems: isList ? 'center' : 'stretch',
            p: isList ? 3 : 4,
            px: isList ? 5 : 4,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', minWidth: isList ? 180 : 'auto', flexShrink: 0 }}
          >
            <Box
              sx={(t) => ({
                width: t.spacing(5),
                height: t.spacing(5),
                borderRadius: `${t.radius.pill}px`,
                border: `1px solid ${t.border.default}`,
                background: cardInstGradient(t, card.instKey),
                flexShrink: 0,
              })}
              aria-hidden
            />
            <Typography
              sx={(t) => ({
                fontSize: t.typography.badge.fontSize,
                color: t.palette.text.muted,
                fontWeight: 'medium',
              })}
            >
              {card.institution}
            </Typography>
          </Stack>

          <Typography
            component="h3"
            sx={(t) => ({
              fontSize: isList ? t.typography.body2.fontSize : t.typography.caption.fontSize,
              fontWeight: 'fontWeightSemibold',
              color: t.palette.text.primary,
              lineHeight: 1.35,
              flex: isList ? 1 : 'unset',
              ...(isList && {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }),
            })}
          >
            {card.title}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

function ThumbLines() {
  const widths = ['100%', '80%', '65%', '90%', '55%'];
  return (
    <Stack
      spacing={1}
      sx={{ width: '72%', opacity: 0.5 }}
      aria-hidden
    >
      {widths.map((w, i) => (
        <Box
          key={i}
          sx={(t) => ({
            height: 6,
            width: w,
            borderRadius: `${t.radius.sm}px`,
            bgcolor: t.border.strong,
          })}
        />
      ))}
    </Stack>
  );
}

// ── CartItemRow ────────────────────────────────────────────────────────────────

function CartItemRow({ item, onRemove }: { item: CartEntry; onRemove: (id: number) => void }) {
  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        gap: 3,
        p: 3,
        borderRadius: `${t.radius.md}px`,
        border: `1px solid ${t.border.default}`,
        bgcolor: t.surface.subtle,
        position: 'relative',
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[800], borderColor: t.palette.grey[700] }),
      })}
    >
      <Box
        sx={(t) => ({
          width: 48,
          height: 40,
          borderRadius: `${t.radius.sm}px`,
          bgcolor: t.surface.raised,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[700] }),
        })}
      >
        <Stack spacing={1} sx={{ width: '80%' }} aria-hidden>
          {['100%', '70%', '85%'].map((w, i) => (
            <Box key={i} sx={(t) => ({ height: 3, width: w, borderRadius: `${t.radius.sm}px`, bgcolor: t.border.strong })} />
          ))}
        </Stack>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={(t) => ({
            fontSize: t.typography.badge.fontSize,
            fontWeight: 'fontWeightSemibold',
            color: t.palette.text.primary,
            lineHeight: 1.3,
          })}
        >
          {item.title}
        </Typography>
        <Typography
          sx={(t) => ({
            fontSize: t.typography.badge.fontSize,
            color: t.palette.text.muted,
            mt: 1,
          })}
        >
          {item.institution}
        </Typography>
      </Box>
      <IconButton
        aria-label={`Remove ${item.title} from cart`}
        onClick={() => onRemove(item.id)}
        size="small"
        sx={(t) => ({
          position: 'absolute',
          top: t.spacing(2),
          right: t.spacing(2),
          width: 22,
          height: 22,
          color: t.palette.text.muted,
          '&:hover': {
            bgcolor: alpha(t.palette.error.main, t.palette.action.hoverOpacity * 2),
            color: t.palette.error.main,
          },
        })}
      >
        <XIcon size={12} />
      </IconButton>
    </Box>
  );
}
