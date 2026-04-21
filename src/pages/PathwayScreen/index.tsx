import { useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
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
import { NODE_TYPES } from './pathwayNodes';
import type { PathwayNodeData } from './pathwayNodes';

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

const initialNodes: Node<PathwayNodeData>[] = [
  { id: 'start',    type: 'startNode',    position: { x: 320, y:  40 }, style: { width: 260, height:  44 }, data: { label: 'Patient Presents with Possible Sepsis' } },
  { id: 'assess',   type: 'actionNode',   position: { x: 310, y: 142 }, style: { width: 280, height:  60 }, data: { label: 'Initial Assessment & Vital Signs', sublabel: 'HR, BP, Temp, RR, SpO₂' } },
  { id: 'decision', type: 'decisionNode', position: { x: 295, y: 264 }, style: { width: 310, height:  60 }, data: { label: '≥ 2 SIRS Criteria Met?', sublabel: 'Temp, HR, RR, WBC' } },
  { id: 'culture',  type: 'actionNode',   position: { x: 310, y: 392 }, style: { width: 280, height:  60 }, data: { label: 'Obtain Blood Cultures × 2', sublabel: 'Before antibiotic administration' } },
  { id: 'abx',      type: 'actionNode',   position: { x: 310, y: 504 }, style: { width: 280, height:  60 }, data: { label: 'Administer Broad-Spectrum Antibiotics', sublabel: 'Within 1 hour of recognition' } },
  { id: 'fluids',   type: 'actionNode',   position: { x: 310, y: 616 }, style: { width: 280, height:  60 }, data: { label: '30 mL/kg IV Crystalloid Bolus', sublabel: 'Complete within 3 hours' } },
  { id: 'end',      type: 'endNode',      position: { x: 340, y: 736 }, style: { width: 220, height:  44 }, data: { label: 'Disposition Decision' } },
  { id: 'monitor',  type: 'sideNode',     position: { x: 676, y: 264 }, style: { width: 196, height:  60 }, data: { label: 'Routine Monitoring', sublabel: 'q4h reassessment' } },
];

const initialEdges: Edge[] = [
  { id: 'e-start-assess',      source: 'start',    target: 'assess',   type: 'smoothstep', style: edgeStyle },
  { id: 'e-assess-decision',   source: 'assess',   target: 'decision', type: 'smoothstep', style: edgeStyle },
  { id: 'e-decision-culture',  source: 'decision', sourceHandle: 'bottom', target: 'culture',  type: 'smoothstep', style: edgeStyle, label: 'YES', labelStyle, labelBgStyle, labelBgPadding: [4, 2], labelBgBorderRadius: 4 },
  { id: 'e-decision-monitor',  source: 'decision', sourceHandle: 'right',  target: 'monitor',  targetHandle: 'left',  type: 'smoothstep', style: edgeStyle, label: 'NO',  labelStyle, labelBgStyle, labelBgPadding: [4, 2], labelBgBorderRadius: 4 },
  { id: 'e-culture-abx',       source: 'culture',  target: 'abx',      type: 'smoothstep', style: edgeStyle },
  { id: 'e-abx-fluids',        source: 'abx',      target: 'fluids',   type: 'smoothstep', style: edgeStyle },
  { id: 'e-fluids-end',        source: 'fluids',   target: 'end',      targetHandle: 'top',   type: 'smoothstep', style: edgeStyle },
  { id: 'e-monitor-end',       source: 'monitor',  sourceHandle: 'bottom', target: 'end', targetHandle: 'right', type: 'smoothstep', animated: true, style: { ...edgeStyle, stroke: 'var(--mui-palette-primary-light)' }, label: 'Reassess', labelStyle, labelBgStyle, labelBgPadding: [4, 2], labelBgBorderRadius: 4 },
];

// ─── Flow canvas ──────────────────────────────────────────────────────────────

function FlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Box sx={(theme) => ({
      flex: 1, bgcolor: theme.surface.subtle,
      ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
    })}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        style={{ width: '100%', height: '100%' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--mui-palette-grey-300)"
        />
      </ReactFlow>
    </Box>
  );
}

// ─── Zoom controls (must live inside ReactFlowProvider) ───────────────────────

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <>
      <Tooltip title="Zoom in" placement="left">
        <IconButton size="small" variant="ghost" onClick={() => zoomIn()} aria-label="Zoom in">
          <ZoomIn size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom out" placement="left">
        <IconButton size="small" variant="ghost" onClick={() => zoomOut()} aria-label="Zoom out">
          <ZoomOut size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Fit to screen" placement="left">
        <IconButton size="small" variant="ghost" onClick={() => fitView({ padding: 0.15 })} aria-label="Fit to screen">
          <Maximize2 size={16} />
        </IconButton>
      </Tooltip>
    </>
  );
}

function ZoomLevel() {
  const zoom = useStore((s) => s.transform[2]);
  return (
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 36, textAlign: 'center' }}>
      {Math.round(zoom * 100)}%
    </Typography>
  );
}

