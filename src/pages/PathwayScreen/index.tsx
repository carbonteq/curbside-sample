import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import {
  X, ZoomIn, ZoomOut, Maximize2, MousePointer2,
  BookOpen, MessageSquare, Share2, MoreHorizontal,
  ChevronRight, ExternalLink, ChevronDown, Send,
} from 'lucide-react';

// ─── Pathway canvas constants ─────────────────────────────────────────────────

const CANVAS_W = 940;
const CANVAS_H = 800;
const CX = 450; // center x for main column

type NodeType = 'start' | 'action' | 'decision' | 'end' | 'side';

interface PathwayNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  x: number; y: number; w: number; h: number;
}

const NODES: PathwayNode[] = [
  { id: 'start',    type: 'start',    label: 'Patient Presents with Possible Sepsis',  x: 320, y:  40, w: 260, h: 44 },
  { id: 'assess',   type: 'action',   label: 'Initial Assessment & Vital Signs',        sublabel: 'HR, BP, Temp, RR, SpO₂', x: 310, y: 142, w: 280, h: 60 },
  { id: 'decision', type: 'decision', label: '≥ 2 SIRS Criteria Met?',                  sublabel: 'Temp, HR, RR, WBC', x: 295, y: 264, w: 310, h: 60 },
  { id: 'culture',  type: 'action',   label: 'Obtain Blood Cultures × 2',               sublabel: 'Before antibiotic administration', x: 310, y: 392, w: 280, h: 60 },
  { id: 'abx',      type: 'action',   label: 'Administer Broad-Spectrum Antibiotics',   sublabel: 'Within 1 hour of recognition',     x: 310, y: 504, w: 280, h: 60 },
  { id: 'fluids',   type: 'action',   label: '30 mL/kg IV Crystalloid Bolus',           sublabel: 'Complete within 3 hours',          x: 310, y: 616, w: 280, h: 60 },
  { id: 'end',      type: 'end',      label: 'Disposition Decision', x: 340, y: 736, w: 220, h: 44 },
  { id: 'monitor',  type: 'side',     label: 'Routine Monitoring', sublabel: 'q4h reassessment', x: 676, y: 264, w: 196, h: 60 },
];

interface Arrow {
  d: string;
  label?: string;
  labelX?: number;
  labelY?: number;
}

const ARROWS: Arrow[] = [
  { d: `M${CX},84 L${CX},142` },
  { d: `M${CX},202 L${CX},264` },
  { d: `M${CX},324 L${CX},392`,  label: 'YES', labelX: CX + 8, labelY: 360 },
  { d: `M605,294 L676,294`,       label: 'NO',  labelX: 632,    labelY: 284 },
  { d: `M${CX},452 L${CX},504` },
  { d: `M${CX},564 L${CX},616` },
  { d: `M${CX},676 L${CX},736` },
  { d: `M774,324 L774,758 L560,758`, label: 'Reassess', labelX: 700, labelY: 748 },
];

// ─── Node renderer ────────────────────────────────────────────────────────────

