import { memo, useState } from 'react';
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant,
  useNodesState, useEdgesState, useReactFlow, useStore,
  Handle, Position,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import { alpha } from '@mui/material/styles';
import {
  Undo2, Redo2, Lock, Star, Globe, Calendar,
  UserPlus, Send, Search, MessageSquare, MousePointer2,
  LayoutGrid, Image, Film, HelpCircle, Settings,
  ChevronDown, Plus, SlidersHorizontal, X, Sparkles,
  Paperclip, ZoomIn, ZoomOut, Maximize2, Map, CheckCheck,
} from 'lucide-react';
import { softTint } from '@/theme/recipes';

// ─── Shared icon-button sizes ─────────────────────────────────────────────────

const ICON_BTN_SX = (theme: Parameters<typeof softTint>[0]) => ({
  width: 32,
  height: 32,
  borderRadius: 1,
  color: 'text.secondary',
  transition: theme.motion.short,
  '&:hover': { bgcolor: theme.palette.action.hover, color: 'text.primary' },
  '&[aria-pressed="true"]': {
    bgcolor: theme.palette.action.selected,
    color: 'primary.main',
  },
});

// ─── Canvas node types ────────────────────────────────────────────────────────

type NodeData = { label: string; sublabel?: string };

const EditorActionNode = memo(({ data }: { data: NodeData }) => (
  <Box sx={(theme) => ({
    bgcolor: theme.surface.canvas,
    border: `1px solid ${theme.border.default}`,
    borderRadius: (t) => t.radius.md / t.shape.borderRadius,
    overflow: 'hidden',
    minWidth: 260,
    boxShadow: (t) => t.elevation.low,
    ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
  })}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    {data.sublabel ? (
      <>
        <Box sx={(theme) => ({
          bgcolor: theme.palette.primary.main,
          px: 3, py: 1,
        })}>
          <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 'fontWeightSemibold' }}>
            {data.label}
          </Typography>
        </Box>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary">{data.sublabel}</Typography>
        </Box>
      </>
    ) : (
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>{data.label}</Typography>
      </Box>
    )}
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
  </Box>
));
EditorActionNode.displayName = 'EditorActionNode';

const EditorDecisionNode = memo(({ data }: { data: NodeData }) => (
  <Box sx={(theme) => ({
    bgcolor: theme.surface.canvas,
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: (t) => t.radius.md / t.shape.borderRadius,
    px: 3, py: 2,
    minWidth: 200,
    textAlign: 'center',
    boxShadow: (t) => t.elevation.low,
    ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
  })}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
    <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold', color: 'primary.main' }}>
      {data.label}
    </Typography>
  </Box>
));
EditorDecisionNode.displayName = 'EditorDecisionNode';

const EditorStartNode = memo(({ data }: { data: NodeData }) => (
  <Box sx={(theme) => ({
    bgcolor: theme.surface.canvas,
    border: `1px solid ${theme.border.default}`,
    borderRadius: (t) => t.radius.pill,
    px: 4, py: 2,
    minWidth: 200,
    textAlign: 'center',
    boxShadow: (t) => t.elevation.low,
    ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
  })}>
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>{data.label}</Typography>
  </Box>
));
EditorStartNode.displayName = 'EditorStartNode';

const EditorStatusNode = memo(({ data }: { data: NodeData & { intent: 'success' | 'warning' | 'info' } }) => (
  <Box sx={(theme) => ({
    ...softTint(theme, data.intent),
    border: `1px solid ${alpha(theme.palette[data.intent].main, 0.2)}`,
    borderRadius: (t) => t.radius.md / t.shape.borderRadius,
    px: 3, py: 2,
    minWidth: 160,
    textAlign: 'center',
  })}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <Typography variant="caption" sx={{ fontWeight: 'fontWeightSemibold' }}>{data.label}</Typography>
  </Box>
));
EditorStatusNode.displayName = 'EditorStatusNode';

const NODE_TYPES = {
  actionNode: EditorActionNode as never,
  decisionNode: EditorDecisionNode as never,
  startNode: EditorStartNode as never,
  statusNode: EditorStatusNode as never,
};

// ─── Flow data ────────────────────────────────────────────────────────────────

const edgeStyle: React.CSSProperties = {
  stroke: 'var(--mui-palette-grey-400)',
  strokeWidth: 1.5,
};

const labelStyle: React.CSSProperties = {
  fill: 'var(--mui-palette-text-secondary)',
  fontFamily: 'Inter, sans-serif',
  fontSize: 11,
  fontWeight: 600,
};

const labelBgStyle: React.CSSProperties = {
  fill: 'var(--mui-palette-background-default)',
  fillOpacity: 0.9,
};