function ZoomBar() {
  const { zoomIn, zoomOut } = useReactFlow();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton size="small" sx={(theme) => ({ p: 1 })} onClick={() => zoomOut()}>
        <ZoomOut size={12} />
      </IconButton>
      <ZoomLevel />
      <IconButton size="small" sx={(theme) => ({ p: 1 })} onClick={() => zoomIn()}>
        <ZoomIn size={12} />
      </IconButton>
    </Box>
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
        px: 4, py: 3,
        borderBottom: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
        ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
      })}>
        <Typography variant="subtitle1" fontWeight="fontWeightSemibold">Resources</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close resources panel">
          <X size={16} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {EVIDENCES.map((ev, i) => (
          <Accordion key={i} disableGutters elevation={0} sx={(theme) => ({
            borderBottom: `1px solid ${theme.border.subtle}`,
            ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
          })}>
            <AccordionSummary
              expandIcon={<ChevronDown size={16} />}
              sx={(theme) => ({ px: 4, py: 2, minHeight: 0 })}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <BookOpen size={14} style={{ marginTop: 2, flexShrink: 0, color: 'var(--mui-palette-primary-main)' }} />
                <Typography variant="body2" fontWeight="fontWeightMedium" sx={{ lineHeight: 1.4 }}>
                  {ev.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={(theme) => ({ px: 4, pt: 0, pb: 3 })}>
              {ev.refs.map((ref, j) => (
                <Box key={j} sx={(theme) => ({
                  bgcolor: theme.surface.subtle,
                  borderRadius: `${theme.radius.sm}px`,
                  p: 2,
                  mb: j < ev.refs.length - 1 ? 1 : 0,
                  ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[800] }),
                })}>
                  <Typography variant="caption" color="text.secondary" display="block">{ref.authors}</Typography>
                  <Typography variant="caption" display="block" sx={(theme) => ({ mt: 1 })}>{ref.title}</Typography>
                  <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 })}>
                    <Chip label={ref.id} size="small" variant="soft" color="neutral" sx={{ height: 18 }} />
                    <IconButton size="small" sx={(theme) => ({ p: 1 })}>
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
  { name: 'Dr. Sarah Chen',    role: 'Infectious Disease', initials: 'SC', color: 'primary'   as const },
  { name: 'Dr. Michael Torres', role: 'Critical Care',      initials: 'MT', color: 'secondary' as const },
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
        px: 4, py: 3,
        borderBottom: `1px solid ${theme.border.subtle}`,
        flexShrink: 0,
        ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
      })}>
        <Typography variant="subtitle1" fontWeight="fontWeightSemibold">Feedback</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close feedback panel">
          <X size={16} />
        </IconButton>
      </Box>

      <Box sx={(theme) => ({ flex: 1, overflowY: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 4 })}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={(theme) => ({ mb: 2 })}>
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
            sx={(theme) => ({ mt: 3 })}
          >
            Send to Editors
          </Button>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.muted" display="block" sx={(theme) => ({ mb: 2 })}>
            Pathway Editors
          </Typography>
          {EDITORS.map((ed) => (
            <Box key={ed.name} sx={(theme) => ({
              display: 'flex', alignItems: 'center', gap: 3,
              py: 2,
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

  const openDrawer = (tab: 'resources' | 'feedback') => {
    setActiveTab(tab);
    setDrawerOpen(true);
  };

  return (
    <ReactFlowProvider>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

        {/* ── Top bar ─────────────────────────────────────────────────────────── */}
        <Box sx={(theme) => ({
          display: 'flex', alignItems: 'center', gap: 3,
          px: theme.space['2xl'], height: 52, flexShrink: 0,
          bgcolor: theme.surface.canvas,
          borderBottom: `1px solid ${theme.border.default}`,
          ...theme.applyStyles('dark', {
            bgcolor: theme.palette.grey[900],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
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
              sx={(theme) => ({ ml: 1, height: 20, fontSize: 11 })}
            />
            <Typography variant="caption" color="text.disabled" sx={(theme) => ({ ml: 1 })}>
              v2.4
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="ghost" size="small" startIcon={<BookOpen size={14} />} onClick={() => openDrawer('resources')}>
              Resources
            </Button>
            <Button variant="ghost" size="small" startIcon={<MessageSquare size={14} />} onClick={() => openDrawer('feedback')}>
              Feedback
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
            <Tooltip title="Share pathway">
              <IconButton size="small" variant="ghost"><Share2 size={16} /></IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton size="small" variant="ghost"><MoreHorizontal size={16} /></IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Work area ───────────────────────────────────────────────────────── */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ReactFlow canvas */}
          <FlowCanvas />

          {/* Right toolbar */}
          <Box sx={(theme) => ({
            width: 44,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 1, pt: 3,
            bgcolor: theme.surface.canvas,
            borderLeft: `1px solid ${theme.border.default}`,
            flexShrink: 0,
            ...theme.applyStyles('dark', {
              bgcolor: theme.palette.grey[900],
              borderColor: theme.palette.grey[700],
            }),
          })}>
            <Tooltip title="Select" placement="left">
              <IconButton size="small" variant="soft" color="primary" aria-label="Select tool">
                <MousePointer2 size={16} />
              </IconButton>
            </Tooltip>
            <Divider flexItem sx={{ my: 1 }} />
            <ZoomControls />
          </Box>
        </Box>

        {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
        <Box sx={(theme) => ({
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: theme.space['2xl'], height: 36, flexShrink: 0,
          bgcolor: theme.surface.canvas,
          borderTop: `1px solid ${theme.border.default}`,
          ...theme.applyStyles('dark', {
            bgcolor: theme.palette.grey[900],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          <Typography variant="caption" color="text.secondary">
            Sepsis Management Protocol · Updated Apr 14, 2026 · Dr. Sarah Chen
          </Typography>
          <ZoomBar />
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
    </ReactFlowProvider>
  );
}
