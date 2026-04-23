import React, { useState, useMemo, useRef, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import {
  Library, Star, Clock, Users, Folder, Plus, ChevronDown, ChevronRight,
  Bell, UserPlus, Sparkles, LayoutGrid, List, Tag, Filter, X, Check,
  MoreVertical, Globe, Lock, Share2, Trash2, Move, Upload, Search,
  GitBranch, FileText, Shield, BookOpen, Layers, ClipboardList,
  Stethoscope, HelpCircle, LogOut, User, Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────────

type LibraryItemType =
  | 'pathway' | 'clinical-standard' | 'workflow' | 'bundle'
  | 'document' | 'protocol' | 'guideline' | 'policy' | 'procedure'
  | 'note' | 'form';

type PublishedState = 'public' | 'private' | 'unpublished';
type ViewMode = 'list' | 'grid' | 'label';
type SortKey = 'name' | 'reviewDate' | 'published' | 'draftUpdated';

interface LibraryItem {
  id: number;
  type: LibraryItemType;
  name: string;
  starred: boolean;
  reviewDate: string | null;
  published: string;
  publishedState: PublishedState;
  draftUpdated: string;
  badge: string | null;
  specialty: string | null;
  status: string;
  people: string;
  labelGroup?: string;
  version?: string;
  revisionDue?: string;
  authors?: { name: string; credential: string }[];
  synonyms?: string[];
  comments?: number;
}

interface FolderItem {
  name: string;
  count: number;
  expandable?: boolean;
}

// ── Static data ────────────────────────────────────────────────────────────────

const LIBRARY_DATA: LibraryItem[] = [
  { id: 1,  type: 'pathway',  name: 'Neonatal Fever (30 - 60 days)', starred: false, reviewDate: '5 years ago', published: '5 years ago', publishedState: 'public', draftUpdated: 'an hour ago', badge: null, specialty: 'Pediatrics', status: 'Published', people: 'Alex Chen', labelGroup: 'Infectious', version: 'v0.0.1', revisionDue: '08-13-2021', authors: [{ name: 'Curbside Admin', credential: 'MD' }, { name: 'Dan Imler', credential: 'MD' }], synonyms: ['Newborn Fever', 'Rule Out Sepsis'] },
  { id: 2,  type: 'pathway',  name: 'Untitled', starred: false, reviewDate: null, published: 'Unpublished', publishedState: 'unpublished', draftUpdated: '21 hours ago', badge: null, specialty: null, status: 'Draft', people: 'You' },
  { id: 3,  type: 'pathway',  name: 'test', starred: false, reviewDate: 'in a year', published: 'a month ago', publishedState: 'public', draftUpdated: 'a day ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 4,  type: 'pathway',  name: 'Test Pathway 1', starred: true, reviewDate: 'in 3 months', published: '12 days ago', publishedState: 'public', draftUpdated: '7 days ago', badge: 'Updated', specialty: 'Internal Medicine', status: 'Published', people: 'Jordan Kim' },
  { id: 5,  type: 'pathway',  name: 'Neonatal Fever (0-29 days)', starred: false, reviewDate: '5 years ago', published: '5 years ago', publishedState: 'private', draftUpdated: '7 days ago', badge: null, specialty: 'Pediatrics', status: 'Published', people: 'Alex Chen', labelGroup: 'Infectious', version: 'v0.0.3', revisionDue: '08-13-2021', authors: [{ name: 'Dan Imler', credential: 'MD' }] },
  { id: 6,  type: 'pathway',  name: 'Community Acquired Pneumonia CAP Treatment - Inpatient QI', starred: false, reviewDate: 'in 10 months', published: '2 months ago', publishedState: 'public', draftUpdated: 'a month ago', badge: 'E', specialty: 'Inpatient', status: 'Published', people: 'Alex Chen', labelGroup: 'Infectious' },
  { id: 7,  type: 'document', name: 'demo', starred: false, reviewDate: 'in a year', published: 'a month ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 8,  type: 'pathway',  name: 'WF 13 Nov', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 9,  type: 'pathway',  name: 'BMI Test', starred: false, reviewDate: '3 years ago', published: '3 years ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Internal Medicine', status: 'Published', people: 'Jordan Kim' },
  { id: 10, type: 'pathway',  name: 'TPA Demo Trial', starred: false, reviewDate: 'in 6 months', published: '6 months ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 11, type: 'pathway',  name: 'Community Acquired Pneumonia - QI project | Portsmouth Regional Hospital', starred: false, reviewDate: 'a year ago', published: '2 years ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Inpatient', status: 'Published', people: 'Alex Chen', labelGroup: 'Infectious' },
  { id: 12, type: 'note',     name: 'Hello Content', starred: false, reviewDate: 'in a year', published: 'a month ago', publishedState: 'public', draftUpdated: 'a month ago', badge: 'F', specialty: null, status: 'Published', people: 'You' },
  { id: 13, type: 'pathway',  name: 'Screening And Management Of High Blood Pressure In Children And Adolescents', starred: true, reviewDate: 'in 10 months', published: '2 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: 'Pediatrics', status: 'Published', people: 'Alex Chen' },
  { id: 14, type: 'document', name: 'demo (annotated)', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: null, status: 'Published', people: 'You', comments: 2 },
  { id: 15, type: 'pathway',  name: 'ACLS Healthcare Provider Post-Cardiac Arrest Care Algorithm', starred: false, reviewDate: 'in 10 months', published: '2 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 16, type: 'pathway',  name: 'demo pathways', starred: false, reviewDate: 'in 9 months', published: '3 months ago', publishedState: 'public', draftUpdated: '3 months ago', badge: 'E', specialty: null, status: 'Published', people: 'You' },
  { id: 17, type: 'pathway',  name: '13 Nov Pathways', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: '4 months ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 18, type: 'bundle',   name: 'Sepsis Bundle — Emergency', starred: true, reviewDate: 'in 4 months', published: '2 months ago', publishedState: 'public', draftUpdated: 'a week ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 19, type: 'form',     name: 'PHQ-9 Intake Form', starred: false, reviewDate: 'in a year', published: '3 months ago', publishedState: 'public', draftUpdated: '3 weeks ago', badge: null, specialty: 'Internal Medicine', status: 'Published', people: 'Jordan Kim' },
  { id: 20, type: 'pathway',  name: 'Diabetes — New Diagnosis Workup', starred: false, reviewDate: 'in 8 months', published: 'a month ago', publishedState: 'private', draftUpdated: '5 days ago', badge: null, specialty: 'Internal Medicine', status: 'Published', people: 'Alex Chen' },
];

const FOLDERS: FolderItem[] = [
  { name: 'BUNDLE - Antibiotics',  count: 12 },
  { name: 'BUNDLE - CMS SEP-1',    count: 8  },
  { name: 'BUNDLE - Diabetes',     count: 6  },
  { name: 'BUNDLE - Maternity',    count: 9  },
  { name: 'BUNDLE - PEDS Fever',   count: 4  },
  { name: 'BUNDLE - Readmission',  count: 7  },
  { name: 'Bundle test',           count: 2  },
  { name: 'BUNDLE - Trauma',       count: 5  },
  { name: 'Emergency',             count: 18 },
  { name: 'INTERNAL - Training',   count: 23 },
  { name: 'My Page',               count: 3  },
  { name: 'Pediatrics',            count: 14 },
  { name: 'Procedures',            count: 11 },
  { name: 'Test New',              count: 4, expandable: true },
  { name: 'Trauma',                count: 9  },
];

const CONTENT_TYPES = [
  { id: 'pathway' as LibraryItemType,           label: 'Pathway',           colorKey: 'primary.dark'   },
  { id: 'clinical-standard' as LibraryItemType, label: 'Clinical Standard', colorKey: 'success.main'   },
  { id: 'workflow' as LibraryItemType,          label: 'Workflow',          colorKey: 'success.dark'   },
  { id: 'document' as LibraryItemType,          label: 'Text Document',     colorKey: 'info.main'      },
  { id: 'protocol' as LibraryItemType,          label: 'Protocol',          colorKey: 'error.main'     },
  { id: 'guideline' as LibraryItemType,         label: 'Guideline',         colorKey: 'info.dark'      },
  { id: 'policy' as LibraryItemType,            label: 'Policy',            colorKey: 'warning.main'   },
  { id: 'procedure' as LibraryItemType,         label: 'Procedure',         colorKey: 'secondary.main' },
];

const TYPE_COLOR: Record<LibraryItemType, string> = {
  pathway:             'primary.dark',
  'clinical-standard': 'success.main',
  workflow:            'success.dark',
  bundle:              'primary.main',
  document:            'info.main',
  protocol:            'error.main',
  guideline:           'info.dark',
  policy:              'warning.main',
  procedure:           'secondary.main',
  note:                'secondary.dark',
  form:                'warning.dark',
};

const TYPE_ICON_FN: Record<LibraryItemType, (s: number) => React.ReactNode> = {
  pathway:             (s) => <GitBranch size={s} />,
  'clinical-standard': (s) => <LayoutGrid size={s} />,
  workflow:            (s) => <Share2 size={s} />,
  bundle:              (s) => <Layers size={s} />,
  document:            (s) => <FileText size={s} />,
  protocol:            (s) => <Shield size={s} />,
  guideline:           (s) => <BookOpen size={s} />,
  policy:              (s) => <Lock size={s} />,
  procedure:           (s) => <ClipboardList size={s} />,
  note:                (s) => <FileText size={s} />,
  form:                (s) => <ClipboardList size={s} />,
};

const FILTERS = [
  { id: 'type',      label: 'Type',      primary: true,  options: ['Pathway', 'Bundle', 'Document', 'Note', 'Form'] },
  { id: 'status',    label: 'Status',    primary: true,  options: ['Published', 'Draft', 'Unpublished'] },
  { id: 'people',    label: 'People',    primary: false, options: ['You', 'Alex Chen', 'Jordan Kim'] },
  { id: 'specialty', label: 'Specialty', primary: false, options: ['Pediatrics', 'Internal Medicine', 'Emergency', 'Inpatient'] },
  { id: 'labels',    label: 'Labels',    primary: false, options: ['External', 'Featured', 'QI Project', 'Guideline'] },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onEsc); };
  }, [open]);
  return { open, setOpen, ref };
}

// ── TypeIcon ───────────────────────────────────────────────────────────────────

function TypeIcon({ type, size = 28 }: { type: LibraryItemType; size?: number }) {
  const iconSize = Math.round(size * 0.55);
  const fn = TYPE_ICON_FN[type] ?? TYPE_ICON_FN.pathway;
  return (
    <Box sx={(t) => ({
      width: size, height: size, flexShrink: 0,
      borderRadius: `${t.radius.sm}px`,
      bgcolor: TYPE_COLOR[type] ?? 'primary.dark',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'common.white',
    })}>
      {fn(iconSize)}
    </Box>
  );
}

// ── CheckCell ─────────────────────────────────────────────────────────────────

function CheckCell({
  state, onChange, label = 'Select',
}: { state: 'checked' | 'unchecked' | 'indeterminate'; onChange?: () => void; label?: string }) {
  return (
    <Box
      component="button"
      role="checkbox"
      aria-checked={state === 'indeterminate' ? 'mixed' : state === 'checked'}
      aria-label={label}
      onClick={onChange}
      sx={(t) => ({
        width: 16, height: 16, p: 0,
        borderRadius: `${t.radius.sm}px`,
        border: `1.5px solid ${state !== 'unchecked' ? t.palette.primary.main : t.border.strong}`,
        bgcolor: state !== 'unchecked' ? 'primary.main' : t.surface.canvas,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: t.motion.short,
        '&:hover': { borderColor: t.palette.primary.main },
        color: 'common.white',
      })}
    >
      {state === 'checked' && <Check size={10} strokeWidth={3} />}
      {state === 'indeterminate' && (
        <Box sx={(t) => ({ width: 8, height: 2, bgcolor: 'common.white', borderRadius: `${t.radius.sm}px` })} />
      )}
    </Box>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

type NavId = 'library' | 'starred' | 'recent' | 'people' | 'clinical' | 'community';

const NAV_ITEMS: { id: NavId; label: string; icon: React.ReactNode; addable?: boolean }[] = [
  { id: 'library',   label: 'Library',             icon: <Library size={17} />,  addable: true },
  { id: 'starred',   label: 'Starred',              icon: <Star size={17} /> },
  { id: 'recent',    label: 'Recent',               icon: <Clock size={17} /> },
  { id: 'people',    label: 'People',               icon: <Users size={17} /> },
  { id: 'clinical',  label: 'Clinical User Page',   icon: <Stethoscope size={17} /> },
  { id: 'community', label: 'Community',            icon: <Library size={17} /> },
];

function WorkspaceRail() {
  const navigate = useNavigate();
  return (
    <Box sx={(t) => ({
      width: 48, flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 2, py: 3,
      bgcolor: t.surface.subtle,
      borderRight: `1px solid ${t.border.subtle}`,
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[800] }),
    })}>
      <Tooltip title="Home" placement="right">
        <Box
          component="button"
          onClick={() => navigate('/')}
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white', fontWeight: t.typography.fontWeightBold, fontSize: 11,
            background: `linear-gradient(135deg, ${t.palette.secondary.light}, ${t.palette.primary.main})`,
            transition: t.motion.short,
            '&:hover': { transform: 'scale(1.05)' },
          })}
          aria-label="Curbside Health workspace"
        >
          CH
        </Box>
      </Tooltip>
      <Tooltip title="Another workspace" placement="right">
        <Box
          component="button"
          sx={(t) => ({
            position: 'relative',
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white', fontWeight: t.typography.fontWeightBold, fontSize: 11,
            bgcolor: t.palette.grey[400],
            opacity: 0.7,
            transition: t.motion.short,
            '&:hover': { opacity: 1 },
          })}
          aria-label="Another workspace"
        >
          AM
          <Box sx={(t) => ({
            position: 'absolute', top: -4, right: -4,
            minWidth: 14, height: 14, px: '3px',
            borderRadius: `${t.radius.pill}px`,
            bgcolor: t.palette.error.main,
            color: 'common.white', fontSize: 9, fontWeight: t.typography.fontWeightBold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          })}>
            2
          </Box>
        </Box>
      </Tooltip>
      <Tooltip title="Research Kit" placement="right">
        <Box
          component="button"
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white', fontWeight: t.typography.fontWeightBold, fontSize: 11,
            background: `linear-gradient(135deg, ${t.palette.success.main}, ${t.palette.info.main})`,
            transition: t.motion.short,
            '&:hover': { transform: 'scale(1.05)' },
          })}
          aria-label="Research Kit workspace"
        >
          RK
        </Box>
      </Tooltip>
      <Tooltip title="Add workspace" placement="right">
        <Box
          component="button"
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            border: `1px dashed ${t.border.strong}`,
            bgcolor: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: t.palette.text.secondary,
            transition: t.motion.short,
            '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
          })}
          aria-label="Add workspace"
        >
          <Plus size={14} />
        </Box>
      </Tooltip>
    </Box>
  );
}

