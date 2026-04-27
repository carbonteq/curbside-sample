import React, { useState, useMemo, useEffect } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {
  Library, Star, Clock, Users, Folder, Plus, ChevronDown, ChevronRight,
  Bell, UserPlus, Sparkles, LayoutGrid, List, Tag, Filter, X, Check,
  MoreVertical, Globe, Lock, Share2, Trash2, Move, Upload, Search,
  GitBranch, FileText,
  Stethoscope, HelpCircle, LogOut, User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────────

type LibraryItemType = 'pathway' | 'workflow' | 'document';

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
  { id: 7,  type: 'workflow', name: 'demo', starred: false, reviewDate: 'in a year', published: 'a month ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 8,  type: 'pathway',  name: 'WF 13 Nov', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: null, status: 'Published', people: 'You' },
  { id: 9,  type: 'pathway',  name: 'BMI Test', starred: false, reviewDate: '3 years ago', published: '3 years ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Internal Medicine', status: 'Published', people: 'Jordan Kim' },
  { id: 10, type: 'pathway',  name: 'TPA Demo Trial', starred: false, reviewDate: 'in 6 months', published: '6 months ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 11, type: 'pathway',  name: 'Community Acquired Pneumonia - QI project | Portsmouth Regional Hospital', starred: false, reviewDate: 'a year ago', published: '2 years ago', publishedState: 'public', draftUpdated: 'a month ago', badge: null, specialty: 'Inpatient', status: 'Published', people: 'Alex Chen', labelGroup: 'Infectious' },
  { id: 12, type: 'document', name: 'Hello Content', starred: false, reviewDate: 'in a year', published: 'a month ago', publishedState: 'public', draftUpdated: 'a month ago', badge: 'F', specialty: null, status: 'Published', people: 'You' },
  { id: 13, type: 'pathway',  name: 'Screening And Management Of High Blood Pressure In Children And Adolescents', starred: true, reviewDate: 'in 10 months', published: '2 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: 'Pediatrics', status: 'Published', people: 'Alex Chen' },
  { id: 14, type: 'document', name: 'demo (annotated)', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: null, status: 'Published', people: 'You', comments: 2 },
  { id: 18, type: 'workflow', name: 'Sepsis Bundle — Emergency', starred: true, reviewDate: 'in 4 months', published: '2 months ago', publishedState: 'public', draftUpdated: 'a week ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 19, type: 'document', name: 'PHQ-9 Intake Form', starred: false, reviewDate: 'in a year', published: '3 months ago', publishedState: 'public', draftUpdated: '3 weeks ago', badge: null, specialty: 'Internal Medicine', status: 'Published', people: 'Jordan Kim' },
  { id: 15, type: 'pathway',  name: 'ACLS Healthcare Provider Post-Cardiac Arrest Care Algorithm', starred: false, reviewDate: 'in 10 months', published: '2 months ago', publishedState: 'public', draftUpdated: '2 months ago', badge: null, specialty: 'Emergency', status: 'Published', people: 'Alex Chen' },
  { id: 16, type: 'pathway',  name: 'demo pathways', starred: false, reviewDate: 'in 9 months', published: '3 months ago', publishedState: 'public', draftUpdated: '3 months ago', badge: 'E', specialty: null, status: 'Published', people: 'You' },
  { id: 17, type: 'pathway',  name: '13 Nov Pathways', starred: false, reviewDate: 'in 7 months', published: '5 months ago', publishedState: 'public', draftUpdated: '4 months ago', badge: null, specialty: null, status: 'Published', people: 'You' },
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

const CONTENT_TYPES: { id: LibraryItemType; label: string }[] = [
  { id: 'pathway',  label: 'Pathway'       },
  { id: 'workflow', label: 'Workflow'      },
  { id: 'document', label: 'Text Document' },
];

const TYPE_ICON_FN: Record<LibraryItemType, (s: number) => React.ReactNode> = {
  pathway:  (s) => <GitBranch size={s} />,
  workflow: (s) => <Share2 size={s} />,
  document: (s) => <FileText size={s} />,
};

const FILTERS = [
  { id: 'type',      label: 'Type',      primary: true,  options: ['Pathway', 'Workflow', 'Text Document'] },
  { id: 'status',    label: 'Status',    primary: true,  options: ['Published', 'Draft', 'Unpublished'] },
  { id: 'people',    label: 'People',    primary: false, options: ['You', 'Alex Chen', 'Jordan Kim'] },
  { id: 'specialty', label: 'Specialty', primary: false, options: ['Pediatrics', 'Internal Medicine', 'Emergency', 'Inpatient'] },
  { id: 'labels',    label: 'Labels',    primary: false, options: ['External', 'Featured', 'QI Project', 'Guideline'] },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const tableHeaderSx = (t: Theme) => ({
  ...t.typography.overline,
  fontWeight: t.typography.fontWeightBold,
  color: t.palette.text.disabled,
  whiteSpace: 'nowrap' as const,
  userSelect: 'none' as const,
  position: 'sticky' as const,
  top: 0,
  zIndex: 1,
});

// ── TypeIcon ───────────────────────────────────────────────────────────────────

const CONTENT_TYPE_COLOR: Record<LibraryItemType, (t: ReturnType<typeof useTheme>) => string> = {
  pathway:  (t) => t.contentType.pathway,
  workflow: (t) => t.contentType.workflow,
  document: (t) => t.contentType.textDocument,
};

function TypeIcon({ type, size = 28 }: { type: LibraryItemType; size?: number }) {
  const iconSize = Math.round(size * 0.55);
  const fn = TYPE_ICON_FN[type] ?? TYPE_ICON_FN.pathway;
  return (
    <Box sx={(t) => ({
      width: size, height: size, flexShrink: 0,
      borderRadius: `${t.radius.sm}px`,
      bgcolor: CONTENT_TYPE_COLOR[type]?.(t) ?? t.contentType.pathway,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'common.white',
    })}>
      {fn(iconSize)}
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
  { id: 'community', label: 'Community',            icon: <Globe size={17} /> },
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
        <ButtonBase
          onClick={() => navigate('/')}
          aria-label="Curbside Health workspace"
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white',
            ...t.typography.caption,
            fontWeight: t.typography.fontWeightBold,
            background: t.brand.gradient,
            boxShadow: `0 3px 6px rgba(0,0,0,0.10), 0 1px 3px rgba(88,110,224,0.10)`,
            transition: t.motion.short,
            '&:hover': { transform: 'scale(1.05)' },
          })}
        >
          CH
        </ButtonBase>
      </Tooltip>
      <Tooltip title="Another workspace" placement="right">
        <Box sx={{ position: 'relative' }}>
          <ButtonBase
            aria-label="Another workspace"
            sx={(t) => ({
              width: 28, height: 28, borderRadius: `${t.radius.md}px`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'common.white',
              ...t.typography.caption,
              fontWeight: t.typography.fontWeightBold,
              bgcolor: t.palette.grey[400],
              opacity: 0.7,
              transition: t.motion.short,
              '&:hover': { opacity: 1 },
            })}
          >
            AM
          </ButtonBase>
          <Box sx={(t) => ({
            position: 'absolute', top: -4, right: -4,
            minWidth: 14, height: 14, px: 1,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: t.palette.error.main,
            color: 'common.white',
            ...t.typography.caption,
            fontWeight: t.typography.fontWeightBold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          })}>
            2
          </Box>
        </Box>
      </Tooltip>
      <Tooltip title="Research Kit" placement="right">
        <ButtonBase
          aria-label="Research Kit workspace"
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white',
            ...t.typography.caption,
            fontWeight: t.typography.fontWeightBold,
            bgcolor: 'success.dark',
            transition: t.motion.short,
            '&:hover': { transform: 'scale(1.05)' },
          })}
        >
          RK
        </ButtonBase>
      </Tooltip>
      <Tooltip title="Add workspace" placement="right">
        <IconButton
          aria-label="Add workspace"
          size="small"
          sx={(t) => ({
            width: 28, height: 28, borderRadius: `${t.radius.md}px`,
            border: `1px dashed ${t.border.strong}`,
            bgcolor: 'transparent',
            color: t.palette.text.secondary,
            transition: t.motion.short,
            '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
          })}
        >
          <Plus size={14} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function AccountPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <ButtonBase
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 2,
          width: '100%', textAlign: 'left', color: 'inherit',
          borderRadius: 1,
        }}
      >
        <Box sx={(t) => ({
          width: 28, height: 28, borderRadius: `${t.radius.md}px`,
          background: t.brand.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'common.white',
          ...t.typography.body2,
          fontWeight: t.typography.fontWeightBold,
          flexShrink: 0,
        })}>
          CH
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={(t) => ({
            display: 'flex', alignItems: 'center', gap: 1,
            fontWeight: t.typography.fontWeightSemibold, lineHeight: 1.3,
          })}>
            Curbside Health <ChevronDown size={13} />
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Hammad Ahmed
          </Typography>
        </Box>
      </ButtonBase>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
            background: t.brand.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'common.white',
            ...t.typography.body2,
            fontWeight: t.typography.fontWeightBold,
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
        <MenuList disablePadding>
          {[
            { icon: <User size={15} />, label: 'Account Settings', onClick: () => { setAnchorEl(null); navigate('/settings'); } },
            { icon: <HelpCircle size={15} />, label: 'Help', onClick: () => setAnchorEl(null) },
          ].map((item) => (
            <MenuItem
              key={item.label}
              onClick={item.onClick}
              sx={(t) => ({
                gap: 3,
                borderRadius: `${t.radius.md}px`,
                ...t.typography.body2,
                fontWeight: t.typography.fontWeightMedium,
              })}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
          <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
          <MenuItem
            onClick={() => setAnchorEl(null)}
            sx={(t) => ({
              gap: 3,
              borderRadius: `${t.radius.md}px`,
              color: t.palette.error.main,
              ...t.typography.body2,
              fontWeight: t.typography.fontWeightMedium,
              '&:hover': { bgcolor: alpha(t.palette.error.main, 0.08) },
            })}
          >
            <LogOut size={15} />
            Log out
          </MenuItem>
        </MenuList>
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
                sx={(t) => ({
                  display: 'flex', alignItems: 'center',
                  borderRadius: `${t.radius.md}px`,
                  bgcolor: isActive ? alpha(t.palette.primary.main, 0.08) : 'transparent',
                  transition: t.motion.short,
                  '&:hover': { bgcolor: isActive ? alpha(t.palette.primary.main, 0.12) : t.fill.default },
                  '&:hover .nav-add-btn': { opacity: 1 },
                })}
              >
                <ButtonBase
                  onClick={() => onNavChange(item.id)}
                  sx={(t) => ({
                    flex: 1, display: 'flex', alignItems: 'center', gap: 2,
                    px: 3, py: 2, minHeight: 32,
                    borderRadius: `${t.radius.md}px`,
                    ...t.typography.body2,
                    fontWeight: isActive ? t.typography.fontWeightSemibold : t.typography.fontWeightMedium,
                    color: isActive ? t.palette.primary.main : t.palette.text.secondary,
                    textAlign: 'left',
                    '&:hover': { color: isActive ? t.palette.primary.main : t.palette.text.primary },
                  })}
                >
                  <Box sx={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </Box>
                </ButtonBase>
                {item.addable && (
                  <IconButton
                    className="nav-add-btn"
                    size="small"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    aria-label={`Create new in ${item.label}`}
                    sx={(t) => ({
                      mr: 1, width: 20, height: 20, p: 0,
                      borderRadius: `${t.radius.sm}px`,
                      color: t.palette.text.secondary,
                      opacity: 0,
                      transition: t.motion.short,
                      '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
                    })}
                  >
                    <Plus size={14} />
                  </IconButton>
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
            ...t.typography.overline,
            fontWeight: t.typography.fontWeightBold,
            color: 'text.disabled',
          })}>
            <span>Folders</span>
            <IconButton
              size="small"
              aria-label="New folder"
              sx={(t) => ({
                width: 18, height: 18, p: 0,
                borderRadius: `${t.radius.sm}px`,
                color: t.palette.text.disabled,
                '&:hover': { bgcolor: t.fill.default, color: t.palette.primary.main },
              })}
            >
              <Plus size={12} />
            </IconButton>
          </Box>

          {FOLDERS.map((f) => (
            <ButtonBase
              key={f.name}
              sx={(t) => ({
                display: 'flex', alignItems: 'center', gap: 2,
                width: '100%', px: 3, py: 2, minHeight: 28,
                pl: f.expandable ? 3 : 7,
                ...t.typography.body2,
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
            </ButtonBase>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={(t) => ({
          px: 3, py: 3,
          borderTop: `1px solid ${t.border.subtle}`,
          flexShrink: 0,
          ...t.applyStyles('dark', { borderColor: t.palette.grey[800] }),
        })}>
          <Button
            variant="text"
            fullWidth
            startIcon={<UserPlus size={15} />}
            sx={(t) => ({
              bgcolor: alpha(t.palette.primary.main, 0.08),
              color: t.palette.primary.main,
              fontWeight: t.typography.fontWeightSemibold,
              '&:hover': { bgcolor: alpha(t.palette.primary.main, 0.14) },
            })}
          >
            Invite people
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ── NewMenu ────────────────────────────────────────────────────────────────────

function NewMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="contained"
        size="medium"
        startIcon={<Plus size={15} />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold, gap: 1 })}
      >
        New
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
        <MenuList disablePadding>
          {CONTENT_TYPES.map((ct) => (
            <MenuItem
              key={ct.id}
              onClick={() => setAnchorEl(null)}
              sx={(t) => ({
                gap: 3,
                borderRadius: `${t.radius.md}px`,
                ...t.typography.body2,
                fontWeight: t.typography.fontWeightMedium,
              })}
            >
              <TypeIcon type={ct.id} size={26} />
              {ct.label}
            </MenuItem>
          ))}
          <Divider sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />
          <MenuItem
            onClick={() => setAnchorEl(null)}
            sx={(t) => ({
              gap: 3,
              borderRadius: `${t.radius.md}px`,
              ...t.typography.body2,
              fontWeight: t.typography.fontWeightMedium,
              color: t.palette.text.secondary,
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
          </MenuItem>
        </MenuList>
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
      <InputBase
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Curbside Health"
        startAdornment={
          <InputAdornment position="start">
            <Search size={16} style={{ color: 'inherit', opacity: 0.4 }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['⌘', 'K'].map((k) => (
                <Box key={k} component="span" sx={(t) => ({
                  px: 1, py: 0,
                  bgcolor: t.surface.subtle,
                  border: `1px solid ${t.border.default}`,
                  borderRadius: `${t.radius.sm}px`,
                  lineHeight: 1.4,
                  ...t.typography.caption,
                  color: 'text.disabled',
                })}>
                  {k}
                </Box>
              ))}
            </Box>
          </InputAdornment>
        }
        sx={(t) => ({
          flex: '1 1 auto', maxWidth: 520,
          height: 36,
          pl: 3, pr: 3,
          borderRadius: `${t.radius.lg}px`,
          border: `1px solid ${t.border.default}`,
          bgcolor: t.surface.subtle,
          ...t.typography.body2,
          color: t.palette.text.primary,
          transition: t.motion.short,
          '& .MuiInputBase-input::placeholder': { color: t.palette.text.disabled },
          '&:hover': { bgcolor: t.surface.canvas, borderColor: t.border.strong },
          '&.Mui-focused': { bgcolor: t.surface.canvas, borderColor: t.palette.primary.main },
          '& .MuiInputAdornment-root': { color: t.palette.text.secondary },
        })}
      />

      <Box sx={{ flex: 1 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Notifications">
          <IconButton size="small" aria-label="Notifications" sx={(t) => ({ position: 'relative', color: t.palette.text.secondary })}>
            <Bell size={18} />
            <Box sx={(t) => ({
              position: 'absolute', top: 3, right: 3,
              width: 7, height: 7, borderRadius: '50%',
              bgcolor: 'error.main',
              border: `1.5px solid ${t.surface.canvas}`,
              pointerEvents: 'none',
            })} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Invite members">
          <IconButton size="medium" aria-label="Invite members" sx={{ color: 'text.secondary' }}>
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const active = value.length > 0;

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((o) => o !== opt) : [...value, opt]);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ChevronDown size={12} />}
        sx={(t) => ({
          height: 30, px: 3,
          border: `1px solid ${active ? t.palette.primary.main : t.border.default}`,
          bgcolor: active ? alpha(t.palette.primary.main, 0.08) : t.surface.canvas,
          color: active ? t.palette.primary.main : t.palette.text.secondary,
          fontWeight: t.typography.fontWeightMedium,
          whiteSpace: 'nowrap',
          minWidth: 'unset',
          '&:hover': {
            borderColor: active ? t.palette.primary.dark : t.border.strong,
            color: active ? t.palette.primary.main : t.palette.text.primary,
            bgcolor: active ? alpha(t.palette.primary.main, 0.1) : t.fill.default,
          },
        })}
      >
        {label}
        {active && (
          <Box component="span" sx={(t) => ({
            ml: 1,
            minWidth: 18, height: 18, px: 1,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: 'primary.main', color: 'primary.contrastText',
            ...t.typography.caption,
            fontWeight: t.typography.fontWeightBold,
            display: 'inline-grid', placeItems: 'center',
          })}>
            {value.length}
          </Box>
        )}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
        <Typography variant="overline" sx={{ display: 'block', px: 3, py: 1, color: 'text.disabled' }}>
          {label}
        </Typography>
        <MenuList disablePadding>
          {options.map((opt) => {
            const checked = value.includes(opt);
            return (
              <MenuItem
                key={opt}
                onClick={() => toggle(opt)}
                sx={(t) => ({
                  gap: 2,
                  borderRadius: `${t.radius.md}px`,
                  color: checked ? t.palette.primary.main : t.palette.text.primary,
                  bgcolor: checked ? alpha(t.palette.primary.main, 0.06) : 'transparent',
                  fontWeight: checked ? t.typography.fontWeightSemibold : 'inherit',
                })}
              >
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ p: 0, width: 16, height: 16 }}
                />
                {opt}
              </MenuItem>
            );
          })}
          {active && [
            <Divider key="div" sx={(t) => ({ my: 1, borderColor: t.border.subtle })} />,
            <MenuItem
              key="clear"
              onClick={() => { onChange([]); setAnchorEl(null); }}
              sx={(t) => ({
                gap: 2,
                borderRadius: `${t.radius.md}px`,
                color: t.palette.text.secondary,
              })}
            >
              <X size={14} /> Clear
            </MenuItem>,
          ]}
        </MenuList>
      </Popover>
    </>
  );
}

// ── MoreFiltersDropdown ────────────────────────────────────────────────────────

function MoreFiltersDropdown({
  filters, values, onChange,
}: { filters: typeof FILTERS; values: Record<string, string[]>; onChange: (id: string, v: string[]) => void }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const activeCount = filters.reduce((n, f) => n + ((values[f.id] || []).length > 0 ? 1 : 0), 0);

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Filter size={13} />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(t) => ({
          height: 30, px: 3,
          border: `1px solid ${activeCount > 0 ? t.palette.primary.main : t.border.default}`,
          bgcolor: activeCount > 0 ? alpha(t.palette.primary.main, 0.08) : t.surface.canvas,
          color: activeCount > 0 ? t.palette.primary.main : t.palette.text.secondary,
          fontWeight: t.typography.fontWeightMedium,
          whiteSpace: 'nowrap',
          minWidth: 'unset',
          '&:hover': { borderColor: t.border.strong, color: t.palette.text.primary },
        })}
      >
        More filters
        {activeCount > 0 && (
          <Box component="span" sx={(t) => ({
            ml: 1,
            minWidth: 18, height: 18, px: 1,
            borderRadius: `${t.radius.pill}px`,
            bgcolor: 'primary.main', color: 'primary.contrastText',
            ...t.typography.caption,
            fontWeight: t.typography.fontWeightBold,
            display: 'inline-grid', placeItems: 'center',
          })}>
            {activeCount}
          </Box>
        )}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
        <Typography variant="overline" sx={{ display: 'block', px: 3, py: 1, mb: 1, color: 'text.disabled' }}>
          Additional filters
        </Typography>
        {filters.map((f) => {
          const selected = values[f.id] || [];
          return (
            <Box key={f.id} sx={{ px: 2, py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
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
                    <Chip
                      key={opt}
                      label={opt}
                      size="small"
                      onClick={() => onChange(f.id, on ? selected.filter((o) => o !== opt) : [...selected, opt])}
                      variant={on ? 'filled' : 'outlined'}
                      color={on ? 'primary' : 'default'}
                      sx={(t) => ({
                        height: 26,
                        fontWeight: on ? t.typography.fontWeightSemibold : 'inherit',
                        borderColor: on ? t.palette.primary.main : t.border.default,
                      })}
                    />
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
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        mb: 3,
      }}>
        {/* Library search */}
        <InputBase
          value={librarySearch}
          onChange={(e) => onLibrarySearchChange(e.target.value)}
          placeholder="Filter by name…"
          inputProps={{ className: 'toolbar__search__input' }}
          startAdornment={
            <InputAdornment position="start">
              <Search size={14} style={{ color: 'inherit', opacity: 0.4 }} />
            </InputAdornment>
          }
          endAdornment={librarySearch ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onLibrarySearchChange('')}
                aria-label="Clear search"
                sx={(t) => ({
                  p: 0, width: 18, height: 18,
                  borderRadius: `${t.radius.sm}px`,
                  color: 'text.disabled',
                  '&:hover': { bgcolor: t.fill.default, color: t.palette.text.primary },
                })}
              >
                <X size={13} />
              </IconButton>
            </InputAdornment>
          ) : undefined}
          sx={(t) => ({
            width: 240, height: 30,
            pl: 3, pr: 2,
            borderRadius: `${t.radius.md}px`,
            border: `1px solid ${t.border.default}`,
            bgcolor: t.surface.subtle,
            ...t.typography.body2,
            color: t.palette.text.primary,
            transition: t.motion.short,
            '& .MuiInputBase-input::placeholder': { color: t.palette.text.disabled },
            '&:hover': { bgcolor: t.surface.canvas, borderColor: t.border.strong },
            '&.Mui-focused': { bgcolor: t.surface.canvas, borderColor: t.palette.primary.main },
          })}
        />

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
              <IconButton
                onClick={() => onViewChange(vt.id)}
                aria-label={vt.label}
                size="small"
                sx={(t) => ({
                  width: 30, height: 26, p: 0,
                  borderRadius: `${t.radius.sm}px`,
                  color: view === vt.id ? t.palette.primary.main : t.palette.text.disabled,
                  bgcolor: view === vt.id ? t.surface.canvas : 'transparent',
                  boxShadow: view === vt.id ? t.elevation.low : 'none',
                  transition: t.motion.short,
                  '&:hover': { color: view === vt.id ? t.palette.primary.main : t.palette.text.primary },
                })}
              >
                {vt.icon}
              </IconButton>
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
              <Chip
                key={fid + v + i}
                label={<><Box component="span" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>{filterLabel}:</Box> {v}</>}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => onRemove(fid, v)}
                sx={(t) => ({
                  bgcolor: alpha(t.palette.primary.main, 0.08),
                  fontWeight: t.typography.fontWeightSemibold,
                })}
              />
            );
          })}
          <Button
            size="small"
            variant="text"
            onClick={onClearAll}
            sx={(t) => ({
              color: 'text.disabled', minWidth: 0,
              '&:hover': { color: 'error.main', bgcolor: alpha(t.palette.error.main, 0.08) },
            })}
          >
            Clear all
          </Button>
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

  function SortTh({ col, label }: { col: SortKey; label: string }) {
    const active = sortBy === col;
    return (
      <Box
        component="th"
        onClick={() => onSort(col)}
        sx={(t) => ({
          ...tableHeaderSx(t),
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
          <Box sx={(t) => ({ display: 'flex', color: 'inherit', opacity: active ? 1 : 0, transition: t.motion.short, transform: active && sortDir === 'asc' ? 'rotate(180deg)' : 'none' })}>
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
            <Box component="th" sx={(t) => ({ ...tableHeaderSx(t), width: 44, px: 3, py: 2, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })}>
              <Checkbox
                size="small"
                checked={allChecked}
                indeterminate={someChecked && !allChecked}
                onChange={onToggleAll}
                slotProps={{ input: { 'aria-label': 'Select all' } }}
                sx={{ p: 0, width: 16, height: 16 }}
              />
            </Box>
            <Box component="th" aria-label="Starred" sx={(t) => ({ ...tableHeaderSx(t), width: 36, px: 1, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
            <Box
              component="th"
              onClick={() => onSort('name')}
              sx={(t) => ({
                ...tableHeaderSx(t), px: 3, py: 2,
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
            <Box component="th" sx={(t) => ({ ...tableHeaderSx(t), width: 120, px: 3, py: 2, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}`, textAlign: 'left' })}>
              Owner
            </Box>
            <SortTh col="reviewDate" label="Review date" />
            <SortTh col="published" label="Published" />
            <SortTh col="draftUpdated" label="Draft updated" />
            <Box component="th" sx={(t) => ({ ...tableHeaderSx(t), width: 44, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
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
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => onToggleRow(row.id)}
                    slotProps={{ input: { 'aria-label': `Select ${row.name}` } }}
                    sx={{ p: 0, width: 16, height: 16 }}
                  />
                </Box>
                {/* Star */}
                <Box component="td" sx={(t) => ({ width: 36, px: 1, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                  <Tooltip title={row.starred ? 'Unstar' : 'Star'}>
                    <IconButton
                      size="small"
                      onClick={() => onToggleStar(row.id)}
                      aria-label={row.starred ? 'Unstar' : 'Star'}
                      sx={(t) => ({
                        width: 24, height: 24, p: 0,
                        color: row.starred ? t.palette.warning.main : t.palette.grey[300],
                        transition: t.motion.short,
                        '&:hover': { bgcolor: t.fill.default, color: t.palette.warning.main },
                      })}
                    >
                      <Star size={15} fill={row.starred ? 'currentColor' : 'none'} />
                    </IconButton>
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
                      ...t.typography.body2,
                    })}>
                      {row.name}
                    </Box>
                    {row.badge === 'Updated' && (
                      <Box sx={(t) => ({
                        display: 'inline-flex', px: 2, py: 1,
                        borderRadius: `${t.radius.sm}px`,
                        bgcolor: 'warning.main', color: 'common.white',
                        ...t.typography.caption,
                        fontWeight: t.typography.fontWeightBold,
                        letterSpacing: t.typography.overline.letterSpacing,
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      })}>
                        Updated
                      </Box>
                    )}
                    {(row.badge === 'E' || row.badge === 'F') && (
                      <Tooltip title={row.badge === 'E' ? 'External' : 'Featured'}>
                        <Box sx={(t) => ({
                          width: 20, height: 20,
                          borderRadius: `${t.radius.sm}px`,
                          bgcolor: t.fill.emphasis,
                          color: 'text.secondary',
                          ...t.typography.caption,
                          fontWeight: t.typography.fontWeightBold,
                          display: 'grid', placeItems: 'center',
                          textTransform: 'uppercase', cursor: 'default',
                        })}>
                          {row.badge}
                        </Box>
                      </Tooltip>
                    )}
                    {row.comments && (
                      <Box sx={(t) => ({
                        display: 'inline-grid', placeItems: 'center',
                        minWidth: 18, height: 18, px: 1,
                        borderRadius: `${t.radius.pill}px`,
                        bgcolor: 'warning.main', color: 'common.white',
                        ...t.typography.caption,
                        fontWeight: t.typography.fontWeightBold,
                      })}>
                        {row.comments}
                      </Box>
                    )}
                  </Box>
                </Box>
                {/* Owner */}
                <Box component="td" sx={(t) => ({ width: 120, px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.people}</Typography>
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
                      ...t.typography.caption,
                      fontWeight: t.typography.fontWeightBold,
                      letterSpacing: t.typography.overline.letterSpacing,
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
                  <IconButton
                    size="small"
                    aria-label="More actions"
                    sx={(t) => ({
                      width: 28, height: 28,
                      borderRadius: `${t.radius.md}px`,
                      color: 'text.disabled',
                      opacity: 0,
                      transition: t.motion.short,
                      'tr:hover &': { opacity: 1 },
                      '&:hover': { bgcolor: t.fill.default, color: 'text.primary' },
                    })}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          {rows.length === 0 && (
            <Box component="tr">
              <Box component="td" colSpan={8} sx={{ py: 11, textAlign: 'center' }}>
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
              px: 1, py: 0,
              ...t.typography.caption,
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
  const theme = useTheme();
  const seed = row.id * 9301 + 49297;
  const r = (i: number) => ((seed * (i + 1)) % 233) / 233;
  const accentAlt = r(4) > 0.5 ? theme.palette.success.dark : theme.palette.secondary.main;
  return (
    <Box sx={(t) => ({
      aspectRatio: '4 / 3',
      bgcolor: 'surface.subtle',
      borderBottom: `1px solid ${t.border.subtle}`,
      position: 'relative', overflow: 'hidden',
    })}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="150" fill={theme.palette.grey[100]} />
        <rect x="10" y="10" width="180" height="18" rx="3" fill={theme.palette.primary.dark} opacity="0.85" />
        <rect x="20" y="16" width="60" height="6" rx="2" fill={theme.palette.common.white} opacity="0.9" />
        <rect x={20 + r(1) * 80} y="40" width="80" height="24" rx="3" fill={theme.palette.grey[300]} />
        <rect x={40 + r(2) * 60} y="72" width="100" height="24" rx="3" fill={theme.palette.grey[200]} />
        <rect x={30 + r(3) * 70} y="104" width="90" height="24" rx="3" fill={accentAlt} opacity="0.75" />
        <path d={`M60 64 L${60 + r(5) * 40} ${96 - r(6) * 20}`} stroke={theme.palette.grey[400]} strokeWidth="1.5" fill="none" />
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
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 4,
    }}>
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
              boxShadow: isSelected ? t.elevation.low : 'none',
              '&:hover': { borderColor: isSelected ? t.palette.primary.main : t.border.strong, boxShadow: t.elevation.low },
              '&:hover .cs-grid-overlay': { opacity: 1, pointerEvents: 'auto' },
              '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
            })}
          >
            <GridThumb row={row} />
            {/* Checkbox overlay */}
            <Box
              className="cs-grid-overlay"
              onClick={(e) => e.stopPropagation()}
              sx={(t) => ({
                position: 'absolute', top: 2, left: 2,
                p: 1,
                opacity: isSelected ? 1 : 0,
                transition: t.motion.short,
                pointerEvents: isSelected ? 'auto' : 'none',
              })}
            >
              <Checkbox
                size="small"
                checked={isSelected}
                onChange={() => onToggleRow(row.id)}
                onClick={(e) => e.stopPropagation()}
                sx={{ p: 0, width: 16, height: 16 }}
              />
            </Box>
            {/* Star overlay */}
            <IconButton
              className="cs-grid-overlay"
              size="small"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleStar(row.id); }}
              aria-label={row.starred ? 'Unstar' : 'Star'}
              sx={(t) => ({
                position: 'absolute', top: 2, right: 2,
                width: 28, height: 28,
                borderRadius: `${t.radius.md}px`,
                bgcolor: t.surface.canvas,
                color: row.starred ? t.palette.warning.main : t.palette.grey[400],
                boxShadow: t.elevation.low,
                opacity: row.starred ? 1 : 0,
                transition: t.motion.short,
                pointerEvents: row.starred ? 'auto' : 'none',
                '&:hover': { color: t.palette.warning.main },
              })}
            >
              <Star size={14} fill={row.starred ? 'currentColor' : 'none'} />
            </IconButton>
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

  const labelColTh = (t: Theme) => ({
    ...t.typography.overline,
    fontWeight: t.typography.fontWeightBold,
    color: t.palette.text.disabled,
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
  });

  return (
    <Box sx={(t) => ({
      bgcolor: t.surface.canvas,
      border: `1px solid ${t.border.subtle}`,
      borderRadius: `${t.radius.lg}px`,
      overflow: 'hidden',
    })}>
      <Box component="table" sx={{ width: '100%', minWidth: 1000, borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
        <Box component="colgroup">
          <Box component="col" sx={{ width: '44px' }} />
          <Box component="col" sx={{ width: '36px' }} />
          <Box component="col" />
          <Box component="col" sx={{ width: '120px' }} />
          <Box component="col" sx={{ width: '140px' }} />
          <Box component="col" sx={{ width: '140px' }} />
          <Box component="col" sx={{ width: '140px' }} />
          <Box component="col" sx={{ width: '44px' }} />
        </Box>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" sx={(t) => ({ ...labelColTh(t), px: 3, py: 2, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
            <Box component="th" sx={(t) => ({ ...labelColTh(t), px: 1, bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
            {([['name', 'Name'], ['', 'Owner'], ['reviewDate', 'Review date'], ['published', 'Published'], ['draftUpdated', 'Draft updated']] as [SortKey | '', string][]).map(([col, label]) => (
              <Box
                key={label}
                component="th"
                onClick={col ? () => onSort(col as SortKey) : undefined}
                sx={(t) => ({
                  ...labelColTh(t), px: 3, py: 2, textAlign: 'left',
                  cursor: col ? 'pointer' : 'default',
                  bgcolor: t.surface.subtle,
                  borderBottom: `1px solid ${t.border.subtle}`,
                  color: col && sortBy === col ? t.palette.primary.main : 'text.disabled',
                  transition: t.motion.short,
                  '&:hover': { color: col && sortBy === col ? t.palette.primary.main : col ? 'text.secondary' : 'text.disabled' },
                })}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  {label}
                  {col && (
                    <Box sx={(t) => ({ display: 'flex', opacity: sortBy === col ? 1 : 0, transition: t.motion.short, transform: sortBy === col && sortDir === 'asc' ? 'rotate(180deg)' : 'none' })}>
                      <ChevronDown size={13} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <Box component="th" sx={(t) => ({ bgcolor: t.surface.subtle, borderBottom: `1px solid ${t.border.subtle}` })} />
          </Box>
        </Box>
        <Box component="tbody">
          {order.map((key) => {
            const grows = groups[key];
            const isCollapsed = !!collapsed[key];
            return (
              <React.Fragment key={key}>
                {/* Group header row */}
                <Box
                  component="tr"
                  onClick={() => setCollapsed((c) => ({ ...c, [key]: !c[key] }))}
                  sx={(t) => ({ cursor: 'pointer', '&:hover td': { bgcolor: t.fill.default } })}
                >
                  <Box component="td" colSpan={8} sx={(t) => ({
                    px: 4, py: 3,
                    bgcolor: t.surface.subtle,
                    borderTop: `1px solid ${t.border.subtle}`,
                    borderBottom: isCollapsed ? 0 : `1px solid ${t.border.subtle}`,
                    transition: t.motion.short,
                  })}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={(t) => ({ display: 'flex', color: 'text.disabled', transition: t.motion.short, transform: isCollapsed ? 'rotate(-90deg)' : 'none' })}>
                        <ChevronDown size={14} />
                      </Box>
                      <Typography variant="overline" sx={(t) => ({ fontWeight: t.typography.fontWeightBold, color: 'text.secondary' })}>
                        {key}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>· {grows.length}</Typography>
                    </Box>
                  </Box>
                </Box>
                {/* Data rows */}
                {!isCollapsed && grows.map((row) => {
                  const isSelected = selection.has(row.id);
                  return (
                    <Box key={row.id} component="tr" sx={(t) => ({
                      transition: t.motion.short,
                      bgcolor: isSelected ? alpha(t.palette.primary.main, 0.06) : 'transparent',
                      '&:hover': { bgcolor: isSelected ? alpha(t.palette.primary.main, 0.10) : t.surface.subtle },
                      '&:last-child td': { borderBottom: 0 },
                    })}>
                      <Box component="td" sx={(t) => ({ px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => onToggleRow(row.id)}
                          slotProps={{ input: { 'aria-label': `Select ${row.name}` } }}
                          sx={{ p: 0, width: 16, height: 16 }}
                        />
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 1, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                        <IconButton
                          size="small"
                          onClick={() => onToggleStar(row.id)}
                          sx={(t) => ({
                            width: 24, height: 24, p: 0,
                            color: row.starred ? t.palette.warning.main : t.palette.grey[300],
                            '&:hover': { bgcolor: t.fill.default, color: t.palette.warning.main },
                          })}
                        >
                          <Star size={15} fill={row.starred ? 'currentColor' : 'none'} />
                        </IconButton>
                      </Box>
                      <Box component="td" sx={(t) => ({ py: 2, px: 3, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', overflow: 'hidden' })}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
                          <TypeIcon type={row.type} size={24} />
                          <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightMedium, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
                            {row.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.people}</Typography>
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                        <Typography variant="body2" sx={{ color: row.reviewDate ? 'text.secondary' : 'text.disabled' }}>{row.reviewDate || '—'}</Typography>
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.publishedState === 'unpublished' ? 'Unpublished' : row.published}</Typography>
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 3, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle', whiteSpace: 'nowrap' })}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.draftUpdated}</Typography>
                      </Box>
                      <Box component="td" sx={(t) => ({ px: 2, py: 2, borderBottom: `1px solid ${t.border.subtle}`, verticalAlign: 'middle' })}>
                        <IconButton
                          size="small"
                          aria-label="More actions"
                          sx={(t) => ({
                            width: 28, height: 28,
                            borderRadius: `${t.radius.md}px`,
                            color: 'text.disabled',
                            opacity: 0,
                            transition: t.motion.short,
                            'tr:hover &': { opacity: 1 },
                            '&:hover': { bgcolor: t.fill.default },
                          })}
                        >
                          <MoreVertical size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
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
  const [confirming, setConfirming] = useState(false);
  React.useEffect(() => { setConfirming(false); }, [count]);
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
      ...t.typography.body2,
      transform: count > 0 ? 'translateY(0)' : 'translateY(8px)',
      opacity: count > 0 ? 1 : 0,
      pointerEvents: count > 0 ? 'auto' : 'none',
      transition: t.motion.standard,
      zIndex: t.zIndex.tooltip,
    })}>
      <Box component="span" sx={(t) => ({ fontWeight: t.typography.fontWeightBold, mr: 2 })}>{count}</Box>
      selected
      <Box sx={(t) => ({ width: 1, height: 20, bgcolor: alpha(t.palette.common.white, 0.16) })} />
      {[
        { icon: <Star size={14} />, label: 'Star', onClick: onStar },
        { icon: <Move size={14} />, label: 'Move', onClick: onMove },
        { icon: <Share2 size={14} />, label: 'Share', onClick: onShare },
      ].map((btn) => (
        <ButtonBase
          key={btn.label}
          onClick={btn.onClick}
          sx={(t) => ({
            display: 'inline-flex', alignItems: 'center', gap: 2,
            height: 30, px: 3,
            color: 'common.white',
            ...t.typography.body2,
            fontWeight: t.typography.fontWeightMedium,
            borderRadius: `${t.radius.md}px`,
            transition: t.motion.short,
            '&:hover': { bgcolor: alpha(t.palette.common.white, 0.1) },
          })}
        >
          {btn.icon} {btn.label}
        </ButtonBase>
      ))}
      {confirming ? (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={(t) => ({ color: t.palette.error.light, fontWeight: t.typography.fontWeightMedium, ...t.typography.body2 })}>
            Delete {count}?
          </Typography>
          <ButtonBase
            onClick={() => { onDelete(); setConfirming(false); }}
            sx={(t) => ({
              display: 'inline-flex', alignItems: 'center', gap: 1,
              height: 28, px: 3,
              border: `1px solid ${alpha(t.palette.error.light, 0.5)}`,
              bgcolor: alpha(t.palette.error.main, 0.4),
              color: t.palette.error.light,
              ...t.typography.body2,
              fontWeight: t.typography.fontWeightSemibold,
              borderRadius: `${t.radius.md}px`,
              transition: t.motion.short,
              '&:hover': { bgcolor: alpha(t.palette.error.main, 0.6) },
            })}
          >
            Confirm
          </ButtonBase>
          <ButtonBase
            onClick={() => setConfirming(false)}
            sx={(t) => ({
              height: 28, px: 3,
              color: alpha(t.palette.common.white, 0.7),
              ...t.typography.body2,
              borderRadius: `${t.radius.md}px`,
              transition: t.motion.short,
              '&:hover': { bgcolor: alpha(t.palette.common.white, 0.1), color: 'common.white' },
            })}
          >
            Cancel
          </ButtonBase>
        </Box>
      ) : (
        <ButtonBase
          onClick={() => setConfirming(true)}
          sx={(t) => ({
            display: 'inline-flex', alignItems: 'center', gap: 2,
            height: 30, px: 3,
            color: 'common.white',
            ...t.typography.body2,
            fontWeight: t.typography.fontWeightMedium,
            borderRadius: `${t.radius.md}px`,
            transition: t.motion.short,
            '&:hover': { bgcolor: alpha(t.palette.error.main, 0.3), color: t.palette.error.light },
          })}
        >
          <Trash2 size={14} /> Delete
        </ButtonBase>
      )}
      <Box sx={(t) => ({ width: 1, height: 20, bgcolor: alpha(t.palette.common.white, 0.16) })} />
      <IconButton
        onClick={onClear}
        title="Clear selection (Esc)"
        size="small"
        sx={(t) => ({
          width: 28, height: 28,
          color: 'common.white',
          borderRadius: `${t.radius.md}px`,
          transition: t.motion.short,
          '&:hover': { bgcolor: alpha(t.palette.common.white, 0.1) },
        })}
      >
        <X size={14} />
      </IconButton>
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
  const [aiDismissed, setAiDismissed] = useState(() => {
    try { return localStorage.getItem('cs_ai_banner_dismissed') === '1'; } catch { return false; }
  });

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
                lineHeight: 1.15,
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
                bgcolor: 'primary.main',
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
                  onClick={() => { try { localStorage.setItem('cs_ai_banner_dismissed', '1'); } catch {} setAiDismissed(true); }}
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
