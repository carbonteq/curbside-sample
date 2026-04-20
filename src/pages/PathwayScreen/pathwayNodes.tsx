import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type PathwayNodeData = { label: string; sublabel?: string };

// Small invisible handles — revealed on node hover via CSS override
const hdl: React.CSSProperties = { width: 8, height: 8 };

export function StartNode({ data }: NodeProps) {
  const { label } = data as PathwayNodeData;
  return (
    <>
      <Handle type="source" position={Position.Bottom} id="bottom" style={hdl} />
      <Box
        sx={(theme) => ({
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2,
          bgcolor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
          borderRadius: `${theme.radius.pill}px`,
          cursor: 'default',
          transition: theme.motion.short,
          '&:hover': { boxShadow: theme.shadows[4] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold" textAlign="center">
          {label}
        </Typography>
      </Box>
    </>
  );
}

export function ActionNode({ data }: NodeProps) {
  const { label, sublabel } = data as PathwayNodeData;
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={hdl} />
      <Box
        sx={(theme) => ({
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2,
          bgcolor: theme.surface.overlay,
          border: `1px solid ${theme.border.default}`,
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          borderRadius: `${theme.radius.md}px`,
          boxShadow: theme.shadows[1],
          cursor: 'default',
          transition: theme.motion.short,
          '&:hover': { boxShadow: theme.shadows[3] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold" textAlign="center">
          {label}
        </Typography>
        {sublabel && (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            {sublabel}
          </Typography>
        )}
      </Box>
      <Handle type="source" position={Position.Bottom} id="bottom" style={hdl} />
    </>
  );
}

export function DecisionNode({ data }: NodeProps) {
  const { label, sublabel } = data as PathwayNodeData;
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={hdl} />
      <Box
        sx={(theme) => ({
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2,
          bgcolor: theme.palette.warning.light,
          border: `2px solid ${theme.palette.warning.main}`,
          borderRadius: `${theme.radius.md}px`,
          cursor: 'default',
          transition: theme.motion.short,
          '&:hover': { boxShadow: theme.shadows[3] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold" color="warning.dark" textAlign="center">
          {label}
        </Typography>
        {sublabel && (
          <Typography variant="caption" color="warning.dark" sx={{ opacity: 0.75 }} textAlign="center">
            {sublabel}
          </Typography>
        )}
      </Box>
      {/* YES — bottom, NO — right */}
      <Handle type="source" position={Position.Bottom} id="bottom" style={hdl} />
      <Handle type="source" position={Position.Right}  id="right"  style={hdl} />
    </>
  );
}

export function EndNode({ data }: NodeProps) {
  const { label } = data as PathwayNodeData;
  return (
    <>
      <Handle type="target" position={Position.Top}   id="top"   style={hdl} />
      <Handle type="target" position={Position.Right} id="right" style={hdl} />
      <Box
        sx={(theme) => ({
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          borderRadius: `${theme.radius.pill}px`,
          cursor: 'default',
          transition: theme.motion.short,
          '&:hover': { boxShadow: theme.shadows[4] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold" textAlign="center">
          {label}
        </Typography>
      </Box>
    </>
  );
}

export function SideNode({ data }: NodeProps) {
  const { label, sublabel } = data as PathwayNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left}   id="left"   style={hdl} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={hdl} />
      <Box
        sx={(theme) => ({
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2,
          bgcolor: theme.surface.raised,
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.md}px`,
          cursor: 'default',
          transition: theme.motion.short,
          '&:hover': { boxShadow: theme.shadows[2] },
        })}
      >
        <Typography variant="body2" fontWeight="fontWeightMedium" color="text.secondary" textAlign="center">
          {label}
        </Typography>
        {sublabel && (
          <Typography variant="caption" color="text.disabled" textAlign="center">
            {sublabel}
          </Typography>
        )}
      </Box>
    </>
  );
}

export const NODE_TYPES = {
  startNode:    StartNode,
  actionNode:   ActionNode,
  decisionNode: DecisionNode,
  endNode:      EndNode,
  sideNode:     SideNode,
};
