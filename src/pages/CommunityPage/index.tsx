import React, { useState, useMemo, useRef } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Badge from '@mui/material/Badge';
import {
  Search, Download, Plus, ChevronDown, List, LayoutGrid,
  GitBranch, FileText, ClipboardList, Calculator,
  ShoppingBag, X, Check, ArrowDownUp, MoreHorizontal, Trash2,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ContentType = 'pathway' | 'protocol' | 'calculator' | 'document';
type SortKey = 'popular' | 'recent' | 'title-az' | 'title-za' | 'inst';
type ViewMode = 'list' | 'grid';
type AccessType = 'free' | 'paid';
type PaletteIntent = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

interface Institution { id: string; name: string; short: string; colorKey: PaletteIntent }
interface CommunityItem {
  id: number; title: string; type: ContentType; instId: string;
  specs: string[]; access: AccessType; updated: string; draft: boolean;
}
interface ActiveFilters {
  specialty: Set<string>;
  type: Set<ContentType>;
  institution: Set<string>;
  access: Set<AccessType>;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const INSTITUTIONS: Institution[] = [
  { id: 'rbch',  name: "Rainbow Babies Children's Hospital",       short: 'RBH',  colorKey: 'error'   },
  { id: 'mskcc', name: 'Memorial Sloan Kettering Cancer Center',   short: 'MSK',  colorKey: 'info'    },
  { id: 'chla',  name: 'Children\'s Hospital Los Angeles',         short: 'CHLA', colorKey: 'secondary'},
  { id: 'osf',   name: 'OSF Medical Care Guidelines',              short: 'OSF',  colorKey: 'success' },
  { id: 'cbo',   name: 'Curbside Open',                            short: 'CBO',  colorKey: 'primary' },
  { id: 'chop',  name: 'Children\'s Hospital of Philadelphia',     short: 'CHOP', colorKey: 'warning' },
  { id: 'bwh',   name: 'Brigham & Women\'s Hospital',              short: 'BWH',  colorKey: 'secondary'},
];

const ITEMS: CommunityItem[] = [
  { id: 1,  title: 'Acute Graft Versus Host Disease (aGVHD) After Allogeneic Stem Cell Transplant', type: 'pathway',    instId: 'mskcc', specs: ['Oncology'],                                  access: 'free', updated: '3d ago',  draft: false },
  { id: 2,  title: 'Measles Screening, Diagnosis and Testing in Ambulatory Care',                   type: 'protocol',   instId: 'cbo',   specs: ['Infectious Disease', 'Primary Care'],        access: 'free', updated: '1w ago',  draft: false },
  { id: 3,  title: 'Timing of Cesarean Section for Placenta Previa and Accreta Spectrum',           type: 'pathway',    instId: 'osf',   specs: ['Obstetrics'],                                access: 'free', updated: '2w ago',  draft: false },
  { id: 4,  title: 'Asthma (5–11 Years) — Pediatric Initial Visit and Follow-up',                   type: 'pathway',    instId: 'rbch',  specs: ['Pediatric Medicine', 'Pulmonology'],         access: 'free', updated: '5d ago',  draft: true  },
  { id: 5,  title: 'Appendicitis — Diagnosis and Initial Management in Children',                    type: 'pathway',    instId: 'rbch',  specs: ['Pediatric Medicine', 'Emergency Medicine'],  access: 'free', updated: '1d ago',  draft: false },
  { id: 6,  title: 'Asthma (12+ Years) — Pediatric Initial Visit Clinical Pathway',                 type: 'pathway',    instId: 'rbch',  specs: ['Pediatric Medicine', 'Pulmonology'],         access: 'free', updated: '3w ago',  draft: false },
  { id: 7,  title: 'Asthma (0–4 Years) — Pediatric Initial Visit Clinical Pathway',                 type: 'pathway',    instId: 'rbch',  specs: ['Pediatric Medicine', 'Pulmonology'],         access: 'free', updated: '2mo ago', draft: false },
  { id: 8,  title: 'Obesity or Overweight (≥10 Years) — Assessment and Initial Counseling',         type: 'pathway',    instId: 'rbch',  specs: ['Pediatric Medicine', 'Primary Care'],        access: 'free', updated: '4d ago',  draft: false },
  { id: 9,  title: 'Pediatric Suicide Risk Screen (ASQ) and Assessment (SAFE-T) in Primary Care',   type: 'pathway',    instId: 'chop',  specs: ['Psychiatry', 'Primary Care'],                access: 'free', updated: '6d ago',  draft: false },
  { id: 10, title: 'Sepsis — Adult ED Initial Evaluation and Resuscitation Bundle',                  type: 'pathway',    instId: 'bwh',   specs: ['Emergency Medicine', 'Infectious Disease'],  access: 'free', updated: '12h ago', draft: false },
  { id: 11, title: 'Pediatric Early Warning Score (PEWS) Calculator',                               type: 'calculator', instId: 'chla',  specs: ['Pediatric Medicine'],                        access: 'free', updated: '1mo ago', draft: false },
  { id: 12, title: 'CHA₂DS₂-VASc Score for Atrial Fibrillation Stroke Risk',                        type: 'calculator', instId: 'cbo',   specs: ['Cardiology'],                                access: 'free', updated: '3mo ago', draft: false },
  { id: 13, title: 'Diabetic Ketoacidosis — Pediatric Management Protocol',                         type: 'protocol',   instId: 'rbch',  specs: ['Pediatric Medicine', 'Endocrinology'],       access: 'free', updated: '2w ago',  draft: false },
  { id: 14, title: 'Neutropenic Fever — Oncology Admission Pathway',                                type: 'pathway',    instId: 'mskcc', specs: ['Oncology', 'Emergency Medicine'],            access: 'paid', updated: '2mo ago', draft: false },
  { id: 15, title: 'Bronchiolitis — Supportive Care and Admission Criteria (0–24 Months)',           type: 'pathway',    instId: 'chla',  specs: ['Pediatric Medicine', 'Pulmonology'],         access: 'free', updated: '1w ago',  draft: false },
  { id: 16, title: 'Febrile Infant (0–60 Days) — Evaluation and Management',                        type: 'pathway',    instId: 'chop',  specs: ['Pediatric Medicine', 'Emergency Medicine'],  access: 'free', updated: '5d ago',  draft: false },
  { id: 17, title: 'Community-Acquired Pneumonia (CAP) — Adult Outpatient',                         type: 'document',   instId: 'cbo',   specs: ['Primary Care', 'Infectious Disease'],        access: 'free', updated: '3w ago',  draft: false },
  { id: 18, title: 'Stroke — Acute Ischemic Stroke Hyperacute Pathway',                             type: 'pathway',    instId: 'bwh',   specs: ['Neurology', 'Emergency Medicine'],           access: 'free', updated: '4d ago',  draft: false },
];

const SPECIALTIES = [
  'Cardiology', 'Emergency Medicine', 'Endocrinology', 'Infectious Disease',
  'Neurology', 'Obstetrics', 'Oncology', 'Pediatric Medicine', 'Primary Care',
  'Psychiatry', 'Pulmonology',
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'popular',  label: 'Most popular' },
  { id: 'recent',   label: 'Recently updated' },
  { id: 'title-az', label: 'Title A → Z' },
  { id: 'title-za', label: 'Title Z → A' },
  { id: 'inst',     label: 'Institution' },
];

const TYPE_ICON: Record<ContentType, React.ReactNode> = {
  pathway:    <GitBranch    size={14} />,
  protocol:   <ClipboardList size={14} />,
  calculator: <Calculator   size={14} />,
  document:   <FileText     size={14} />,
};

const TYPE_ICON_LG: Record<ContentType, React.ReactNode> = {
  pathway:    <GitBranch    size={22} />,
  protocol:   <ClipboardList size={22} />,
  calculator: <Calculator   size={22} />,
  document:   <FileText     size={22} />,
};

const TYPE_LABEL: Record<ContentType, string> = {
  pathway: 'Pathway', protocol: 'Protocol', calculator: 'Calculator', document: 'Document',
};

function getInst(id: string) { return INSTITUTIONS.find((i) => i.id === id)!; }

// ─── InstLogo ──────────────────────────────────────────────────────────────────

function InstLogo({ instId, size = 22 }: { instId: string; size?: number }) {
  const inst = getInst(instId);
  return (
    <Box
      aria-label={inst.name}
      sx={(t) => ({
        height: size, minWidth: size,
        px: `${Math.round(size * 0.2)}px`,
        borderRadius: `${t.radius.sm}px`,
        bgcolor: t.palette[inst.colorKey].main,
        color: t.palette[inst.colorKey].contrastText,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: Math.max(8, Math.round(size * 0.38)),
        fontWeight: 'bold', lineHeight: 1, letterSpacing: '-0.02em',
      })}
    >
      {inst.short}
    </Box>
  );
}

// ─── TypePill ──────────────────────────────────────────────────────────────────

const TYPE_INTENT: Record<ContentType, PaletteIntent> = {
  pathway: 'primary', protocol: 'success', calculator: 'info', document: 'secondary',
};

function TypePill({ type }: { type: ContentType }) {
  const intent = TYPE_INTENT[type];
  return (
    <Box
      sx={(t) => ({
        display: 'inline-flex', alignItems: 'center', gap: 1,
        px: 2, py: 1,
        borderRadius: `${t.radius.pill}px`,
        bgcolor: alpha(t.palette[intent].main, 0.10),
        color: t.palette[intent].dark,
        fontSize: t.typography.caption.fontSize,
        fontWeight: t.typography.fontWeightSemibold,
        whiteSpace: 'nowrap',
      })}
    >
      {TYPE_ICON[type]}
      {TYPE_LABEL[type]}
    </Box>
  );
}

// ─── DraftPill ────────────────────────────────────────────────────────────────

function DraftPill() {
  return (
    <Box
      sx={(t) => ({
        display: 'inline-flex', alignItems: 'center',
        px: 2, py: 1,
        borderRadius: `${t.radius.sm}px`,
        bgcolor: alpha(t.palette.warning.main, 0.10),
        color: t.palette.warning.dark,
        fontSize: '10px',
        fontWeight: t.typography.fontWeightBold,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      })}
    >
      Draft
    </Box>
  );
}

// ─── FilterMenu ────────────────────────────────────────────────────────────────

interface FilterMenuProps {
  label: string;
  options: { id: string; label: string; count?: number; prefix?: React.ReactNode }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
  searchable?: boolean;
  radio?: boolean;
}

function FilterMenu({ label, options, selected, onToggle, onClear, searchable, radio }: FilterMenuProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState('');
  const active = !radio && selected.size > 0;
  const filtered = menuQuery
    ? options.filter((o) => o.label.toLowerCase().includes(menuQuery.toLowerCase()))
    : options;

  return (
    <>
      <Box
        component="button"
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        sx={(t) => ({
          height: 34, px: 3,
          display: 'inline-flex', alignItems: 'center', gap: 2,
          bgcolor: active ? alpha(t.palette.primary.main, 0.08) : t.surface.overlay,
          border: `1px solid ${active ? t.palette.primary.main : t.border.default}`,
          borderRadius: `${t.radius.md}px`,
          fontSize: t.typography.body2.fontSize,
          fontWeight: t.typography.fontWeightMedium,
          color: active ? t.palette.primary.dark : t.palette.text.primary,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: t.motion.short,
          '&:hover': { bgcolor: active ? alpha(t.palette.primary.main, 0.12) : t.surface.subtle, borderColor: active ? t.palette.primary.dark : t.border.strong },
          '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
        })}
      >
        {label}
        {active && (
          <Box
            sx={(t) => ({
              minWidth: 18, height: 18, px: 1, borderRadius: `${t.radius.pill}px`,
              bgcolor: 'primary.main', color: 'primary.contrastText',
              fontSize: '11px', fontWeight: 'bold',
              display: 'inline-grid', placeItems: 'center',
            })}
          >
            {selected.size}
          </Box>
        )}
        <Box component="span" sx={{ color: 'text.secondary', display: 'flex', ml: -1 }}>
          <ChevronDown size={12} />
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={btnRef.current}
        onClose={() => { setOpen(false); setMenuQuery(''); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1, minWidth: 280, maxWidth: 340,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              boxShadow: t.elevation.high,
              bgcolor: t.surface.overlay,
              p: 2,
            }),
          },
        }}
      >
        {searchable && (
          <Box
            sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 1,
              px: 2, py: 2, mb: 1,
              bgcolor: t.surface.subtle,
              borderRadius: `${t.radius.md}px`,
            })}
          >
            <Box sx={{ color: 'text.secondary', display: 'flex', flexShrink: 0 }}><Search size={13} /></Box>
            <Box
              component="input"
              value={menuQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMenuQuery(e.target.value)}
              placeholder={`Find ${label.toLowerCase()}`}
              sx={(t) => ({
                flex: 1, border: 0, outline: 0, background: 'transparent',
                fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
                color: t.palette.text.primary,
                '&::placeholder': { color: t.palette.text.muted },
              })}
            />
          </Box>
        )}

        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
          {filtered.map((opt) => {
            const checked = selected.has(opt.id);
            return (
              <Box
                key={opt.id}
                component="button"
                onClick={() => onToggle(opt.id)}
                sx={(t) => ({
                  display: 'flex', alignItems: 'center', gap: 2,
                  width: '100%', px: 3, py: 2,
                  borderRadius: `${t.radius.md}px`,
                  border: 0, background: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
                  color: t.palette.text.primary, textAlign: 'left',
                  transition: t.motion.short,
                  '&:hover': { bgcolor: t.fill.default },
                })}
              >
                <Box
                  sx={(t) => ({
                    width: 16, height: 16, flexShrink: 0,
                    borderRadius: radio ? `${t.radius.pill}px` : `${t.radius.sm}px`,
                    border: `1.5px solid ${checked ? t.palette.primary.main : t.border.strong}`,
                    bgcolor: checked && !radio ? 'primary.main' : t.surface.overlay,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  })}
                >
                  {radio && checked && (
                    <Box sx={(t) => ({ width: 8, height: 8, borderRadius: `${t.radius.pill}px`, bgcolor: 'primary.main' })} />
                  )}
                  {!radio && checked && <Check size={10} color="white" />}
                </Box>
                {opt.prefix}
                <Typography variant="body2" sx={{ flex: 1 }}>{opt.label}</Typography>
                {opt.count !== undefined && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>{opt.count}</Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {!radio && (
          <>
            <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Box
                component="button"
                onClick={() => { onClear(); setOpen(false); setMenuQuery(''); }}
                sx={(t) => ({
                  border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: t.typography.caption.fontSize, fontWeight: t.typography.fontWeightSemibold,
                  color: t.palette.text.secondary, px: 2, py: 2,
                  borderRadius: `${t.radius.sm}px`,
                  '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
                })}
              >
                Clear
              </Box>
              <Box
                component="button"
                onClick={() => { setOpen(false); setMenuQuery(''); }}
                sx={(t) => ({
                  border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: t.typography.caption.fontSize, fontWeight: t.typography.fontWeightSemibold,
                  color: t.palette.primary.main, px: 2, py: 2,
                  borderRadius: `${t.radius.sm}px`,
                  '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              >
                Apply
              </Box>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

// ─── ListRow ───────────────────────────────────────────────────────────────────

function ListRow({ item, onAdd }: { item: CommunityItem; onAdd: (id: number) => void }) {
  const inst = getInst(item.instId);
  return (
    <Box
      role="row"
      tabIndex={0}
      sx={(t) => ({
        display: 'flex', alignItems: 'center', gap: 3,
        minHeight: 64, px: 4, py: 3,
        borderBottom: `1px solid ${t.border.subtle}`,
        cursor: 'pointer', transition: t.motion.short,
        '&:hover': { bgcolor: t.surface.subtle },
        '&:last-child': { borderBottom: 0 },
        '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: -2 },
        ...t.applyStyles('dark', {
          borderColor: t.palette.grey[700],
          '&:hover': { bgcolor: t.palette.grey[700] },
        }),
      })}
    >
      {/* Thumb */}
      <Box sx={(t) => ({
        width: t.spacing(10), height: t.spacing(10), flexShrink: 0,
        borderRadius: `${t.radius.md}px`,
        bgcolor: t.fill.default,
        border: `1px solid ${t.border.subtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'text.secondary',
      })}>
        {TYPE_ICON[item.type]}
      </Box>

      {/* Title + meta */}
      <Box sx={{ flex: '2.4 0 0', minWidth: 0 }}>
        <Typography variant="body2" sx={(t) => ({
          fontWeight: t.typography.fontWeightSemibold,
          overflow: 'hidden', display: '-webkit-box',
          WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
          lineHeight: 1.35,
        })}>
          {item.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          {item.draft && <DraftPill />}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {item.specs.slice(0, 2).join(' · ')}
          </Typography>
        </Box>
      </Box>

      {/* Institution */}
      <Box sx={{ flex: '1.4 0 0', minWidth: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
        <InstLogo instId={item.instId} size={22} />
        <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {inst.name}
        </Typography>
      </Box>

      {/* Type pill */}
      <Box sx={{ flexShrink: 0, width: 110 }}>
        <TypePill type={item.type} />
      </Box>

      {/* Specialty */}
      <Box sx={{ flex: '1 0 0', minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
          {item.specs[0] ?? '—'}
        </Typography>
      </Box>

      {/* Updated */}
      <Box sx={{ flexShrink: 0, width: (t) => t.spacing(9) }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.updated}</Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Add to collection">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onAdd(item.id); }}
            sx={(t) => ({ color: t.palette.text.secondary, '&:hover': { color: 'primary.main' } })}
          >
            <Plus size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="More">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreHorizontal size={14} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

// ─── GridCard ─────────────────────────────────────────────────────────────────

function GridCard({ item, onAdd }: { item: CommunityItem; onAdd: (id: number) => void }) {
  const inst = getInst(item.instId);
  const intent = TYPE_INTENT[item.type];
  return (
    <Box
      tabIndex={0}
      sx={(t) => ({
        display: 'flex', flexDirection: 'column',
        bgcolor: t.surface.overlay,
        border: `1px solid ${t.border.default}`,
        borderRadius: `${t.radius.lg}px`,
        overflow: 'hidden', cursor: 'pointer',
        transition: t.motion.short,
        '&:hover': { borderColor: t.border.strong, boxShadow: t.elevation.low },
        '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[800], borderColor: t.palette.grey[700] }),
      })}
    >
      {/* Thumbnail */}
      <Box sx={(t) => ({
        aspectRatio: '16 / 10',
        bgcolor: alpha(t.palette[intent].main, 0.06),
        borderBottom: `1px solid ${t.border.subtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.palette[intent].main,
        position: 'relative',
      })}>
        <Box sx={(t) => ({
          width: t.spacing(9), height: t.spacing(9),
          borderRadius: `${t.radius.lg}px`,
          bgcolor: alpha(t.palette.common.white, 0.7),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 1,
          ...t.applyStyles('dark', { bgcolor: alpha(t.palette.grey[700], 0.7) }),
        })}>
          <Box sx={(t) => ({ color: t.palette[intent].main, display: 'flex' })}>
            {TYPE_ICON_LG[item.type]}
          </Box>
        </Box>
        <Tooltip title="Add to collection">
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onAdd(item.id); }}
            sx={(t) => ({
              position: 'absolute', top: t.spacing(2), right: t.spacing(2),
              bgcolor: t.surface.overlay, border: `1px solid ${t.border.default}`,
              color: t.palette.text.secondary, opacity: 0,
              '.MuiBox-root:hover > &, &': { opacity: 1 },
              transition: t.motion.short,
              '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
            })}
          >
            <Plus size={13} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Body */}
      <Box sx={{ p: 3, pt: 3, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Typography variant="body2" sx={(t) => ({
          fontWeight: t.typography.fontWeightSemibold, lineHeight: 1.35,
          overflow: 'hidden', display: '-webkit-box',
          WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
          minHeight: '2.7em',
        })}>
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <InstLogo instId={item.instId} size={18} />
            <Typography variant="caption" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {inst.name}
            </Typography>
          </Box>
          <TypePill type={item.type} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          {item.draft ? <DraftPill /> : <Box />}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.updated}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── CollectionDrawer ─────────────────────────────────────────────────────────

function CollectionDrawer({
  open, onClose, cart, onRemove,
}: {
  open: boolean; onClose: () => void;
  cart: number[]; onRemove: (id: number) => void;
}) {
  const paidCount = cart.filter((id) => ITEMS.find((i) => i.id === id)?.access === 'paid').length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: (t) => ({
            width: 380, maxWidth: '92vw',
            bgcolor: t.surface.overlay,
            display: 'flex', flexDirection: 'column',
          }),
        },
      }}
    >
      {/* Header */}
      <Box sx={(t) => ({
        display: 'flex', alignItems: 'center', gap: 3,
        px: 5, py: 4,
        borderBottom: `1px solid ${t.border.default}`,
      })}>
        <ShoppingBag size={18} />
        <Typography variant="subtitle1" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, flex: 1 })}>
          My collection
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {cart.length} item{cart.length !== 1 ? 's' : ''}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <X size={16} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 3 }}>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 9 }}>
            <Box sx={{ color: 'text.disabled', display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ShoppingBag size={36} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Your collection is empty</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Tap + on any result to add it here.
            </Typography>
          </Box>
        ) : (
          cart.map((id) => {
            const item = ITEMS.find((i) => i.id === id);
            if (!item) return null;
            return (
              <Box
                key={id}
                sx={(t) => ({
                  display: 'flex', alignItems: 'center', gap: 3,
                  px: 3, py: 3,
                  borderRadius: `${t.radius.md}px`,
                  '&:hover': { bgcolor: t.surface.subtle },
                })}
              >
                <Box sx={(t) => ({
                  width: t.spacing(11), height: t.spacing(11), flexShrink: 0,
                  borderRadius: `${t.radius.md}px`,
                  bgcolor: t.fill.default,
                  border: `1px solid ${t.border.subtle}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'text.secondary',
                })}>
                  {TYPE_ICON[item.type]}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={(t) => ({
                    fontWeight: t.typography.fontWeightSemibold, lineHeight: 1.35,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
                  })}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                    {getInst(item.instId).name} · {TYPE_LABEL[item.type]}
                  </Typography>
                </Box>
                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={() => onRemove(id)}
                    sx={{ color: 'text.secondary', flexShrink: 0 }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            );
          })
        )}
      </Box>

      {/* Footer */}
      <Box sx={(t) => ({
        px: 4, py: 4,
        borderTop: `1px solid ${t.border.default}`,
        display: 'flex', flexDirection: 'column', gap: 2,
      })}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Items</Typography>
          <Typography variant="body2">{cart.length}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
            {paidCount === 0 ? 'Free' : `$${(paidCount * 19).toFixed(2)}`}
          </Typography>
        </Box>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Fork to my library
        </Button>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Community content is free unless marked <strong>Paid</strong>.
        </Typography>
      </Box>
    </Drawer>
  );
}

// ─── CommunityPage ─────────────────────────────────────────────────────────────

export function CommunityPage() {
  const [query,    setQuery]    = useState('');
  const [view,     setView]     = useState<ViewMode>('list');
  const [sort,     setSort]     = useState<SortKey>('popular');
  const [cart,     setCart]     = useState<number[]>([4]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<ActiveFilters>({
    specialty: new Set(), type: new Set(), institution: new Set(), access: new Set(),
  });

  const toggle = <T extends string>(key: keyof ActiveFilters, val: T) =>
    setFilters((prev) => {
      const next = new Set(prev[key]) as Set<T>;
      next.has(val) ? next.delete(val) : next.add(val);
      return { ...prev, [key]: next };
    });

  const clear = (key: keyof ActiveFilters) =>
    setFilters((prev) => ({ ...prev, [key]: new Set() }));

  const clearAll = () =>
    setFilters({ specialty: new Set(), type: new Set(), institution: new Set(), access: new Set() });

  const addToCart = (id: number) =>
    setCart((prev) => prev.includes(id) ? prev : [...prev, id]);

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((c) => c !== id));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = ITEMS.filter((it) => {
      if (filters.specialty.size   && !it.specs.some((s) => (filters.specialty as Set<string>).has(s))) return false;
      if (filters.type.size        && !(filters.type as Set<string>).has(it.type)) return false;
      if (filters.institution.size && !(filters.institution as Set<string>).has(it.instId)) return false;
      if (filters.access.size      && !(filters.access as Set<string>).has(it.access)) return false;
      if (q) {
        const hay = `${it.title} ${getInst(it.instId).name} ${it.specs.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'title-az') out = [...out].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'title-za') out = [...out].sort((a, b) => b.title.localeCompare(a.title));
    if (sort === 'inst')     out = [...out].sort((a, b) => getInst(a.instId).name.localeCompare(getInst(b.instId).name));
    return out;
  }, [query, filters, sort]);

  const activeChips: { key: keyof ActiveFilters; val: string; label: string }[] = [
    ...[...filters.specialty].map((v) => ({ key: 'specialty' as const, val: v, label: v })),
    ...[...filters.type].map((v)      => ({ key: 'type' as const,      val: v, label: TYPE_LABEL[v as ContentType] })),
    ...[...filters.institution].map((v) => ({ key: 'institution' as const, val: v, label: getInst(v).name })),
    ...[...filters.access].map((v)    => ({ key: 'access' as const,    val: v, label: v === 'free' ? 'Free' : 'Paid' })),
  ];

  const sortSelected = new Set<string>([sort]);

  return (
    <Box
      sx={(t) => ({
        height: '100%', overflowY: 'auto',
        bgcolor: t.surface.subtle,
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
      })}
    >
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <Box
        component="section"
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          pt: 8, pb: 9, px: 6, gap: 5,
        }}
      >
        {/* Eyebrow */}
        <Box
          sx={(t) => ({
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: alpha(t.palette.primary.main, 0.08),
            color: 'primary.dark',
            px: 3, py: 1,
            borderRadius: `${t.radius.pill}px`,
            fontSize: '11px', fontWeight: t.typography.fontWeightBold,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          })}
        >
          Community library
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={(t) => ({
            fontWeight: t.typography.fontWeightBold,
            maxWidth: '22ch', textWrap: 'balance',
            letterSpacing: '-0.015em', lineHeight: 1.15,
          })}
        >
          Explore pathways from world-class institutions
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', maxWidth: '58ch', lineHeight: 1.5 }}
        >
          Browse clinical pathways, protocols, calculators and documents shared by partner institutions.
          Fork any item into your library.
        </Typography>

        {/* Search */}
        <OutlinedInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search pathways, protocols, documents… try "sepsis" or "asthma"'
          notched={false}
          startAdornment={
            <InputAdornment position="start">
              <Box sx={{ color: 'text.secondary', display: 'flex' }}><Search size={18} /></Box>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Box
                sx={(t) => ({
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  fontFamily: 'monospace', fontSize: '11px',
                  color: t.palette.text.muted,
                  px: 2, py: 1,
                  border: `1px solid ${t.border.default}`,
                  borderRadius: `${t.radius.sm}px`,
                  bgcolor: t.surface.subtle,
                })}
              >
                ⌘K
              </Box>
            </InputAdornment>
          }
          sx={(t) => ({
            width: 'min(680px, 100%)', height: t.spacing(9) + 4,
            bgcolor: t.surface.overlay,
            borderRadius: `${t.radius.lg}px`,
            '& fieldset': { borderColor: t.border.default, borderRadius: `${t.radius.lg}px` },
            '&:hover fieldset': { borderColor: t.border.strong },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            '& input': { fontSize: t.typography.body2.fontSize },
          })}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Download size={14} />} size="medium">
            Export list
          </Button>
          <Button variant="contained" startIcon={<Plus size={14} />} size="medium">
            New pathway
          </Button>
        </Box>
      </Box>

      {/* ── Browse Section ───────────────────────────────────────────────────── */}
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 6, pb: 11 }}>

        {/* Section header */}
        <Box
          component="section"
          aria-labelledby="browse-heading"
          sx={(t) => ({
            mt: 9,
            borderBottom: `1px solid ${t.border.subtle}`,
            pb: 4, mb: 5,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          })}
        >
          <Box>
            <Typography id="browse-heading" variant="h5" component="h2"
              sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, letterSpacing: '-0.005em' })}>
              Browse the library
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Filter by specialty, type, institution or access — or combine them.
            </Typography>
          </Box>
        </Box>

        {/* Filter bar */}
        <Box
          role="toolbar"
          aria-label="Filters"
          sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
        >
          <FilterMenu
            label="Specialty"
            options={SPECIALTIES.map((s) => ({
              id: s, label: s,
              count: ITEMS.filter((i) => i.specs.includes(s)).length,
            }))}
            selected={filters.specialty as Set<string>}
            onToggle={(v) => toggle('specialty', v)}
            onClear={() => clear('specialty')}
            searchable
          />
          <FilterMenu
            label="Type"
            options={(['pathway', 'protocol', 'calculator', 'document'] as ContentType[]).map((t) => ({
              id: t, label: TYPE_LABEL[t],
              count: ITEMS.filter((i) => i.type === t).length,
            }))}
            selected={filters.type as Set<string>}
            onToggle={(v) => toggle('type', v as ContentType)}
            onClear={() => clear('type')}
          />
          <FilterMenu
            label="Institution"
            options={INSTITUTIONS
              .filter((inst) => ITEMS.some((i) => i.instId === inst.id))
              .map((inst) => ({
                id: inst.id, label: inst.name,
                count: ITEMS.filter((i) => i.instId === inst.id).length,
                prefix: <InstLogo instId={inst.id} size={20} />,
              }))}
            selected={filters.institution as Set<string>}
            onToggle={(v) => toggle('institution', v)}
            onClear={() => clear('institution')}
            searchable
          />
          <FilterMenu
            label="Access"
            options={[
              { id: 'free', label: 'Free', count: ITEMS.filter((i) => i.access === 'free').length },
              { id: 'paid', label: 'Paid', count: ITEMS.filter((i) => i.access === 'paid').length },
            ]}
            selected={filters.access as Set<string>}
            onToggle={(v) => toggle('access', v as AccessType)}
            onClear={() => clear('access')}
          />

          <Divider orientation="vertical" flexItem sx={(t) => ({ borderColor: t.border.default, mx: 1 })} />

          {/* Sort */}
          <FilterMenu
            label={`Sort: ${SORT_OPTIONS.find((s) => s.id === sort)?.label ?? ''}`}
            options={SORT_OPTIONS.map((s) => ({ id: s.id, label: s.label }))}
            selected={sortSelected}
            onToggle={(v) => setSort(v as SortKey)}
            onClear={() => setSort('popular')}
            radio
          />

          <Box sx={{ flex: 1 }} />

          {/* View toggle */}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v: ViewMode | null) => v && setView(v)}
            size="small"
            aria-label="View"
            sx={(t) => ({
              bgcolor: t.surface.subtle,
              border: `1px solid ${t.border.default}`,
              borderRadius: `${t.radius.md}px`,
              p: 1,
              '& .MuiToggleButton-root': {
                height: 28, border: 0, borderRadius: `${t.radius.md - 2}px`,
                px: 3, fontSize: t.typography.caption.fontSize,
                fontWeight: t.typography.fontWeightSemibold,
                color: t.palette.text.secondary,
                '&.Mui-selected': {
                  bgcolor: t.surface.overlay,
                  color: t.palette.text.primary,
                  boxShadow: t.elevation.low,
                  '&:hover': { bgcolor: t.surface.overlay },
                },
              },
            })}
          >
            <ToggleButton value="list" aria-label="List view">
              <List size={14} />
              &nbsp;List
            </ToggleButton>
            <ToggleButton value="grid" aria-label="Grid view">
              <LayoutGrid size={14} />
              &nbsp;Grid
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Cart button */}
          <Tooltip title="My collection">
            <IconButton
              size="small"
              onClick={() => setDrawerOpen(true)}
              aria-label={`My collection, ${cart.length} item${cart.length !== 1 ? 's' : ''}`}
            >
              <Badge badgeContent={cart.length} color="primary">
                <ShoppingBag size={18} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Result row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mt: 5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>{results.length}</strong> {results.length === 1 ? 'result' : 'results'}
          </Typography>

          {activeChips.map((c) => (
            <Chip
              key={`${c.key}-${c.val}`}
              label={c.label}
              size="small"
              color="primary"
              variant="soft"
              onDelete={() => toggle(c.key, c.val)}
              deleteIcon={<X size={10} />}
              sx={(t) => ({
                height: 26, fontSize: t.typography.caption.fontSize,
                fontWeight: t.typography.fontWeightSemibold,
              })}
            />
          ))}

          {activeChips.length > 0 && (
            <Box
              component="button"
              onClick={clearAll}
              sx={(t) => ({
                border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: t.typography.caption.fontSize, fontWeight: t.typography.fontWeightSemibold,
                color: t.palette.text.secondary, px: 2, py: 1,
                borderRadius: `${t.radius.sm}px`,
                '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
              })}
            >
              Clear filters
            </Box>
          )}
        </Box>

        {/* Results */}
        <Box
          component="section"
          aria-live="polite"
          sx={{ mt: 6 }}
        >
          {results.length === 0 ? (
            <Box sx={(t) => ({
              bgcolor: t.surface.overlay,
              border: `1px dashed ${t.border.default}`,
              borderRadius: `${t.radius.lg}px`,
              py: 9, px: 6, textAlign: 'center',
            })}>
              <Box sx={{ color: 'text.disabled', display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Search size={36} />
              </Box>
              <Typography variant="h6" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, mb: 2 })}>
                No matching pathways
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Try removing a filter or broadening your search.
              </Typography>
            </Box>
          ) : view === 'list' ? (
            /* List view */
            <Box sx={(t) => ({
              bgcolor: t.surface.overlay,
              border: `1px solid ${t.border.default}`,
              borderRadius: `${t.radius.lg}px`,
              overflow: 'hidden',
              ...t.applyStyles('dark', { bgcolor: t.palette.grey[800], borderColor: t.palette.grey[700] }),
            })}>
              {/* List header */}
              <Box sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 3,
                height: 40, px: 4,
                bgcolor: t.surface.subtle,
                borderBottom: `1px solid ${t.border.default}`,
                ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[700] }),
              })}>
                {/* Thumb placeholder */}
                <Box sx={(t) => ({ width: t.spacing(10), flexShrink: 0 })} />
                {(['Name', 'Institution'] as const).map((label, i) => (
                  <Typography key={label} variant="caption" sx={(t) => ({
                    flex: i === 0 ? '2.4 0 0' : '1.4 0 0', minWidth: 0,
                    fontWeight: t.typography.fontWeightBold,
                    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary',
                  })}>
                    {label}
                  </Typography>
                ))}
                {/* Type — fixed width matching widest TypePill */}
                <Typography variant="caption" sx={(t) => ({
                  flexShrink: 0, width: 110,
                  fontWeight: t.typography.fontWeightBold,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary',
                })}>
                  Type
                </Typography>
                <Typography variant="caption" sx={(t) => ({
                  flex: '1 0 0', minWidth: 0,
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  fontWeight: t.typography.fontWeightBold,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary',
                })}>
                  Specialty
                </Typography>
                {/* Updated — matches row width: spacing(9) */}
                <Typography variant="caption" sx={(t) => ({
                  flexShrink: 0, width: t.spacing(9), whiteSpace: 'nowrap',
                  fontWeight: t.typography.fontWeightBold,
                  letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary',
                })}>
                  Updated
                </Typography>
                {/* Actions placeholder — 2× small IconButton (30px) + gap(8px) */}
                <Box sx={{ flexShrink: 0, width: 68 }} />
              </Box>
              {results.map((item) => <ListRow key={item.id} item={item} onAdd={addToCart} />)}
            </Box>
          ) : (
            /* Grid view */
            <Box sx={(t) => ({
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 4,
              [t.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
              [t.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
            })}>
              {results.map((item) => <GridCard key={item.id} item={item} onAdd={addToCart} />)}
            </Box>
          )}
        </Box>
      </Box>

      <CollectionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
      />
    </Box>
  );
}