const INITIAL_NODES: Node<NodeData>[] = [
  { id: 'start',    type: 'startNode',    position: { x: 320, y:  40 }, data: { label: 'Start: Patient intake' } },
  { id: 'assess',   type: 'actionNode',   position: { x: 300, y: 140 }, data: { label: 'Initial Assessment', sublabel: 'Capture vitals and primary complaint' } },
  { id: 'decision', type: 'decisionNode', position: { x: 305, y: 268 }, data: { label: 'Severity ≥ moderate?' } },
  { id: 'urgent',   type: 'statusNode',   position: { x: 120, y: 390 }, data: { label: 'Urgent referral', intent: 'warning' } as never },
  { id: 'monitor',  type: 'statusNode',   position: { x: 440, y: 390 }, data: { label: 'Standard monitoring', intent: 'info' } as never },
  { id: 'treat',    type: 'actionNode',   position: { x: 300, y: 490 }, data: { label: 'Treatment Protocol', sublabel: 'Administer broad-spectrum therapy' } },
];

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'start',    target: 'assess',   type: 'smoothstep', style: edgeStyle },
  { id: 'e2', source: 'assess',   target: 'decision', type: 'smoothstep', style: edgeStyle },
  { id: 'e3', source: 'decision', target: 'urgent',   type: 'smoothstep', style: edgeStyle, label: 'YES', labelStyle, labelBgStyle, labelBgPadding: [4, 2] as [number, number], labelBgBorderRadius: 4 },
  { id: 'e4', source: 'decision', target: 'monitor',  type: 'smoothstep', style: edgeStyle, label: 'NO',  labelStyle, labelBgStyle, labelBgPadding: [4, 2] as [number, number], labelBgBorderRadius: 4 },
  { id: 'e5', source: 'urgent',   target: 'treat',    type: 'smoothstep', style: edgeStyle },
  { id: 'e6', source: 'monitor',  target: 'treat',    type: 'smoothstep', style: edgeStyle },
];

// ─── Shape data ───────────────────────────────────────────────────────────────

type ShapeItem = { id: string; label: string; tip: string; glyph: React.ReactNode };
type ShapeSubgroup = { label: string; items: ShapeItem[] };
type ShapeSection = {
  id: string;
  label: string;
  priority?: boolean;
  subgroups?: ShapeSubgroup[];
  items?: ShapeItem[];
};

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: 32, height: 28, color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </Box>
  );
}