function AccountPopover() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box
        ref={anchorRef}
        component="button"
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          width: '100%', p: 0, border: 0, bgcolor: 'transparent',
          cursor: 'pointer', textAlign: 'left', color: 'inherit',
        }}
      >
        <Box sx={(t) => ({
          width: 28, height: 28, borderRadius: `${t.radius.md}px`,
          background: `linear-gradient(135deg, ${t.palette.secondary.light}, ${t.palette.primary.main})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'common.white', fontWeight: t.typography.fontWeightBold, fontSize: 12, flexShrink: 0,
        })}>
          CH
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={(t) => ({
            display: 'flex', alignItems: 'center', gap: 1,
            fontWeight: t.typography.fontWeightSemibold, lineHeight: 1.3, letterSpacing: '-0.01em',
          })}>
            Curbside Health <ChevronDown size={13} />
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Hammad Ahmed
          </Typography>
        </Box>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1, minWidth: 260,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              boxShadow: t.elevation.high,
              bgcolor: t.surface.overlay,
              p: 2,
            }),
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, pt: 2, pb: 3 }}>
          <Box sx={(t) => ({
            width: 36, height: 36, borderRadius: `${t.radius.md}px`,
            background: `linear-gradient(135deg, ${t.palette.secondary.light}, ${t.palette.primary.main})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white', fontWeight: t.typography.fontWeightBold, fontSize: 13,
          })}>
            CH
          </Box>
          <Box>
            <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
              Curbside Health
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Member
            </Typography>
          </Box>
        </Box>
        <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
        {[
          { icon: <User size={15} />, label: 'Account Settings', onClick: () => { setOpen(false); navigate('/settings'); } },
          { icon: <HelpCircle size={15} />, label: 'Help', onClick: () => setOpen(false) },
        ].map((item) => (
          <Box
            key={item.label}
            component="button"
            onClick={item.onClick}
            sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 3,
              width: '100%', px: 3, py: 2,
              border: 0, background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
              fontWeight: t.typography.fontWeightMedium,
              color: t.palette.text.primary,
              borderRadius: `${t.radius.md}px`,
              textAlign: 'left',
              transition: t.motion.short,
              '&:hover': { bgcolor: t.fill.default },
            })}
          >
            {item.icon}
            {item.label}
          </Box>
        ))}
        <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
        <Box
          component="button"
          onClick={() => setOpen(false)}
          sx={(t) => ({
            display: 'flex', alignItems: 'center', gap: 3,
            width: '100%', px: 3, py: 2,
            border: 0, background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
            fontWeight: t.typography.fontWeightMedium,
            color: t.palette.error.main,
            borderRadius: `${t.radius.md}px`,
            textAlign: 'left',
            transition: t.motion.short,
            '&:hover': { bgcolor: alpha(t.palette.error.main, 0.08) },
          })}
        >
          <LogOut size={15} />
          Log out
        </Box>
      </Popover>
    </Box>
  );
}