function PathwayNode({ node }: { node: PathwayNode }) {
  const baseStyle = {
    position: 'absolute' as const,
    left: node.x,
    top: node.y,
    width: node.w,
    height: node.h,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    px: 2,
    textAlign: 'center' as const,
    userSelect: 'none' as const,
    cursor: 'pointer',
    transition: 'box-shadow 150ms ease',
  };

  if (node.type === 'start') {
    return (
      <Box
        sx={(theme) => ({
          ...baseStyle,
          bgcolor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          borderRadius: `${theme.radius.pill}px`,
          '&:hover': { boxShadow: theme.shadows[4] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold">{node.label}</Typography>
      </Box>
    );
  }

  if (node.type === 'end') {
    return (
      <Box
        sx={(theme) => ({
          ...baseStyle,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          borderRadius: `${theme.radius.pill}px`,
          '&:hover': { boxShadow: theme.shadows[4] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold">{node.label}</Typography>
      </Box>
    );
  }

  if (node.type === 'decision') {
    return (
      <Box
        sx={(theme) => ({
          ...baseStyle,
          bgcolor: theme.palette.warning.light,
          border: `2px solid ${theme.palette.warning.main}`,
          borderRadius: `${theme.radius.md}px`,
          '&:hover': { boxShadow: theme.shadows[3] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold" color="warning.dark">{node.label}</Typography>
        {node.sublabel && (
          <Typography variant="caption" color="warning.dark" sx={{ opacity: 0.75 }}>{node.sublabel}</Typography>
        )}
      </Box>
    );
  }

  if (node.type === 'side') {
    return (
      <Box
        sx={(theme) => ({
          ...baseStyle,
          bgcolor: theme.surface.raised,
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.md}px`,
          '&:hover': { boxShadow: theme.shadows[2] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightMedium" color="text.secondary">{node.label}</Typography>
        {node.sublabel && (
          <Typography variant="caption" color="text.disabled">{node.sublabel}</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        ...baseStyle,
        bgcolor: theme.surface.overlay,
        border: `1px solid ${theme.border.default}`,
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        borderRadius: `${theme.radius.md}px`,
        boxShadow: theme.shadows[1],
        '&:hover': { boxShadow: theme.shadows[3] },
      })}
    >
      <Typography variant="body2" fontWeight="fontWeightSemibold">{node.label}</Typography>
      {node.sublabel && (
        <Typography variant="caption" color="text.secondary">{node.sublabel}</Typography>
      )}
    </Box>
  );
}

// ─── Canvas SVG arrows ────────────────────────────────────────────────────────

function CanvasArrows() {
  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: CANVAS_W, height: CANVAS_H, pointerEvents: 'none' }}
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
      {ARROWS.map((a, i) => (
        <g key={i}>
          <path
            d={a.d}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
            markerEnd="url(#arrow)"
          />
          {a.label && (
            <text
              x={a.labelX}
              y={a.labelY}
              fontSize={10}
              fill="#64748b"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              {a.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ─── Resources drawer content ─────────────────────────────────────────────────

const EVIDENCES = [
  {
    title: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021',
    refs: [
      { authors: 'Evans L, Rhodes A, Alhazzani W, et al.', title: 'Surviving Sepsis Campaign: International Guidelines 2021.', id: 'PMID 34599691' },
    ],
  },
  {
    title: 'IDSA Guidelines on the Treatment of Gram-Negative Bacteremia',
    refs: [
      { authors: 'Tamma PD, Aitken SL, Bonomo RA, et al.', title: 'IDSA Guidance on the Treatment of Gram-Negative Bacteremia.', id: 'PMID 36810794' },
    ],
  },
  {
    title: 'CMS Severe Sepsis and Septic Shock Management Bundle (SEP-1)',
    refs: [
      { authors: 'Centers for Medicare & Medicaid Services.', title: 'Hospital Inpatient Quality Reporting Program: SEP-1.', id: 'CMS QM' },
    ],
  },
];

function ResourcesTab({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={(theme) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: theme.space.lg, py: theme.space.md,
        borderBottom: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
      })}>
        <Typography variant="subtitle1" fontWeight="fontWeightSemibold">Resources</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close resources panel">
          <X size={16} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {EVIDENCES.map((ev, i) => (
          <Accordion key={i} disableGutters elevation={0} sx={(theme) => ({ borderBottom: `1px solid ${theme.border.subtle}` })}>
            <AccordionSummary
              expandIcon={<ChevronDown size={16} />}
              sx={(theme) => ({ px: theme.space.lg, py: theme.space.sm, minHeight: 0 })}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <BookOpen size={14} style={{ marginTop: 2, flexShrink: 0, color: 'var(--mui-palette-primary-main)' }} />
                <Typography variant="body2" fontWeight="fontWeightMedium" sx={{ lineHeight: 1.4 }}>
                  {ev.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={(theme) => ({ px: theme.space.lg, pt: 0, pb: theme.space.md })}>
              {ev.refs.map((ref, j) => (
                <Box key={j} sx={(theme) => ({
                  bgcolor: theme.surface.subtle,
                  borderRadius: `${theme.radius.sm}px`,
                  p: theme.space.sm,
                  mb: j < ev.refs.length - 1 ? theme.space.xs : 0,
                })}>
                  <Typography variant="caption" color="text.secondary" display="block">{ref.authors}</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: '2px' }}>{ref.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '4px' }}>
                    <Chip label={ref.id} size="small" variant="soft" color="neutral" sx={{ height: 18, fontSize: 10 }} />
                    <IconButton size="small" sx={{ p: '2px' }}>
                      <ExternalLink size={12} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

// ─── Feedback drawer content ──────────────────────────────────────────────────

const EDITORS = [
  { name: 'Dr. Sarah Chen', role: 'Infectious Disease', initials: 'SC', color: 'primary' as const },
  { name: 'Dr. Michael Torres', role: 'Critical Care', initials: 'MT', color: 'secondary' as const },
];

function FeedbackTab({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (text.trim()) { setSent(true); setText(''); setTimeout(() => setSent(false), 3000); }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={(theme) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: theme.space.lg, py: theme.space.md,
        borderBottom: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
      })}>
        <Typography variant="subtitle1" fontWeight="fontWeightSemibold">Feedback</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close feedback panel">
          <X size={16} />
        </IconButton>
      </Box>

      <Box sx={(theme) => ({ flex: 1, overflowY: 'auto', p: theme.space.lg, display: 'flex', flexDirection: 'column', gap: theme.space.lg })}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={(theme) => ({ mb: theme.space.sm })}>
            Share feedback directly with the pathway editors.
          </Typography>
          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Describe your feedback, suggestion, or concern…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
          />
          {sent && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
              Feedback sent successfully.
            </Typography>
          )}
          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={!text.trim()}
            onClick={handleSend}
            startIcon={<Send size={14} />}
            sx={(theme) => ({ mt: theme.space.md })}
          >
            Send to Editors
          </Button>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.muted" display="block" sx={(theme) => ({ mb: theme.space.sm })}>
            Pathway Editors
          </Typography>
          {EDITORS.map((ed) => (
            <Box key={ed.name} sx={(theme) => ({
              display: 'flex', alignItems: 'center', gap: theme.space.md,
              py: theme.space.sm,
            })}>
              <Avatar variant="soft" color={ed.color} sx={{ width: 32, height: 32, fontSize: 12 }}>
                {ed.initials}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="fontWeightMedium">{ed.name}</Typography>
                <Typography variant="caption" color="text.secondary">{ed.role}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PathwayScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'feedback'>('resources');
  const [zoom, setZoom] = useState(100);

  const openDrawer = (tab: 'resources' | 'feedback') => {
    setActiveTab(tab);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        display: 'flex', alignItems: 'center', gap: theme.space.md,
        px: theme.space['2xl'], height: 52, flexShrink: 0,
        bgcolor: theme.surface.canvas,
        borderBottom: `1px solid ${theme.border.default}`,
      })}>
        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
            Pathways
          </Typography>
          <ChevronRight size={14} color="var(--mui-palette-text-disabled)" />
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
            Infectious Disease
          </Typography>
          <ChevronRight size={14} color="var(--mui-palette-text-disabled)" />
          <Typography variant="body2" fontWeight="fontWeightSemibold" noWrap>
            Sepsis Management Protocol
          </Typography>
          <Chip
            label="Published"
            size="small"
            variant="soft"
            color="success"
            sx={(theme) => ({ ml: theme.space.xs, height: 20, fontSize: 11 })}
          />
          <Typography variant="caption" color="text.disabled" sx={(theme) => ({ ml: theme.space.xs })}>
            v2.4
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="ghost"
            size="small"
            startIcon={<BookOpen size={14} />}
            onClick={() => openDrawer('resources')}
          >
            Resources
          </Button>
          <Button
            variant="ghost"
            size="small"
            startIcon={<MessageSquare size={14} />}
            onClick={() => openDrawer('feedback')}
          >
            Feedback
          </Button>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
          <Tooltip title="Share pathway">
            <IconButton size="small" variant="ghost">
              <Share2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton size="small" variant="ghost">
              <MoreHorizontal size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Work area ───────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Canvas */}
        <Box sx={(theme) => ({
          flex: 1,
          position: 'relative',
          overflow: 'auto',
          bgcolor: theme.surface.subtle,
          backgroundImage: `radial-gradient(circle, ${theme.border.default} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        })}>
          <Box sx={{ minWidth: CANVAS_W, minHeight: CANVAS_H, position: 'relative' }}>
            <CanvasArrows />
            {NODES.map((node) => (
              <PathwayNode key={node.id} node={node} />
            ))}
          </Box>
        </Box>

        {/* Right toolbar */}
        <Box sx={(theme) => ({
          width: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.space.xs,
          pt: theme.space.md,
          bgcolor: theme.surface.canvas,
          borderLeft: `1px solid ${theme.border.default}`,
          flexShrink: 0,
        })}>
          <Tooltip title="Select" placement="left">
            <IconButton size="small" variant="soft" color="primary" aria-label="Select tool">
              <MousePointer2 size={16} />
            </IconButton>
          </Tooltip>
          <Divider flexItem sx={{ my: 0.5 }} />
          <Tooltip title="Zoom in" placement="left">
            <IconButton size="small" variant="ghost" onClick={() => setZoom(z => Math.min(z + 25, 200))} aria-label="Zoom in">
              <ZoomIn size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out" placement="left">
            <IconButton size="small" variant="ghost" onClick={() => setZoom(z => Math.max(z - 25, 25))} aria-label="Zoom out">
              <ZoomOut size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit to screen" placement="left">
            <IconButton size="small" variant="ghost" onClick={() => setZoom(100)} aria-label="Fit to screen">
              <Maximize2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: theme.space['2xl'], height: 36, flexShrink: 0,
        bgcolor: theme.surface.canvas,
        borderTop: `1px solid ${theme.border.default}`,
      })}>
        <Typography variant="caption" color="text.secondary">
          Sepsis Management Protocol · Updated Apr 14, 2026 · Dr. Sarah Chen
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" sx={{ p: '2px' }} onClick={() => setZoom(z => Math.max(z - 25, 25))}>
            <ZoomOut size={12} />
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 36, textAlign: 'center' }}>
            {zoom}%
          </Typography>
          <IconButton size="small" sx={{ p: '2px' }} onClick={() => setZoom(z => Math.min(z + 25, 200))}>
            <ZoomIn size={12} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Resources / Feedback drawer ─────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: 360,
            position: 'absolute',
            height: '100%',
            boxSizing: 'border-box',
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={(theme) => ({
          borderBottom: `1px solid ${theme.border.subtle}`,
          flexShrink: 0,
        })}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ minHeight: 40, px: 1 }}
          >
            <Tab value="resources" label="Resources" sx={{ minHeight: 40, py: 0, fontSize: 13 }} />
            <Tab value="feedback"  label="Feedback"  sx={{ minHeight: 40, py: 0, fontSize: 13 }} />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'resources'
            ? <ResourcesTab onClose={() => setDrawerOpen(false)} />
            : <FeedbackTab  onClose={() => setDrawerOpen(false)} />
          }
        </Box>
      </Drawer>
    </Box>
  );
}