const SHAPES: ShapeSection[] = [
  {
    id: 'in-use', label: 'Shapes in use', priority: true,
    items: [
      { id: 'checklist', label: 'Checklist', tip: 'Checklist node', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="1" y="3" width="38" height="24" rx="3"/><path d="M6 10h3M12 10h20M6 15h3M12 15h16M6 20h3M12 20h14"/></svg></Glyph> },
      { id: 'rect',      label: 'Rectangle', tip: 'Rectangle',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="3"/></svg></Glyph> },
      { id: 'rounded',   label: 'Rounded',   tip: 'Rounded',    glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="9"/></svg></Glyph> },
    ],
  },
  {
    id: 'standard', label: 'Standard',
    subgroups: [
      {
        label: 'Content',
        items: [
          { id: 'text',    label: 'Text',      tip: 'Text node',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M10 8h20M20 8v16M15 24h10"/></svg></Glyph> },
          { id: 'cl2',     label: 'Checklist', tip: 'Checklist',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="6" y="6" width="5" height="5" rx="1"/><path d="M13 9h20M6 16h28M6 22h22"/></svg></Glyph> },
          { id: 'doc',     label: 'Document',  tip: 'Document',   glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M8 4h18l6 6v16H8z"/><path d="M26 4v6h6M12 14h16M12 19h16"/></svg></Glyph> },
          { id: 'rich',    label: 'Rich text', tip: 'Rich text',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="4" width="36" height="22" rx="2"/><path d="M7 11h4M7 16h20M7 20h14"/></svg></Glyph> },
        ],
      },
      {
        label: 'Containers',
        items: [
          { id: 'rect2',   label: 'Rectangle', tip: 'Rectangle',      glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="2"/></svg></Glyph> },
          { id: 'header',  label: 'Header',    tip: 'Header block',   glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="2"/><rect x="2" y="6" width="36" height="6" rx="2" fill="currentColor" fillOpacity="0.2"/></svg></Glyph> },
          { id: 'filled',  label: 'Filled',    tip: 'Filled container', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="2" fill="currentColor" fillOpacity="0.12"/></svg></Glyph> },
          { id: 'dashed',  label: 'Dashed',    tip: 'Dashed container', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" style={{ width: '100%', height: '100%' }}><rect x="2" y="6" width="36" height="18" rx="2"/></svg></Glyph> },
          { id: 'hex',     label: 'Hexagon',   tip: 'Hexagon',        glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M20 4l14 8v6l-14 8-14-8v-6z"/></svg></Glyph> },
        ],
      },
      {
        label: 'Utility',
        items: [
          { id: 'link',    label: 'Link',      tip: 'Link node',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M14 15a5 5 0 0 1 5-5h3M26 15a5 5 0 0 1-5 5h-3M16 15h8"/></svg></Glyph> },
          { id: 'warn',    label: 'Warning',   tip: 'Warning node', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M20 5l16 22H4z"/><path d="M20 14v6M20 23v1"/></svg></Glyph> },
          { id: 'video',   label: 'Video',     tip: 'Video embed', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="5" width="28" height="20" rx="2"/><polygon points="32 10 38 7 38 23 32 20" fill="currentColor" fillOpacity="0.2"/></svg></Glyph> },
          { id: 'calc',    label: 'Calculator', tip: 'Calculator', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="8" y="3" width="24" height="24" rx="2"/><path d="M12 9h16M12 15h4M19 15h4M26 15h2M12 21h4M19 21h4M26 21h2"/></svg></Glyph> },
          { id: 'divider', label: 'Divider',   tip: 'Divider',    glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><line x1="4" y1="15" x2="36" y2="15"/></svg></Glyph> },
        ],
      },
    ],
  },
  {
    id: 'flowchart', label: 'Flowchart',
    items: [
      { id: 'term',    label: 'End',      tip: 'Terminator',  glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><ellipse cx="20" cy="15" rx="16" ry="9"/></svg></Glyph> },
      { id: 'dec',     label: 'Decision', tip: 'Decision',    glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M20 4l16 11-16 11L4 15z"/></svg></Glyph> },
      { id: 'proc',    label: 'Process',  tip: 'Process',     glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="4" y="7" width="32" height="16" rx="1"/></svg></Glyph> },
      { id: 'inp',     label: 'Input',    tip: 'Input',       glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M8 7h28l-4 16H4z"/></svg></Glyph> },
      { id: 'arrow',   label: 'Arrow',    tip: 'Arrow right', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M4 10h18V5l14 10-14 10v-5H4z"/></svg></Glyph> },
      { id: 'start2',  label: 'Start',    tip: 'Start',       glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><path d="M8 23h24L28 7H12z"/></svg></Glyph> },
    ],
  },
  {
    id: 'tables', label: 'Tables',
    items: [
      { id: '2col',  label: '2 col',  tip: '2-column table', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="5" width="36" height="20" rx="1"/><line x1="20" y1="5" x2="20" y2="25"/></svg></Glyph> },
      { id: '3col',  label: '3 col',  tip: '3-column table', glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="5" width="36" height="20" rx="1"/><line x1="14" y1="5" x2="14" y2="25"/><line x1="26" y1="5" x2="26" y2="25"/></svg></Glyph> },
      { id: 'grid',  label: 'Grid',   tip: 'Grid table',    glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="5" width="36" height="20" rx="1"/><line x1="20" y1="5" x2="20" y2="25"/><line x1="2" y1="15" x2="38" y2="15"/></svg></Glyph> },
      { id: 'dense', label: 'Dense',  tip: 'Dense grid',    glyph: <Glyph><svg viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}><rect x="2" y="5" width="36" height="20" rx="1"/><line x1="14" y1="5" x2="14" y2="25"/><line x1="26" y1="5" x2="26" y2="25"/><line x1="2" y1="15" x2="38" y2="15"/></svg></Glyph> },
    ],
  },
];

// ─── Shape cell ───────────────────────────────────────────────────────────────

function ShapeCell({ item }: { item: ShapeItem }) {
  return (
    <Tooltip title={item.tip} placement="top">
      <Box
        role="button"
        tabIndex={0}
        aria-label={item.tip}
        sx={(theme) => ({
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          py: 2, px: 1,
          borderRadius: 1,
          cursor: 'grab',
          transition: theme.motion.short,
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity * 2) },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        })}
      >
        {item.glyph}
        <Typography variant="caption" sx={{ fontSize: 9.5, color: 'text.muted', textAlign: 'center', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
          {item.label}
        </Typography>
      </Box>
    </Tooltip>
  );
}

// ─── Status chips in shapes panel ────────────────────────────────────────────

const STATUS_CHIPS = [
  { tip: 'Info',    intent: 'info'    as const },
  { tip: 'Warning', intent: 'warning' as const },
  { tip: 'Success', intent: 'success' as const },
  { tip: 'Error',   intent: 'error'   as const },
];

// ─── Shape section ────────────────────────────────────────────────────────────

function ShapeSection({ section }: { section: ShapeSection }) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={(theme) => ({
      border: `1px solid ${theme.border.subtle}`,
      borderRadius: (t) => t.radius.md / t.shape.borderRadius,
      bgcolor: theme.surface.canvas,
      overflow: 'hidden',
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
    })}>
      {/* Section header */}
      <Box
        component="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        sx={{
          width: '100%', border: 0, background: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 3,
          color: 'inherit',
        }}
      >
        <Typography
          variant={section.priority ? 'subtitle2' : 'overline'}
          color={section.priority ? 'text.primary' : 'text.muted'}
          sx={section.priority ? { fontWeight: 'fontWeightSemibold' } : undefined}
        >
          {section.label}
        </Typography>
        <Box sx={(theme) => ({
          color: 'text.muted',
          transition: theme.motion.short,
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          display: 'flex',
        })}>
          <ChevronDown size={14} aria-hidden="true" />
        </Box>
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 3, pb: 3 }}>
          {/* Section with subgroups */}
          {section.subgroups?.map((sg, i) => (
            <Box key={sg.label} sx={i > 0 ? (theme) => ({ borderTop: `1px dashed ${theme.border.subtle}`, pt: 3, mt: 3 }) : undefined}>
              <Typography variant="overline" color="text.muted" sx={{ display: 'block', mb: 2, fontSize: 9 }}>
                {sg.label}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                {sg.items.map((item) => <ShapeCell key={item.id} item={item} />)}
              </Box>
            </Box>
          ))}

          {/* Status section */}
          {section.id === 'in-use' && section.items && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
              {section.items.map((item) => <ShapeCell key={item.id} item={item} />)}
            </Box>
          )}

          {/* Flat items */}
          {section.id !== 'in-use' && section.items && (
            <>
              {section.id === 'statuses' ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
                  {STATUS_CHIPS.map((chip) => (
                    <Tooltip key={chip.tip} title={chip.tip} placement="top">
                      <Box
                        role="button"
                        tabIndex={0}
                        aria-label={chip.tip}
                        sx={(theme) => ({
                          height: 22,
                          borderRadius: 1,
                          border: `1px solid ${theme.border.strong}`,
                          cursor: 'grab',
                          ...softTint(theme, chip.intent),
                        })}
                      />
                    </Tooltip>
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                  {section.items.map((item) => <ShapeCell key={item.id} item={item} />)}
                </Box>
              )}
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

// ─── Shapes panel ─────────────────────────────────────────────────────────────

function ShapesPanel() {
  return (
    <Box sx={(theme) => ({
      width: 280,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.surface.canvas,
      borderRight: `1px solid ${theme.border.default}`,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
    })}>
      {/* Search */}
      <Box sx={(theme) => ({
        px: 4, py: 3,
        borderBottom: `1px solid ${theme.border.subtle}`,
        display: 'flex', gap: 2, alignItems: 'center',
        flexShrink: 0,
      })}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search shapes…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={14} aria-hidden="true" />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiInputBase-root': { height: 34, fontSize: 13 } }}
        />
        <Tooltip title="Filter shapes">
          <IconButton size="small" aria-label="Filter shapes" sx={(theme) => ICON_BTN_SX(theme)}>
            <SlidersHorizontal size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SHAPES.map((s) => <ShapeSection key={s.id} section={s} />)}
      </Box>

      {/* Footer */}
      <Box sx={(theme) => ({
        px: 4, py: 3,
        borderTop: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
      })}>
        <Box
          component="button"
          sx={(theme) => ({
            width: '100%', height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
            border: `1px dashed ${theme.border.strong}`,
            borderRadius: (t) => t.radius.md / t.shape.borderRadius,
            bgcolor: theme.surface.subtle,
            color: 'text.secondary',
            fontSize: 13,
            fontWeight: 'fontWeightMedium' as never,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: theme.motion.short,
            '&:hover': { color: 'primary.main', borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity * 2) },
          })}
        >
          <Plus size={14} aria-hidden="true" />
          <span>Shape library</span>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Left rail ────────────────────────────────────────────────────────────────

const RAIL_ITEMS = [
  { id: 'shapes', icon: LayoutGrid, label: 'Shapes' },
  { id: 'images', icon: Image,      label: 'Images' },
  { id: 'videos', icon: Film,       label: 'Videos' },
  { id: 'quizzes', icon: HelpCircle, label: 'Quizzes' },
] as const;

function LeftRail({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <Box
      component="nav"
      aria-label="Editor sections"
      sx={(theme) => ({
        width: 72,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        py: 4,
        px: 2,
        bgcolor: theme.surface.subtle,
        borderRight: `1px solid ${theme.border.default}`,
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
      })}
    >
      {RAIL_ITEMS.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        return (
          <Box
            key={id}
            component="button"
            onClick={() => onSelect(id)}
            aria-current={isActive ? 'page' : undefined}
            sx={(theme) => ({
              position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              py: 3, px: 1,
              borderRadius: (t) => t.radius.md / t.shape.borderRadius,
              border: 0,
              background: 'none',
              cursor: 'pointer',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              bgcolor: isActive ? theme.palette.action.selected : 'transparent',
              fontSize: 11,
              fontWeight: theme.typography.fontWeightMedium,
              fontFamily: 'inherit',
              transition: theme.motion.short,
              '&:hover': {
                bgcolor: isActive ? theme.palette.action.selected : theme.palette.action.hover,
                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              },
              ...(isActive && {
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0, top: 10, bottom: 10,
                  width: 3,
                  bgcolor: 'primary.main',
                  borderRadius: '0 2px 2px 0',
                },
              }),
            })}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </Box>
        );
      })}

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Settings at bottom */}
      <Box
        component="button"
        aria-label="Editor settings"
        sx={(theme) => ({
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          py: 3, px: 1,
          borderRadius: (t) => t.radius.md / t.shape.borderRadius,
          border: 0,
          background: 'none',
          cursor: 'pointer',
          color: theme.palette.text.secondary,
          fontSize: 11,
          fontWeight: theme.typography.fontWeightMedium,
          fontFamily: 'inherit',
          transition: theme.motion.short,
          '&:hover': { bgcolor: theme.palette.action.hover, color: theme.palette.text.primary },
        })}
      >
        <Settings size={20} aria-hidden="true" />
        <span>Settings</span>
      </Box>
    </Box>
  );
}

// ─── AI panel ─────────────────────────────────────────────────────────────────

const AI_MESSAGES = [
  {
    role: 'assistant' as const,
    text: 'Hi! I can help you improve this pathway. I notice you have 6 nodes — would you like me to suggest optimisations for clarity or flow?',
    suggestions: [
      'Suggest missing decision branches',
      'Check for clinical guideline compliance',
      'Simplify the pathway structure',
    ],
  },
  { role: 'user' as const, text: 'Check for clinical guideline compliance.' },
  { role: 'assistant' as const, text: 'Based on Surviving Sepsis Campaign guidelines, your pathway is missing a lactate measurement step after initial assessment. I recommend adding it before the severity decision node.' },
];

function AIPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');

  return (
    <Box sx={(theme) => ({
      position: 'absolute',
      right: theme.spacing(5),
      bottom: 68,
      width: 360,
      height: 500,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.surface.canvas,
      border: `1px solid ${theme.border.default}`,
      borderRadius: (t) => t.radius.lg / t.shape.borderRadius,
      boxShadow: (t) => t.elevation.high,
      zIndex: (t) => t.zIndex.tooltip - 1,
      overflow: 'hidden',
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[850 as never] ?? theme.palette.grey[900] }),
    })}>
      {/* Header */}
      <Box sx={(theme) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 4, py: 3,
        bgcolor: theme.surface.subtle,
        borderBottom: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
      })}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Sparkles size={18} aria-hidden="true" color="var(--mui-palette-primary-main)" />
            <Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightSemibold' }}>
              AI Assistant
            </Typography>
            <Box sx={(theme) => ({
              ...softTint(theme, 'info'),
              px: 1.5, py: 0.5,
              borderRadius: 1,
              fontSize: 9,
              fontWeight: 'fontWeightBold' as never,
              letterSpacing: '0.04em',
            })}>
              BETA
            </Box>
          </Box>
          <Typography variant="caption" color="text.muted">Pathway intelligence</Typography>
        </Box>
        <Tooltip title="Close assistant">
          <IconButton size="small" onClick={onClose} aria-label="Close AI assistant">
            <X size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {AI_MESSAGES.map((msg, i) => (
          <Box key={i} sx={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <Box sx={(theme) => ({
              px: 3, py: 2,
              borderRadius: (t) => t.radius.md / t.shape.borderRadius,
              fontSize: 13,
              lineHeight: 1.45,
              ...(msg.role === 'assistant'
                ? {
                    bgcolor: theme.surface.subtle,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.border.subtle}`,
                    ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
                  }
                : {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }),
            })}>
              <Typography variant="body2" sx={{ color: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}>
                {msg.text}
              </Typography>
            </Box>
            {msg.role === 'assistant' && 'suggestions' in msg && msg.suggestions && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {msg.suggestions.map((s) => (
                  <Box
                    key={s}
                    component="button"
                    sx={(theme) => ({
                      textAlign: 'left',
                      px: 3, py: 2,
                      border: `1px solid ${theme.border.default}`,
                      borderRadius: (t) => t.radius.md / t.shape.borderRadius,
                      bgcolor: theme.surface.canvas,
                      color: theme.palette.text.secondary,
                      fontSize: 12,
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: theme.motion.short,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity * 2),
                      },
                      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
                    })}
                  >
                    {s}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box sx={(theme) => ({
        borderTop: `1px solid ${theme.border.subtle}`,
        px: 3, py: 3,
        flexShrink: 0,
      })}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask anything about this pathway…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setInput(''); } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Send message"
                  disabled={!input.trim()}
                  sx={(theme) => ({
                    color: input.trim() ? theme.palette.primary.main : 'text.disabled',
                  })}
                >
                  <Send size={14} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

// ─── Bottom toolbar controls (need ReactFlow context) ─────────────────────────

function ZoomDisplay() {
  const zoom = useStore((s) => s.transform[2]);
  return (
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 36, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
      {Math.round(zoom * 100)}%
    </Typography>
  );
}

function BottomToolbar({ aiOpen, onToggleAI }: { aiOpen: boolean; onToggleAI: () => void }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const iconBtnBase = (theme: Parameters<typeof softTint>[0]) => ({
    width: 32, height: 32,
    borderRadius: 1,
    color: 'text.secondary',
    transition: theme.motion.short,
    '&:hover': { bgcolor: theme.palette.action.hover, color: 'text.primary' },
  });

  const Separator = () => (
    <Box sx={(theme) => ({ width: 1, height: 20, bgcolor: theme.border.subtle, mx: 1, flexShrink: 0 })} />
  );

  return (
    <Box sx={(theme) => ({
      position: 'absolute',
      bottom: theme.spacing(4),
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 1,
      bgcolor: theme.surface.canvas,
      border: `1px solid ${theme.border.default}`,
      borderRadius: (t) => t.radius.md / t.shape.borderRadius,
      boxShadow: (t) => t.elevation.low,
      zIndex: 5,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
    })}>
      {/* Group 1: Attach */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
        <Tooltip title="Attach content to selected node" placement="top">
          <IconButton size="small" aria-label="Attach content" sx={(theme) => iconBtnBase(theme)}>
            <Paperclip size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      <Separator />

      {/* Group 2: Canvas navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, gap: 0.5 }}>
        <Tooltip title="Zoom to start" placement="top">
          <IconButton size="small" aria-label="Zoom to start" sx={(theme) => iconBtnBase(theme)}>
            <MousePointer2 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom to fit" placement="top">
          <IconButton size="small" aria-label="Zoom to fit" onClick={() => fitView({ padding: 0.15 })} sx={(theme) => iconBtnBase(theme)}>
            <Maximize2 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle minimap" placement="top">
          <IconButton size="small" aria-label="Toggle minimap" sx={(theme) => iconBtnBase(theme)}>
            <Map size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      <Separator />

      {/* Group 3: Zoom */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, gap: 0.5 }}>
        <Tooltip title="Zoom out" placement="top">
          <IconButton size="small" aria-label="Zoom out" onClick={() => zoomOut()} sx={(theme) => iconBtnBase(theme)}>
            <ZoomOut size={14} />
          </IconButton>
        </Tooltip>
        <ZoomDisplay />
        <Tooltip title="Zoom in" placement="top">
          <IconButton size="small" aria-label="Zoom in" onClick={() => zoomIn()} sx={(theme) => iconBtnBase(theme)}>
            <ZoomIn size={14} />
          </IconButton>
        </Tooltip>
      </Box>

      <Separator />

      {/* Group 4: AI assistant */}
      <Box sx={{ px: 1 }}>
        <Button
          onClick={onToggleAI}
          aria-pressed={aiOpen}
          sx={(theme) => ({
            height: 32,
            px: 3,
            borderRadius: (t) => t.radius.pill,
            gap: 2,
            ...softTint(theme, 'primary'),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            fontWeight: 'fontWeightSemibold' as never,
            fontSize: 12,
            minWidth: 0,
            textTransform: 'none',
            transition: theme.motion.short,
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.14) },
          })}
        >
          <Sparkles size={14} aria-hidden="true" />
          AI Assistant
        </Button>
      </Box>
    </Box>
  );
}

// ─── Canvas area (includes ReactFlow + floating overlays) ─────────────────────

function CanvasContent({ aiOpen, onToggleAI }: { aiOpen: boolean; onToggleAI: () => void }) {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INITIAL_EDGES);

  return (
    <Box sx={(theme) => ({
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      bgcolor: theme.surface.subtle,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
    })}>
      {/* Draft watermark */}
      <Box sx={{
        position: 'absolute',
        top: theme => theme.spacing(5),
        right: theme => theme.spacing(6),
        fontSize: 48,
        fontWeight: 'fontWeightBold',
        color: (theme) => alpha(theme.palette.text.primary, 0.05),
        letterSpacing: '-0.03em',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
        lineHeight: 1,
      }}>
        Draft
      </Box>

      {/* Floating canvas header toolbar */}
      <Box sx={(theme) => ({
        position: 'absolute',
        top: theme.spacing(4),
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1, py: 1,
        bgcolor: theme.surface.canvas,
        border: `1px solid ${theme.border.default}`,
        borderRadius: (t) => t.radius.pill,
        boxShadow: (t) => t.elevation.low,
        zIndex: 5,
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
      })}>
        <Tooltip title="Select tool" placement="bottom">
          <IconButton size="small" aria-label="Select tool" aria-pressed="true" sx={(theme) => ({
            width: 32, height: 32,
            borderRadius: (t) => t.radius.pill,
            bgcolor: theme.palette.action.selected,
            color: 'primary.main',
            transition: theme.motion.short,
            '&:hover': { bgcolor: theme.palette.action.selected },
          })}>
            <MousePointer2 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Connector tool" placement="bottom">
          <IconButton size="small" aria-label="Connector tool" sx={(theme) => ({
            width: 32, height: 32,
            borderRadius: (t) => t.radius.pill,
            color: 'text.secondary',
            transition: theme.motion.short,
            '&:hover': { bgcolor: theme.palette.action.hover, color: 'text.primary' },
          })}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20c6-16 12 0 16-8"/><path d="M18 10l2 2-4 2"/>
            </svg>
          </IconButton>
        </Tooltip>
        <Box sx={(theme) => ({ width: 1, height: 20, bgcolor: theme.border.subtle, mx: 1 })} />
        <Tooltip title="Show grid" placement="bottom">
          <IconButton size="small" aria-label="Show grid" aria-pressed="true" sx={(theme) => ({
            width: 32, height: 32,
            borderRadius: (t) => t.radius.pill,
            bgcolor: theme.palette.action.selected,
            color: 'primary.main',
            transition: theme.motion.short,
            '&:hover': { bgcolor: theme.palette.action.selected },
          })}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
            </svg>
          </IconButton>
        </Tooltip>
      </Box>

      {/* ReactFlow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--mui-palette-grey-300)"
        />
      </ReactFlow>

      {/* Bottom floating toolbar */}
      <BottomToolbar aiOpen={aiOpen} onToggleAI={onToggleAI} />

      {/* AI panel */}
      {aiOpen && <AIPanel onClose={onToggleAI} />}
    </Box>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TbDivider() {
  return <Box sx={(theme) => ({ width: 1, height: 24, bgcolor: theme.border.subtle, mx: 1, flexShrink: 0 })} />;
}

function EditorTopBar() {
  const [locked, setLocked] = useState(false);
  const [starred, setStarred] = useState(false);

  return (
    <Box sx={(theme) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      px: 5,
      height: 56,
      flexShrink: 0,
      bgcolor: theme.surface.canvas,
      borderBottom: `1px solid ${theme.border.default}`,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900], borderColor: theme.palette.grey[700] }),
    })}>
      {/* Logo */}
      <Box sx={{
        width: 32, height: 32,
        borderRadius: (t) => t.radius.md / t.shape.borderRadius,
        bgcolor: 'primary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Typography sx={{ color: 'common.white', fontWeight: 'fontWeightBold', fontSize: 14, lineHeight: 1 }}>
          C
        </Typography>
      </Box>

      {/* Pathway name + mode chip */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Switch pathway" placement="bottom">
          <Box
            component="button"
            sx={(theme) => ({
              display: 'inline-flex', alignItems: 'center', gap: 2,
              px: 3, py: 2,
              border: 0,
              background: 'none',
              cursor: 'pointer',
              borderRadius: (t) => t.radius.md / t.shape.borderRadius,
              color: theme.palette.text.primary,
              fontWeight: 'fontWeightSemibold' as never,
              fontSize: 14,
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: theme.motion.short,
              '&:hover': { bgcolor: theme.palette.action.hover },
            })}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
            <span>Test Pathway</span>
            <ChevronDown size={12} aria-hidden="true" color="var(--mui-palette-text-disabled)" />
          </Box>
        </Tooltip>

        <Tooltip title="Change editing mode" placement="bottom">
          <Box
            component="button"
            sx={(theme) => ({
              display: 'inline-flex', alignItems: 'center', gap: 2,
              px: 3, py: 2,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
              borderRadius: (t) => t.radius.pill,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: theme.motion.short,
              ...softTint(theme, 'warning'),
              '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.14) },
            })}
          >
            <Box sx={(theme) => ({
              width: 6, height: 6,
              borderRadius: '50%',
              bgcolor: theme.palette.warning.main,
              flexShrink: 0,
            })} />
            <Typography variant="caption" sx={{ fontWeight: 'fontWeightSemibold', color: 'warning.dark' }}>
              Editing
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.muted', fontSize: 11 }}>
              v0.0.2
            </Typography>
            <ChevronDown size={10} aria-hidden="true" />
          </Box>
        </Tooltip>
      </Box>

      <TbDivider />

      {/* Undo / Redo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Undo" placement="bottom">
          <IconButton size="small" aria-label="Undo" sx={(theme) => ICON_BTN_SX(theme)}>
            <Undo2 size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo" placement="bottom">
          <IconButton size="small" aria-label="Redo" sx={(theme) => ICON_BTN_SX(theme)}>
            <Redo2 size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <TbDivider />

      {/* Utility icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Lock editing" placement="bottom">
          <IconButton size="small" aria-label="Lock editing" aria-pressed={locked} onClick={() => setLocked((v) => !v)} sx={(theme) => ICON_BTN_SX(theme)}>
            <Lock size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bookmark pathway" placement="bottom">
          <IconButton size="small" aria-label="Bookmark pathway" aria-pressed={starred} onClick={() => setStarred((v) => !v)} sx={(theme) => ICON_BTN_SX(theme)}>
            <Star size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Language settings" placement="bottom">
          <IconButton size="small" aria-label="Language settings" sx={(theme) => ICON_BTN_SX(theme)}>
            <Globe size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Version history" placement="bottom">
          <IconButton size="small" aria-label="Version history" sx={(theme) => ICON_BTN_SX(theme)}>
            <Calendar size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="All changes saved" placement="bottom">
          <IconButton size="small" aria-label="All changes saved" sx={(theme) => ICON_BTN_SX(theme)}>
            <CheckCheck size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Collaborators */}
      <Box sx={{ display: 'flex', mr: 1 }}>
        <Tooltip title="2 collaborators online" placement="bottom">
          <Box sx={{ display: 'flex' }} aria-label="2 collaborators online">
            {[
              { initials: 'CA', color: '#6846E6' },
              { initials: 'HA', color: '#1F7A4A' },
            ].map((c, i) => (
              <Avatar
                key={c.initials}
                sx={{
                  width: 28, height: 28,
                  fontSize: 11,
                  fontWeight: 'fontWeightSemibold',
                  bgcolor: c.color,
                  border: (t) => `2px solid ${t.surface.canvas}`,
                  ml: i === 0 ? 0 : -1.5,
                }}
              >
                {c.initials}
              </Avatar>
            ))}
          </Box>
        </Tooltip>
      </Box>

      {/* Search + comments */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Search in pathway" placement="bottom">
          <IconButton size="small" aria-label="Search in pathway" sx={(theme) => ICON_BTN_SX(theme)}>
            <Search size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Comments" placement="bottom">
          <IconButton size="small" aria-label="Comments" sx={(theme) => ICON_BTN_SX(theme)}>
            <MessageSquare size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <TbDivider />

      {/* Share + primary CTA */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Share pathway" placement="bottom">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UserPlus size={16} />}
            sx={{ textTransform: 'none', height: 36 }}
          >
            Share
          </Button>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Send size={16} />}
          sx={{ textTransform: 'none', height: 36, fontWeight: 'fontWeightSemibold' }}
        >
          Send for Publishing
        </Button>
      </Box>
    </Box>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PathwayEditorPage() {
  const [activeRail, setActiveRail] = useState('shapes');
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditorTopBar />
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftRail active={activeRail} onSelect={setActiveRail} />
        {activeRail === 'shapes' && <ShapesPanel />}
        <ReactFlowProvider>
          <CanvasContent aiOpen={aiOpen} onToggleAI={() => setAiOpen((v) => !v)} />
        </ReactFlowProvider>
      </Box>
    </Box>
  );
}