function Sidebar({ activeNav, onNavChange }: { activeNav: NavId; onNavChange: (id: NavId) => void }) {
  return (
    <Box sx={{ display: 'flex', height: '100%', flexShrink: 0 }}>
      <WorkspaceRail />
      <Box sx={(t) => ({
      width: 240, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      bgcolor: t.surface.canvas,
      borderRight: `1px solid ${t.border.subtle}`,
      overflow: 'hidden',
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[800] }),
    })}>
      {/* Org header */}
      <Box sx={(t) => ({
        display: 'flex', alignItems: 'center', gap: 2,
        px: 4, py: 3,
        borderBottom: `1px solid ${t.border.subtle}`,
        flexShrink: 0,
        ...t.applyStyles('dark', { borderColor: t.palette.grey[800] }),
      })}>
        <AccountPopover />
      </Box>

      {/* Nav */}
      <Box component="nav" sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <Box
              key={item.id}
              component="button"
              onClick={() => onNavChange(item.id)}
              sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 2,
                px: 3, py: 2, minHeight: 32,
                borderRadius: `${t.radius.md}px`,
                border: 0, background: 'transparent', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
                fontWeight: isActive ? t.typography.fontWeightSemibold : t.typography.fontWeightMedium,
                color: isActive ? t.palette.primary.main : t.palette.text.secondary,
                bgcolor: isActive ? alpha(t.palette.primary.main, 0.08) : 'transparent',
                transition: t.motion.short,
                textAlign: 'left',
                '&:hover': {
                  bgcolor: isActive ? alpha(t.palette.primary.main, 0.12) : t.fill.default,
                  color: isActive ? t.palette.primary.main : t.palette.text.primary,
                },
              })}
            >
              <Box sx={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                {item.icon}
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </Box>
              {item.addable && (
                <Box
                  component="button"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  sx={(t) => ({
                    width: 20, height: 20, p: 0,
                    borderRadius: `${t.radius.sm}px`,
                    border: 0, background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.palette.text.secondary,
                    opacity: 0,
                    transition: t.motion.short,
                    '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
                    'button:hover > &': { opacity: 1 },
                    '.nav-item-active &': { opacity: 1 },
                  })}
                  aria-label={`Create new in ${item.label}`}
                >
                  <Plus size={14} />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Divider sx={(t) => ({ borderColor: t.border.subtle, mx: 2 })} />

      {/* Folders */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Box sx={(t) => ({
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 2,
          fontFamily: 'inherit',
          fontSize: 10.5, fontWeight: 'fontWeightBold',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'text.disabled',
        })}>
          <span>Folders</span>
          <Box
            component="button"
            sx={(t) => ({
              width: 18, height: 18, p: 0,
              border: 0, background: 'transparent', cursor: 'pointer',
              borderRadius: `${t.radius.sm}px`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.palette.text.disabled,
              '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
            })}
            aria-label="New folder"
          >
            <Plus size={12} />
          </Box>
        </Box>

        {FOLDERS.map((f) => (
          <Box
            key={f.name}
            component="button"
            sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 2,
              width: '100%', px: 3, py: 2, minHeight: 28,
              pl: f.expandable ? 3 : 7,
              border: 0, background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
              color: t.palette.text.secondary,
              borderRadius: `${t.radius.md}px`,
              textAlign: 'left',
              transition: t.motion.short,
              '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
            })}
          >
            {f.expandable && (
              <Box sx={{ color: 'text.disabled', display: 'flex', flexShrink: 0 }}>
                <ChevronRight size={14} />
              </Box>
            )}
            <Box sx={{ color: 'text.disabled', display: 'flex', flexShrink: 0 }}>
              <Folder size={15} />
            </Box>
            <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {f.name}
            </Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
              {f.count}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={(t) => ({
        px: 3, py: 3,
        borderTop: `1px solid ${t.border.subtle}`,
        flexShrink: 0,
        ...t.applyStyles('dark', { borderColor: t.palette.grey[800] }),
      })}>
        <Box
          component="button"
          sx={(t) => ({
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
            py: 2, px: 4,
            border: 0,
            bgcolor: alpha(t.palette.primary.main, 0.08),
            color: t.palette.primary.main,
            borderRadius: `${t.radius.md}px`,
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: t.typography.body2.fontSize,
            fontWeight: t.typography.fontWeightSemibold,
            transition: t.motion.short,
            '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.14) },
          })}
        >
          <UserPlus size={15} />
          Invite people
        </Box>
      </Box>
      </Box>
    </Box>
  );
}

// ── NewMenu ────────────────────────────────────────────────────────────────────

function NewMenu() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={anchorRef}
        variant="contained"
        size="small"
        startIcon={<Plus size={15} />}
        onClick={() => setOpen((v) => !v)}
        sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, gap: 1 })}
      >
        New
      </Button>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1, minWidth: 260,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              boxShadow: t.elevation.high,
              bgcolor: t.surface.overlay,
              p: 2,
            }),
          },
        }}
      >
        {CONTENT_TYPES.map((ct) => (
          <Box
            key={ct.id}
            component="button"
            onClick={() => setOpen(false)}
            sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 3,
              width: '100%', px: 3, py: 2,
              border: 0, background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
              fontWeight: t.typography.fontWeightMedium,
              color: t.palette.text.primary,
              borderRadius: `${t.radius.md}px`,
              textAlign: 'left',
              transition: t.motion.short,
              '&:hover': { bgcolor: t.fill.default },
            })}
          >
            <TypeIcon type={ct.id} size={26} />
            {ct.label}
          </Box>
        ))}
        <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
        <Box
          component="button"
          onClick={() => setOpen(false)}
          sx={(t) => ({
            display: 'flex', alignItems: 'center', gap: 3,
            width: '100%', px: 3, py: 2,
            border: 0, background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
            fontWeight: t.typography.fontWeightMedium,
            color: t.palette.text.secondary,
            borderRadius: `${t.radius.md}px`,
            transition: t.motion.short,
            '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
          })}
        >
          <Box sx={(t) => ({
            width: 26, height: 26, flexShrink: 0,
            borderRadius: `${t.radius.sm}px`,
            bgcolor: t.fill.default,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'text.secondary',
          })}>
            <Upload size={15} />
          </Box>
          Upload File{' '}
          <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>
            (.doc, .pdf, .docx)
          </Typography>
        </Box>
      </Popover>
    </>
  );
}

// ── LibraryTopbar ──────────────────────────────────────────────────────────────

function LibraryTopbar({
  search, onSearchChange,
}: { search: string; onSearchChange: (v: string) => void }) {
  return (
    <Box sx={(t) => ({
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 4,
      px: 6,
      bgcolor: t.surface.canvas,
      borderBottom: `1px solid ${t.border.subtle}`,
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[900], borderColor: t.palette.grey[800] }),
    })}>
      {/* Search */}
      <Box sx={(t) => ({
        flex: '1 1 auto', maxWidth: 520, minWidth: 0,
        position: 'relative', display: 'flex', alignItems: 'center', height: 36,
      })}>
        <Box sx={{
          position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%)',
          color: 'text.disabled', display: 'flex',
        }}>
          <Search size={16} />
        </Box>
        <Box
          component="input"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search Curbside Health"
          sx={(t) => ({
            width: '100%', height: 36,
            pl: 8, pr: 11, py: 0,
            borderRadius: `${t.radius.lg}px`,
            border: `1px solid ${t.border.default}`,
            bgcolor: t.surface.subtle,
            fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
            color: t.palette.text.primary,
            outline: 0,
            transition: t.motion.short,
            '&::placeholder': { color: t.palette.text.disabled },
            '&:hover': { bgcolor: t.surface.canvas, borderColor: t.border.strong },
            '&:focus': { bgcolor: t.surface.canvas, borderColor: t.palette.primary.main, boxShadow: `0 0 0 3px ${alpha(t.palette.primary.main, 0.16)}` },
          })}
        />
        <Box sx={(t) => ({
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: 1, color: 'text.disabled',
          fontFamily: 'monospace', fontSize: 11,
        })}>
          {['⌘', 'K'].map((k) => (
            <Box key={k} component="span" sx={(t) => ({
              px: 1, py: 1,
              bgcolor: t.surface.canvas,
              border: `1px solid ${t.border.default}`,
              borderRadius: `${t.radius.sm}px`,
            })}>
              {k}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Notifications">
          <IconButton size="small" aria-label="Notifications" sx={(t) => ({ position: 'relative', color: t.palette.text.secondary })}>
            <Bell size={18} />
            <Box sx={(t) => ({
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7, borderRadius: '50%',
              bgcolor: 'error.main',
              border: `1.5px solid ${t.surface.canvas}`,
            })} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Invite members">
          <IconButton size="small" aria-label="Invite members" sx={{ color: 'text.secondary' }}>
            <UserPlus size={18} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={(t) => ({ borderColor: t.border.default, mx: 1, height: 24, alignSelf: 'center' })} />
        <NewMenu />
      </Box>
    </Box>
  );
}

// ── FilterDropdown ─────────────────────────────────────────────────────────────

function FilterDropdown({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const active = value.length > 0;

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((o) => o !== opt) : [...value, opt]);
  };

  return (
    <>
      <Box
        component="button"
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        sx={(t) => ({
          display: 'inline-flex', alignItems: 'center', gap: 2,
          height: 30, px: 3,
          border: `1px solid ${active ? t.palette.primary.main : t.border.default}`,
          borderRadius: `${t.radius.md}px`,
          bgcolor: active ? alpha(t.palette.primary.main, 0.08) : t.surface.canvas,
          color: active ? t.palette.primary.main : t.palette.text.secondary,
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: t.typography.fontWeightMedium,
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: t.motion.short,
          '&:hover': { borderColor: active ? t.palette.primary.dark : t.border.strong, color: active ? t.palette.primary.main : t.palette.text.primary },
        })}
      >
        {label}
        {active && (
          <Box sx={(t) => ({
            minWidth: 18, height: 18, px: 1,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: 'primary.main', color: 'primary.contrastText',
            fontSize: 10.5, fontWeight: 'fontWeightBold',
            display: 'inline-grid', placeItems: 'center',
          })}>
            {value.length}
          </Box>
        )}
        <ChevronDown size={12} />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1, minWidth: 200,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              boxShadow: t.elevation.high,
              bgcolor: t.surface.overlay,
              p: 2,
            }),
          },
        }}
      >
        <Typography variant="caption" sx={(t) => ({
          display: 'block', px: 3, py: 1,
          fontWeight: t.typography.fontWeightBold,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'text.disabled',
        })}>
          {label}
        </Typography>
        {options.map((opt) => {
          const checked = value.includes(opt);
          return (
            <Box
              key={opt}
              component="button"
              onClick={() => toggle(opt)}
              sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 2,
                width: '100%', px: 3, py: 2,
                border: 0, background: 'transparent', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
                color: checked ? t.palette.primary.main : t.palette.text.primary,
                borderRadius: `${t.radius.md}px`,
                textAlign: 'left',
                bgcolor: checked ? alpha(t.palette.primary.main, 0.06) : 'transparent',
                transition: t.motion.short,
                fontWeight: checked ? t.typography.fontWeightSemibold : 'inherit',
                '&:hover': { bgcolor: t.fill.default },
              })}
            >
              <Box sx={(t) => ({
                width: 16, height: 16, flexShrink: 0,
                borderRadius: `${t.radius.sm}px`,
                border: `1.5px solid ${checked ? t.palette.primary.main : t.border.strong}`,
                bgcolor: checked ? 'primary.main' : t.surface.overlay,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'common.white',
              })}>
                {checked && <Check size={10} strokeWidth={3} />}
              </Box>
              {opt}
            </Box>
          );
        })}
        {active && (
          <>
            <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
            <Box
              component="button"
              onClick={() => { onChange([]); setOpen(false); }}
              sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 2,
                width: '100%', px: 3, py: 2,
                border: 0, background: 'transparent', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: t.typography.body2.fontSize,
                color: t.palette.text.secondary,
                borderRadius: `${t.radius.md}px`,
                transition: t.motion.short,
                '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
              })}
            >
              <X size={14} /> Clear
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

// ── MoreFiltersDropdown ────────────────────────────────────────────────────────

function MoreFiltersDropdown({
  filters, values, onChange,
}: { filters: typeof FILTERS; values: Record<string, string[]>; onChange: (id: string, v: string[]) => void }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const activeCount = filters.reduce((n, f) => n + ((values[f.id] || []).length > 0 ? 1 : 0), 0);

  return (
    <>
      <Box
        component="button"
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        sx={(t) => ({
          display: 'inline-flex', alignItems: 'center', gap: 2,
          height: 30, px: 3,
          border: `1px solid ${activeCount > 0 ? t.palette.primary.main : t.border.default}`,
          borderRadius: `${t.radius.md}px`,
          bgcolor: activeCount > 0 ? alpha(t.palette.primary.main, 0.08) : t.surface.canvas,
          color: activeCount > 0 ? t.palette.primary.main : t.palette.text.secondary,
          fontFamily: 'inherit', fontSize: 12.5, fontWeight: t.typography.fontWeightMedium,
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: t.motion.short,
          '&:hover': { borderColor: t.border.strong, color: t.palette.text.primary },
        })}
      >
        <Filter size={13} />
        More filters
        {activeCount > 0 && (
          <Box sx={(t) => ({
            minWidth: 18, height: 18, px: 1,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: 'primary.main', color: 'primary.contrastText',
            fontSize: 10.5, fontWeight: 'fontWeightBold',
            display: 'inline-grid', placeItems: 'center',
          })}>
            {activeCount}
          </Box>
        )}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: (t) => ({
              mt: 1, minWidth: 280,
              borderRadius: `${t.radius.lg}px`,
              border: `1px solid ${t.border.default}`,
              boxShadow: t.elevation.high,
              bgcolor: t.surface.overlay,
              p: 2,
            }),
          },
        }}
      >
        <Typography variant="caption" sx={(t) => ({
          display: 'block', px: 3, py: 1, mb: 1,
          fontWeight: t.typography.fontWeightBold,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'text.disabled',
        })}>
          Additional filters
        </Typography>
        {filters.map((f) => {
          const selected = values[f.id] || [];
          return (
            <Box key={f.id} sx={{ px: 2, py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={(t) => ({ fontWeight: t.typography.fontWeightBold, color: 'text.disabled', letterSpacing: '0.04em', textTransform: 'uppercase' })}>
                  {f.label}
                </Typography>
                {selected.length > 0 && (
                  <Typography variant="caption" sx={{ color: 'primary.main' }}>{selected.length}</Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {f.options.map((opt) => {
                  const on = selected.includes(opt);
                  return (
                    <Box
                      key={opt}
                      component="button"
                      onClick={() => onChange(f.id, on ? selected.filter((o) => o !== opt) : [...selected, opt])}
                      sx={(t) => ({
                        display: 'inline-flex', alignItems: 'center',
                        height: 26, px: 2,
                        border: `1px solid ${on ? t.palette.primary.main : t.border.default}`,
                        borderRadius: `${t.radius.md}px`,
                        bgcolor: on ? alpha(t.palette.primary.main, 0.08) : t.surface.canvas,
                        color: on ? t.palette.primary.main : t.palette.text.secondary,
                        fontFamily: 'inherit', fontSize: 11.5, fontWeight: on ? t.typography.fontWeightSemibold : 'inherit',
                        cursor: 'pointer',
                        transition: t.motion.short,
                        '&:hover': { borderColor: t.border.strong },
                      })}
                    >
                      {opt}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Popover>
    </>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────

type FilterValues = Record<string, string[]>;

function FilterBar({
  librarySearch, onLibrarySearchChange,
  filterValues, onFilterChange, onRemove, onClearAll,
  view, onViewChange,
}: {
  librarySearch: string;
  onLibrarySearchChange: (v: string) => void;
  filterValues: FilterValues;
  onFilterChange: (id: string, v: string[]) => void;
  onRemove: (id: string, v: string) => void;
  onClearAll: () => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const primary = FILTERS.filter((f) => f.primary);
  const secondary = FILTERS.filter((f) => !f.primary);
  const activeChips = Object.entries(filterValues).flatMap(([fid, vals]) =>
    (vals || []).map((v) => ({ fid, v }))
  );

  return (
    <>
      <Box sx={(t) => ({
        display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        bgcolor: t.surface.canvas,
        border: `1px solid ${t.border.subtle}`,
        borderRadius: `${t.radius.lg}px`,
        p: 2, mb: 3,
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
      })}>
        {/* Library search */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: 240, height: 30 }}>
          <Box sx={(t) => ({
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'text.disabled', display: 'flex', pointerEvents: 'none',
          })}>
            <Search size={14} />
          </Box>
          <Box
            component="input"
            value={librarySearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onLibrarySearchChange(e.target.value)}
            placeholder="Search library…"
            className="toolbar__search__input"
            sx={(t) => ({
              width: '100%', height: 30,
              pl: 8, pr: librarySearch ? 8 : 3, py: 0,
              borderRadius: `${t.radius.md}px`,
              border: `1px solid ${t.border.default}`,
              bgcolor: t.surface.subtle,
              fontFamily: 'inherit', fontSize: 12.5,
              color: t.palette.text.primary, outline: 0,
              transition: t.motion.short,
              '&::placeholder': { color: t.palette.text.disabled },
              '&:hover': { bgcolor: t.surface.canvas, borderColor: t.border.strong },
              '&:focus': { bgcolor: t.surface.canvas, borderColor: t.palette.primary.main },
            })}
          />
          {librarySearch && (
            <Box
              component="button"
              onClick={() => onLibrarySearchChange('')}
              aria-label="Clear search"
              sx={(t) => ({
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 18, height: 18, p: 0,
                border: 0, background: 'transparent', cursor: 'pointer',
                borderRadius: `${t.radius.sm}px`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'text.disabled',
                '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
              })}
            >
              <X size={13} />
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem sx={(t) => ({ borderColor: t.border.default, height: 20, alignSelf: 'center' })} />

        {/* Primary filter chips */}
        {primary.map((f) => (
          <FilterDropdown
            key={f.id}
            label={f.label}
            options={f.options}
            value={filterValues[f.id] || []}
            onChange={(v) => onFilterChange(f.id, v)}
          />
        ))}

        <MoreFiltersDropdown filters={secondary} values={filterValues} onChange={onFilterChange} />

        <Box sx={{ flex: 1, minWidth: 8 }} />

        {/* View toggle */}
        <Box sx={(t) => ({
          display: 'inline-flex', p: 1,
          bgcolor: t.fill.default,
          borderRadius: `${t.radius.md}px`,
          gap: 1,
        })}>
          {([
            { id: 'list' as ViewMode, icon: <List size={15} />, label: 'List view' },
            { id: 'grid' as ViewMode, icon: <LayoutGrid size={15} />, label: 'Grid view' },
            { id: 'label' as ViewMode, icon: <Tag size={15} />, label: 'Label view' },
          ]).map((vt) => (
            <Tooltip key={vt.id} title={vt.label}>
              <Box
                component="button"
                onClick={() => onViewChange(vt.id)}
                aria-label={vt.label}
                sx={(t) => ({
                  width: 30, height: 26, p: 0,
                  border: 0,
                  borderRadius: `${t.radius.sm}px`,
                  display: 'grid', placeItems: 'center',
                  cursor: 'pointer',
                  color: view === vt.id ? t.palette.primary.main : t.palette.text.disabled,
                  bgcolor: view === vt.id ? t.surface.canvas : 'transparent',
                  boxShadow: view === vt.id ? t.elevation.low : 'none',
                  transition: t.motion.short,
                  '&:hover': { color: view === vt.id ? t.palette.primary.main : t.palette.text.primary },
                })}
              >
                {vt.icon}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', px: 1, mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {activeChips.length} filter{activeChips.length > 1 ? 's' : ''} active:
          </Typography>
          {activeChips.map(({ fid, v }, i) => {
            const filterLabel = FILTERS.find((f) => f.id === fid)?.label ?? fid;
            return (
              <Box
                key={fid + v + i}
                sx={(t) => ({
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  pl: 3, pr: 1, py: 1,
                  bgcolor: alpha(t.palette.primary.main, 0.08),
                  color: t.palette.primary.main,
                  borderRadius: `${t.radius.md}px`,
                  fontSize: 12, fontWeight: t.typography.fontWeightSemibold,
                })}
              >
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>{filterLabel}:</Box>
                {v}
                <Box
                  component="button"
                  onClick={() => onRemove(fid, v)}
                  aria-label="Remove filter"
                  sx={(t) => ({
                    width: 18, height: 18, p: 0,
                    border: 0, background: 'transparent', cursor: 'pointer',
                    borderRadius: `${t.radius.sm}px`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'inherit', opacity: 0.7,
                    transition: t.motion.short,
                    '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.16), opacity: 1 },
                  })}
                >
                  <X size={12} />
                </Box>
              </Box>
            );
          })}
          <Box
            component="button"
            onClick={onClearAll}
            sx={(t) => ({
              border: 0, background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12.5, fontWeight: t.typography.fontWeightMedium,
              color: 'text.disabled', px: 2, py: 1,
              borderRadius: `${t.radius.sm}px`,
              '&:hover': { color: 'error.main', bgcolor: alpha(t.palette.error.main, 0.08) },
            })}
          >
            Clear all
          </Box>
        </Box>
      )}
    </>
  );
}

// ── LibraryTable ───────────────────────────────────────────────────────────────

function LibraryTable({
  rows, sortBy, sortDir, onSort, selection, onToggleRow, onToggleAll, onToggleStar,
}: {
  rows: LibraryItem[];
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (col: SortKey) => void;
  selection: Set<number>;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
  onToggleStar: (id: number) => void;
}) {
  const allChecked = rows.length > 0 && rows.every((r) => selection.has(r.id));
  const someChecked = rows.some((r) => selection.has(r.id));
  const headerState: 'checked' | 'unchecked' | 'indeterminate' = allChecked ? 'checked' : someChecked ? 'indeterminate' : 'unchecked';

  const colTh = {
    fontSize: 11, fontWeight: 'fontWeightBold' as const,
    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    color: 'text.disabled',
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
    position: 'sticky' as const, top: 0, zIndex: 1,
  };

  function SortTh({ col, label }: { col: SortKey; label: string }) {
    const active = sortBy === col;
    return (
      <Box
        component="th"
        onClick={() => onSort(col)}
        sx={(t) => ({
          ...colTh,
          px: 3, py: 2,
          bgcolor: t.surface.subtle,
          borderBottom: `1px solid ${t.border.subtle}`,
          textAlign: 'left', cursor: 'pointer',
          color: active ? t.palette.primary.main : t.palette.text.disabled,
          transition: t.motion.short,
          '&:hover': { color: active ? t.palette.primary.main : t.palette.text.secondary },
        })}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {label}
          <Box sx={(t) => ({ display: 'flex', color: 'inherit', opacity: active ? 1 : 0, '.MuiBox-root:hover > & ': { opacity: 0.5 }, transition: t.motion.short, transform: active && sortDir === 'asc' ? 'rotate(180deg)' : 'none' })}>
            <ChevronDown size={13} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={(t) => ({
      bgcolor: t.surface.canvas,
      border: `1px solid ${t.border.subtle}`,
      borderRadius: `${t.radius.lg}px`,
      overflowX: 'auto',
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
    })}>
      <Box component="table" sx={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: 0 }}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" sx={(t) => ({ ...colTh, width: 44, px: 3, py: 2, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })}>
              <CheckCell state={headerState} onChange={onToggleAll} label="Select all" />
            </Box>
            <Box component="th" aria-label="Starred" sx={(t) => ({ ...colTh, width: 36, px: 1, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
            <Box
              component="th"
              onClick={() => onSort('name')}
              sx={(t) => ({
                ...colTh, px: 3, py: 2,
                bgcolor: t.surface.subtle,
                borderBottom: `1px solid ${t.border.subtle}`,
                textAlign: 'left', cursor: 'pointer',
                color: sortBy === 'name' ? t.palette.primary.main : t.palette.text.disabled,
                transition: t.motion.short,
                '&:hover': { color: sortBy === 'name' ? t.palette.primary.main : t.palette.text.secondary },
              })}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                Name
                <Box sx={(t) => ({ display: 'flex', opacity: sortBy === 'name' ? 1 : 0, transition: t.motion.short, transform: sortBy === 'name' && sortDir === 'asc' ? 'rotate(180deg)' : 'none' })}>
                  <ChevronDown size={13} />
                </Box>
              </Box>
            </Box>
            <SortTh col="reviewDate" label="Review date" />
            <SortTh col="published" label="Published" />
            <SortTh col="draftUpdated" label="Draft updated" />
            <Box component="th" sx={(t) => ({ ...colTh, width: 44, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row) => {
            const isSelected = selection.has(row.id);
            return (
              <Box
                key={row.id}
                component="tr"
                sx={(t) => ({
                  transition: t.motion.short,
                  bgcolor: isSelected ? alpha(t.palette.primary.main, 0.06) : 'transparent',
                  '&:hover': { bgcolor: isSelected ? alpha(t.palette.primary.main, 0.10) : t.surface.subtle },
                  '&:last-child td, &:last-child th': { borderBottom: 0 },
                })}
              >
                {/* Checkbox */}
                <Box component="td" sx={(t) => ({ width: 44, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                  <CheckCell state={isSelected ? 'checked' : 'unchecked'} onChange={() => onToggleRow(row.id)} label={`Select ${row.name}`} />
                </Box>
                {/* Star */}
                <Box component="td" sx={(t) => ({ width: 36, px: 1, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                  <Tooltip title={row.starred ? 'Unstar' : 'Star'}>
                    <Box
                      component="button"
                      onClick={() => onToggleStar(row.id)}
                      aria-label={row.starred ? 'Unstar' : 'Star'}
                      sx={(t) => ({
                        width: 24, height: 24, p: 0,
                        border: 0, background: 'transparent', cursor: 'pointer',
                        borderRadius: `${t.radius.sm}px`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: row.starred ? t.palette.warning.main : t.palette.grey[300],
                        transition: t.motion.short,
                        '&:hover': { bgcolor: t.fill.default, color: t.palette.warning.main },
                      })}
                    >
                      <Star size={15} fill={row.starred ? 'currentColor' : 'none'} />
                    </Box>
                  </Tooltip>
                </Box>
                {/* Name */}
                <Box component="td" sx={(t) => ({ maxWidth: 1, py: 2, px: 3, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <TypeIcon type={row.type} size={26} />
                    <Box component="span" sx={(t) => ({
                      fontWeight: t.typography.fontWeightMedium,
                      color: 'text.primary',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontSize: t.typography.body2.fontSize,
                    })}>
                      {row.name}
                    </Box>
                    {row.badge === 'Updated' && (
                      <Box sx={(t) => ({
                        display: 'inline-flex', px: 2, py: 1,
                        borderRadius: `${t.radius.sm}px`,
                        bgcolor: 'warning.main', color: 'common.white',
                        fontSize: 10.5, fontWeight: 'fontWeightBold', letterSpacing: '0.02em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      })}>
                        Updated
                      </Box>
                    )}
                    {(row.badge === 'E' || row.badge === 'F') && (
                      <Box sx={(t) => ({
                        width: 20, height: 20,
                        borderRadius: `${t.radius.sm}px`,
                        bgcolor: t.fill.emphasis,
                        color: 'text.secondary',
                        fontSize: 10, fontWeight: 'fontWeightBold',
                        display: 'grid', placeItems: 'center',
                        textTransform: 'uppercase',
                      })}>
                        {row.badge}
                      </Box>
                    )}
                    {row.comments && (
                      <Box sx={(t) => ({
                        display: 'inline-grid', placeItems: 'center',
                        minWidth: 18, height: 18, px: 1,
                        borderRadius: `${t.radius.pill}px`,
                        bgcolor: 'warning.main', color: 'common.white',
                        fontSize: 11, fontWeight: 'fontWeightBold',
                      })}>
                        {row.comments}
                      </Box>
                    )}
                  </Box>
                </Box>
                {/* Review date */}
                <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                  {row.reviewDate ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.reviewDate}</Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>—</Typography>
                  )}
                </Box>
                {/* Published */}
                <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                  {row.publishedState === 'unpublished' ? (
                    <Box sx={(t) => ({
                      display: 'inline-flex', px: 2, py: 1,
                      borderRadius: `${t.radius.sm}px`,
                      bgcolor: t.fill.default, color: 'text.secondary',
                      fontSize: 10.5, fontWeight: 'fontWeightBold', letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    })}>
                      Unpublished
                    </Box>
                  ) : (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: 'text.disabled', display: 'flex' }}>
                        {row.publishedState === 'private' ? <Lock size={13} /> : <Globe size={13} />}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.published}</Typography>
                    </Box>
                  )}
                </Box>
                {/* Draft updated */}
                <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.draftUpdated}</Typography>
                </Box>
                {/* More */}
                <Box component="td" sx={(t) => ({ width: 44, px: 2, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                  <Box
                    component="button"
                    aria-label="More actions"
                    sx={(t) => ({
                      width: 28, height: 28, p: 0,
                      border: 0, background: 'transparent', cursor: 'pointer',
                      borderRadius: `${t.radius.md}px`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'text.disabled',
                      opacity: 0,
                      transition: t.motion.short,
                      'tr:hover &': { opacity: 1 },
                      '&:hover': { bgcolor: t.fill.default, color: 'text.primary' },
                    })}
                  >
                    <MoreVertical size={16} />
                  </Box>
                </Box>
              </Box>
            );
          })}
          {rows.length === 0 && (
            <Box component="tr">
              <Box component="td" colSpan={7} sx={{ py: 11, textAlign: 'center' }}>
                <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, color: 'text.secondary', mb: 1 })}>
                  No results
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  Try clearing filters or searching for a different term.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {rows.length > 0 && (
        <Box sx={(t) => ({
          px: 4, py: 3,
          borderTop: `1px solid ${t.border.subtle}`,
          bgcolor: t.surface.subtle,
          textAlign: 'center',
        })}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Showing {rows.length} item{rows.length === 1 ? '' : 's'}. Press{' '}
            <Box component="kbd" sx={(t) => ({
              fontFamily: 'monospace',
              bgcolor: t.surface.canvas,
              border: `1px solid ${t.border.default}`,
              borderRadius: `${t.radius.sm}px`,
              px: 1, py: 1, fontSize: 11,
            })}>/</Box>
            {' '}to search.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── GridView ───────────────────────────────────────────────────────────────────

function GridThumb({ row }: { row: LibraryItem }) {
  const isGradient = row.id % 4 === 1;
  if (isGradient) {
    return (
      <Box sx={(t) => ({
        aspectRatio: '4 / 3',
        background: `linear-gradient(135deg, ${t.palette.secondary.light}, ${t.palette.primary.main})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1px solid ${t.border.subtle}`,
        color: 'common.white', opacity: 0.9,
      })}>
        <GitBranch size={40} strokeWidth={1.2} />
      </Box>
    );
  }
  const seed = row.id * 9301 + 49297;
  const r = (i: number) => ((seed * (i + 1)) % 233) / 233;
  return (
    <Box sx={(t) => ({
      aspectRatio: '4 / 3',
      bgcolor: t.surface.subtle,
      borderBottom: `1px solid ${t.border.subtle}`,
      position: 'relative', overflow: 'hidden',
    })}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="150" fill="#F5F6F8" />
        <rect x="10" y="10" width="180" height="18" rx="3" fill="#2C3E8C" opacity="0.85" />
        <rect x="20" y="16" width="60" height="6" rx="2" fill="white" opacity="0.9" />
        <rect x={20 + r(1) * 80} y="40" width="80" height="24" rx="3" fill="#DDE1E8" />
        <rect x={40 + r(2) * 60} y="72" width="100" height="24" rx="3" fill="#ECEEF2" />
        <rect x={30 + r(3) * 70} y="104" width="90" height="24" rx="3" fill={r(4) > 0.5 ? '#1F7A4A' : '#6846E6'} opacity="0.75" />
        <path d={`M60 64 L${60 + r(5) * 40} ${96 - r(6) * 20}`} stroke="#9AA2B1" strokeWidth="1.5" fill="none" />
      </svg>
    </Box>
  );
}

function GridView({
  rows, selection, onToggleRow, onToggleStar,
}: {
  rows: LibraryItem[];
  selection: Set<number>;
  onToggleRow: (id: number) => void;
  onToggleStar: (id: number) => void;
}) {
  return (
    <Box sx={(t) => ({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 4,
    })}>
      {rows.map((row) => {
        const isSelected = selection.has(row.id);
        return (
          <Box
            key={row.id}
            tabIndex={0}
            onClick={() => onToggleRow(row.id)}
            sx={(t) => ({
              bgcolor: t.surface.canvas,
              border: `1px solid ${isSelected ? t.palette.primary.main : t.border.subtle}`,
              borderRadius: `${t.radius.lg}px`,
              overflow: 'hidden', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              transition: t.motion.short,
              boxShadow: isSelected ? `0 0 0 2px ${alpha(t.palette.primary.main, 0.2)}` : 'none',
              '&:hover': { borderColor: isSelected ? t.palette.primary.main : t.border.strong, boxShadow: t.elevation.low },
              '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
            })}
          >
            <GridThumb row={row} />
            {/* Checkbox overlay */}
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={(t) => ({
                position: 'absolute', top: 10, left: 10,
                opacity: isSelected ? 1 : 0,
                bgcolor: t.surface.canvas,
                borderRadius: `${t.radius.sm}px`,
                boxShadow: t.elevation.low,
                transition: t.motion.short,
                '.MuiBox-root:hover > &': { opacity: 1 },
              })}
            >
              <CheckCell state={isSelected ? 'checked' : 'unchecked'} onChange={() => onToggleRow(row.id)} />
            </Box>
            {/* Star overlay */}
            <Box
              component="button"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleStar(row.id); }}
              aria-label={row.starred ? 'Unstar' : 'Star'}
              sx={(t) => ({
                position: 'absolute', top: 10, right: 10, p: 0,
                width: 28, height: 28,
                border: 0, cursor: 'pointer',
                borderRadius: `${t.radius.md}px`,
                bgcolor: 'rgba(255,255,255,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: row.starred ? t.palette.warning.main : t.palette.grey[400],
                boxShadow: t.elevation.low,
                opacity: row.starred ? 1 : 0,
                transition: t.motion.short,
                '.MuiBox-root:hover > &': { opacity: 1 },
              })}
            >
              <Star size={14} fill={row.starred ? 'currentColor' : 'none'} />
            </Box>
            {/* Card body */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TypeIcon type={row.type} size={22} />
                <Typography variant="body2" sx={(t) => ({
                  fontWeight: t.typography.fontWeightSemibold, lineHeight: 1.35,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                })}>
                  {row.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'text.disabled', display: 'flex' }}>
                  {row.publishedState === 'private' ? <Lock size={11} /> : row.publishedState === 'unpublished' ? null : <Globe size={11} />}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {row.publishedState === 'unpublished' ? 'Unpublished' : row.published}
                </Typography>
                <Box sx={(t) => ({ width: 3, height: 3, borderRadius: '50%', bgcolor: t.border.strong, flexShrink: 0 })} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Curbside Health</Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ── LabelView ──────────────────────────────────────────────────────────────────

function LabelView({
  rows, sortBy, sortDir, onSort, selection, onToggleRow, onToggleStar,
}: {
  rows: LibraryItem[];
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (col: SortKey) => void;
  selection: Set<number>;
  onToggleRow: (id: number) => void;
  onToggleStar: (id: number) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const groups: Record<string, LibraryItem[]> = {};
  rows.forEach((r) => { const k = r.labelGroup || 'Others'; (groups[k] = groups[k] || []).push(r); });
  const order = Object.keys(groups).sort((a, b) => (a === 'Others' ? 1 : b === 'Others' ? -1 : a.localeCompare(b)));

  return (
    <Box sx={(t) => ({
      bgcolor: t.surface.canvas,
      border: `1px solid ${t.border.subtle}`,
      borderRadius: `${t.radius.lg}px`,
      overflow: 'hidden',
    })}>
      {/* Shared header */}
      <Box component="table" sx={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: 0 }}>
        <Box component="thead">
          <Box component="tr">
            {[
              { w: 44, label: '' },
              { w: 36, label: '' },
            ].map((c, i) => (
              <Box key={i} component="th" sx={(t) => ({ width: c.w, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.default}`, px: 3, py: 2 })} />
            ))}
            {(['Name', 'Review date', 'Published', 'Draft updated'] as const).map((label, i) => (
              <Box
                key={label}
                component="th"
                onClick={() => onSort((['name', 'reviewDate', 'published', 'draftUpdated'] as SortKey[])[i])}
                sx={(t) => ({
                  px: 3, py: 2, textAlign: 'left', cursor: 'pointer',
                  bgcolor: t.surface.subtle,
                  borderBottom: `1px solid ${t.border.default}`,
                  fontSize: 11, fontWeight: 'fontWeightBold', letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'text.disabled', whiteSpace: 'nowrap',
                  transition: t.motion.short,
                  '&:hover': { color: 'text.secondary' },
                })}
              >
                {label}
              </Box>
            ))}
            <Box component="th" sx={(t) => ({ width: 44, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.default}` })} />
          </Box>
        </Box>
      </Box>

      {/* Groups */}
      {order.map((key) => {
        const grows = groups[key];
        const isCollapsed = !!collapsed[key];
        return (
          <Box key={key} sx={(t) => ({ borderBottom: `1px solid ${t.border.subtle}`, '&:last-child': { borderBottom: 0 } })}>
            {/* Group header */}
            <Box
              component="button"
              onClick={() => setCollapsed((c) => ({ ...c, [key]: !c[key] }))}
              sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 3,
                width: '100%', px: 4, py: 3,
                border: 0, cursor: 'pointer',
                bgcolor: t.surface.subtle,
                borderBottom: isCollapsed ? 0 : `1px solid ${t.border.subtle}`,
                fontFamily: 'inherit',
                transition: t.motion.short,
                '&:hover': { bgcolor: t.fill.default },
              })}
            >
              <Box sx={(t) => ({
                display: 'flex', color: 'text.disabled',
                transition: t.motion.short,
                transform: isCollapsed ? 'rotate(-90deg)' : 'none',
              })}>
                <ChevronDown size={14} />
              </Box>
              <Typography variant="caption" sx={(t) => ({
                fontWeight: t.typography.fontWeightBold,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: 'text.secondary',
              })}>
                {key}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                · {grows.length}
              </Typography>
            </Box>
            {/* Group rows */}
            {!isCollapsed && (
              <Box component="table" sx={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: 0 }}>
                <Box component="tbody">
                  {grows.map((row) => {
                    const isSelected = selection.has(row.id);
                    return (
                      <Box key={row.id} component="tr" sx={(t) => ({
                        transition: t.motion.short,
                        bgcolor: isSelected ? alpha(t.palette.primary.main, 0.06) : 'transparent',
                        '&:hover': { bgcolor: isSelected ? alpha(t.palette.primary.main, 0.10) : t.surface.subtle },
                        '&:last-child td': { borderBottom: 0 },
                      })}>
                        <Box component="td" sx={(t) => ({ width: 44, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                          <CheckCell state={isSelected ? 'checked' : 'unchecked'} onChange={() => onToggleRow(row.id)} label={`Select ${row.name}`} />
                        </Box>
                        <Box component="td" sx={(t) => ({ width: 36, px: 1, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                          <Box component="button" onClick={() => onToggleStar(row.id)} sx={(t) => ({ width: 24, height: 24, p: 0, border: 0, background: 'transparent', cursor: 'pointer', borderRadius: `${t.radius.sm}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: row.starred ? t.palette.warning.main : t.palette.grey[300], '&:hover': { bgcolor: t.fill.default, color: t.palette.warning.main } })}>
                            <Star size={15} fill={row.starred ? 'currentColor' : 'none'} />
                          </Box>
                        </Box>
                        <Box component="td" sx={(t) => ({ py: 2, px: 3, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
                            <TypeIcon type={row.type} size={24} />
                            <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightMedium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
                              {row.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                          <Typography variant="body2" sx={{ color: row.reviewDate ? 'text.secondary' : 'text.disabled' }}>{row.reviewDate || '—'}</Typography>
                        </Box>
                        <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.publishedState === 'unpublished' ? 'Unpublished' : row.published}</Typography>
                        </Box>
                        <Box component="td" sx={(t) => ({ width: 140, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.draftUpdated}</Typography>
                        </Box>
                        <Box component="td" sx={(t) => ({ width: 44, px: 2, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                          <Box component="button" aria-label="More actions" sx={(t) => ({ width: 28, height: 28, p: 0, border: 0, background: 'transparent', cursor: 'pointer', borderRadius: `${t.radius.md}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled', opacity: 0, transition: t.motion.short, 'tr:hover &': { opacity: 1 }, '&:hover': { bgcolor: t.fill.default } })}>
                            <MoreVertical size={16} />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ── BulkBar ────────────────────────────────────────────────────────────────────

function BulkBar({
  count, onClear, onStar, onMove, onShare, onDelete,
}: {
  count: number;
  onClear: () => void;
  onStar: () => void;
  onMove: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  return (
    <Box sx={(t) => ({
      position: 'sticky', bottom: 4,
      mx: 'auto', maxWidth: 620,
      mt: 4,
      bgcolor: t.palette.grey[900],
      color: 'common.white',
      px: 5, py: 3,
      borderRadius: `${t.radius.lg}px`,
      boxShadow: t.elevation.high,
      display: 'flex', alignItems: 'center', gap: 3,
      fontSize: 13,
      transform: count > 0 ? 'translateY(0)' : 'translateY(8px)',
      opacity: count > 0 ? 1 : 0,
      pointerEvents: count > 0 ? 'auto' : 'none',
      transition: t.motion.standard,
      zIndex: 10,
    })}>
      <Box component="span" sx={(t) => ({ fontWeight: t.typography.fontWeightBold, mr: 2 })}>{count}</Box>
      selected
      <Box sx={(t) => ({ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.16)' })} />
      {[
        { icon: <Star size={14} />, label: 'Star', onClick: onStar },
        { icon: <Move size={14} />, label: 'Move', onClick: onMove },
        { icon: <Share2 size={14} />, label: 'Share', onClick: onShare },
      ].map((btn) => (
        <Box
          key={btn.label}
          component="button"
          onClick={btn.onClick}
          sx={(t) => ({
            display: 'inline-flex', alignItems: 'center', gap: 2,
            height: 30, px: 3,
            border: 0, background: 'transparent', cursor: 'pointer',
            color: 'common.white', fontFamily: 'inherit', fontSize: 12.5,
            fontWeight: t.typography.fontWeightMedium,
            borderRadius: `${t.radius.md}px`,
            transition: t.motion.short,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' },
          })}
        >
          {btn.icon} {btn.label}
        </Box>
      ))}
      <Box
        component="button"
        onClick={onDelete}
        sx={(t) => ({
          display: 'inline-flex', alignItems: 'center', gap: 2,
          height: 30, px: 3,
          border: 0, background: 'transparent', cursor: 'pointer',
          color: 'common.white', fontFamily: 'inherit', fontSize: 12.5,
          fontWeight: t.typography.fontWeightMedium,
          borderRadius: `${t.radius.md}px`,
          transition: t.motion.short,
          '&:hover': { bgcolor: alpha(t.palette.error.main, 0.3), color: '#fcd2d0' },
        })}
      >
        <Trash2 size={14} /> Delete
      </Box>
      <Box sx={(t) => ({ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.16)' })} />
      <Box
        component="button"
        onClick={onClear}
        title="Clear selection (Esc)"
        sx={(t) => ({
          width: 28, height: 28, p: 0,
          border: 0, background: 'transparent', cursor: 'pointer',
          color: 'common.white',
          borderRadius: `${t.radius.md}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: t.motion.short,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' },
        })}
      >
        <X size={14} />
      </Box>
    </Box>
  );
}

// ── LibraryPage ────────────────────────────────────────────────────────────────

export function LibraryPage() {
  const [activeNav, setActiveNav] = useState<NavId>('library');
  const [globalSearch, setGlobalSearch] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [view, setView] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortKey>('draftUpdated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [starred, setStarred] = useState<Set<number>>(
    () => new Set(LIBRARY_DATA.filter((r) => r.starred).map((r) => r.id))
  );
  const [aiDismissed, setAiDismissed] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }
      if (e.key === '/') { e.preventDefault(); document.querySelector<HTMLInputElement>('.toolbar__search__input')?.focus(); }
      if (e.key === 'Escape') setSelection(new Set());
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const rows = useMemo(() => {
    let r = LIBRARY_DATA.map((row) => ({ ...row, starred: starred.has(row.id) }));
    const lq = librarySearch.trim().toLowerCase();
    if (lq) r = r.filter((row) => row.name.toLowerCase().includes(lq));
    const gq = globalSearch.trim().toLowerCase();
    if (gq) r = r.filter((row) => row.name.toLowerCase().includes(gq));
    for (const [fid, vals] of Object.entries(filterValues)) {
      if (!vals || vals.length === 0) continue;
      r = r.filter((row) => {
        if (fid === 'type') return vals.some((v) => v.toLowerCase() === row.type || (v === 'Document' && row.type === 'document') || (v === 'Pathway' && row.type === 'pathway'));
        if (fid === 'status') return vals.includes(row.status) || (vals.includes('Unpublished') && row.publishedState === 'unpublished');
        if (fid === 'people') return vals.includes(row.people);
        if (fid === 'specialty') return vals.includes(row.specialty ?? '');
        if (fid === 'labels') return vals.some((v) => (v === 'External' && row.badge === 'E') || (v === 'Featured' && row.badge === 'F'));
        return true;
      });
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    r.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      return ((a[sortBy] ?? '') as string).localeCompare((b[sortBy] ?? '') as string) * dir;
    });
    return r;
  }, [globalSearch, librarySearch, filterValues, sortBy, sortDir, starred]);

  const total = LIBRARY_DATA.length;

  const onFilterChange = (fid: string, vals: string[]) =>
    setFilterValues((p) => ({ ...p, [fid]: vals }));
  const onRemoveFilter = (fid: string, v: string) =>
    setFilterValues((p) => ({ ...p, [fid]: (p[fid] || []).filter((x) => x !== v) }));
  const onClearAll = () => setFilterValues({});
  const onSort = (col: SortKey) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('desc'); }
  };
  const onToggleRow = (id: number) =>
    setSelection((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const onToggleAll = () =>
    setSelection((p) => {
      const allIds = rows.map((r) => r.id);
      return allIds.every((id) => p.has(id)) ? new Set() : new Set(allIds);
    });
  const onToggleStar = (id: number) =>
    setStarred((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const hasFilters = Object.values(filterValues).some((v) => v && v.length > 0);

  return (
    <Box sx={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <Box sx={(t) => ({
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        bgcolor: t.surface.subtle,
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[800] }),
      })}>
        <LibraryTopbar search={globalSearch} onSearchChange={setGlobalSearch} />

        {/* Scrollable page */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 8, py: 6 }}>
          {/* Page header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, mb: 5 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={(t) => ({
                fontWeight: t.typography.fontWeightBold,
                letterSpacing: '-0.02em', lineHeight: 1.15,
              })}>
                Library
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                <Box component="strong" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, color: 'text.primary' })}>{rows.length}</Box>
                {' '}of{' '}
                <Box component="strong" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, color: 'text.primary' })}>{total}</Box>
                {' '}items{hasFilters && ' · filtered'}
              </Typography>
            </Box>
          </Box>

          {/* AI suggestion card */}
          {!aiDismissed && (
            <Box sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 3,
              p: 3, mb: 5,
              background: `linear-gradient(135deg, ${alpha(t.palette.secondary.main, 0.06)}, ${alpha(t.palette.primary.main, 0.06)})`,
              border: `1px solid ${t.border.subtle}`,
              borderRadius: `${t.radius.lg}px`,
            })}>
              <Box sx={(t) => ({
                width: 32, height: 32, flexShrink: 0,
                borderRadius: `${t.radius.md}px`,
                background: `linear-gradient(135deg, ${t.palette.secondary.light}, ${t.palette.primary.main})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'common.white',
              })}>
                <Sparkles size={16} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold })}>
                  Generate a pathway with AI
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  Describe a protocol or drop a PDF and we'll draft it for you.
                </Typography>
              </Box>
              <Button variant="outlined" size="small" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, flexShrink: 0 })}>
                Try it
              </Button>
              <Tooltip title="Dismiss">
                <IconButton
                  size="small"
                  onClick={() => setAiDismissed(true)}
                  aria-label="Dismiss AI suggestion"
                  sx={{ color: 'text.secondary' }}
                >
                  <X size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Filter bar */}
          <FilterBar
            librarySearch={librarySearch}
            onLibrarySearchChange={setLibrarySearch}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onRemove={onRemoveFilter}
            onClearAll={onClearAll}
            view={view}
            onViewChange={setView}
          />

          {/* Content views */}
          <Box aria-live="polite">
            {view === 'list' && (
              <LibraryTable
                rows={rows}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                selection={selection}
                onToggleRow={onToggleRow}
                onToggleAll={onToggleAll}
                onToggleStar={onToggleStar}
              />
            )}
            {view === 'grid' && (
              <GridView
                rows={rows}
                selection={selection}
                onToggleRow={onToggleRow}
                onToggleStar={onToggleStar}
              />
            )}
            {view === 'label' && (
              <LabelView
                rows={rows}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                selection={selection}
                onToggleRow={onToggleRow}
                onToggleStar={onToggleStar}
              />
            )}
          </Box>

          {/* Bulk action bar */}
          <BulkBar
            count={selection.size}
            onClear={() => setSelection(new Set())}
            onStar={() => { setStarred((p) => { const n = new Set(p); selection.forEach((id) => n.add(id)); return n; }); setSelection(new Set()); }}
            onMove={() => {}}
            onShare={() => {}}
            onDelete={() => setSelection(new Set())}
          />
        </Box>
      </Box>
    </Box>
  );
}
