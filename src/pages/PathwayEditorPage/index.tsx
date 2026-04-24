import { useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";
import Slider from "@mui/material/Slider";
import { alpha } from "@mui/material/styles";
import {
  ChevronDown,
  Undo2,
  Redo2,
  Lock,
  Star,
  Globe,
  History,
  CheckCircle2,
  Search,
  NotepadText,
  MessageSquare,
  UserPlus,
  Send,
  LayoutGrid,
  Image as ImageIcon,
  Video,
  HelpCircle,
  Settings,
  SlidersHorizontal,
  Plus,
  MousePointer2,
  Spline,
  Waypoints,
  Grid3x3,
  Paperclip,
  Hash,
  Crosshair,
  Maximize2,
  Map as MapIcon,
  Minus,
  Maximize,
  Sparkles,
  Pin,
  X,
} from "lucide-react";

// ─── Top bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 3,
        px: 5,
        height: 56,
        flexShrink: 0,
        bgcolor: theme.surface.canvas,
        borderBottom: `1px solid ${theme.border.default}`,
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[900],
          borderColor: theme.palette.grey[700],
        }),
      })}
    >
      {/* Logo */}
      <Box
        sx={(theme) => ({
          width: 32,
          height: 32,
          borderRadius: `${theme.radius.md}px`,
          display: "grid",
          placeItems: "center",
          color: theme.palette.primary.contrastText,
          fontWeight: "fontWeightBold",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          flexShrink: 0,
        })}
      >
        C
      </Box>

      {/* Pathway name + mode */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title="Switch pathway">
          <Button
            variant="ghost"
            size="medium"
            startIcon={<NotepadText size={14} />}
            endIcon={<ChevronDown size={12} />}
            sx={{ fontWeight: "fontWeightSemibold" }}
          >
            Test Pathway
          </Button>
        </Tooltip>
        <Tooltip title="Change editing mode">
          <Chip
            size="medium"
            variant="soft"
            color="warning"
            label={
              <Box
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "warning.main",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <Box component="span">Editing</Box>
                <Box
                  component="span"
                  sx={{ color: "text.muted", fontWeight: "fontWeightRegular" }}
                >
                  v0.0.2
                </Box>
                <ChevronDown size={10} />
              </Box>
            }
            sx={(theme) => ({ borderRadius: `${theme.radius.pill}px`, pl: 1, cursor: "pointer" })}
          />
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ my: 2 }} />

      {/* Undo/redo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
        <Tooltip title="Undo">
          <IconButton variant="ghost" size="medium" aria-label="Undo">
            <Undo2 size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton variant="ghost" size="medium" aria-label="Redo">
            <Redo2 size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ my: 2 }} />

      {/* Meta actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
        <Tooltip title="Lock editing">
          <IconButton variant="ghost" size="medium" aria-label="Lock">
            <Lock size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bookmark">
          <IconButton variant="ghost" size="medium" aria-label="Bookmark">
            <Star size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Language">
          <IconButton variant="ghost" size="medium" aria-label="Language">
            <Globe size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Version history">
          <IconButton variant="ghost" size="medium" aria-label="History">
            <History size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="All changes saved">
          <IconButton
            variant="ghost"
            size="medium"
            aria-label="All changes saved"
            sx={{ ml: 1, color: "success.main" }}
          >
            <CheckCircle2 size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Tooltip title="2 collaborators">
        <AvatarGroup
          max={3}
          sx={(t) => ({
            "& .MuiAvatar-root": {
              width: 28,
              height: 28,
              fontSize: t.typography.caption.fontSize,
            },
          })}
        >
          <Avatar variant="soft" color="primary">
            CA
          </Avatar>
          <Avatar variant="soft" color="success">
            HA
          </Avatar>
        </AvatarGroup>
      </Tooltip>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
        <Tooltip title="Search">
          <IconButton variant="ghost" size="medium" aria-label="Search">
            <Search size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Comments">
          <IconButton variant="ghost" size="medium" aria-label="Comments">
            <MessageSquare size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ my: 2 }} />

      <Button
        variant="outlined"
        size="medium"
        startIcon={<UserPlus size={14} />}
      >
        Share
      </Button>
      <Button variant="contained" size="medium" startIcon={<Send size={14} />}>
        Send for Publishing
      </Button>
    </Box>
  );
}

// ─── Left rail ───────────────────────────────────────────────────────────────

type RailKey = "shapes" | "images" | "videos" | "quizzes";

function Rail({
  active,
  onSelect,
}: {
  active: RailKey;
  onSelect: (k: RailKey) => void;
}) {
  const items: Array<{ key: RailKey; label: string; icon: React.ReactNode }> = [
    { key: "shapes", label: "Shapes", icon: <LayoutGrid size={20} /> },
    { key: "images", label: "Images", icon: <ImageIcon size={20} /> },
    { key: "videos", label: "Videos", icon: <Video size={20} /> },
    { key: "quizzes", label: "Quizzes", icon: <HelpCircle size={20} /> },
  ];

  return (
    <Box
      component="nav"
      aria-label="Editor sections"
      sx={(theme) => ({
        width: 72,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        py: 4,
        px: 2,
        bgcolor: theme.surface.subtle,
        borderRight: `1px solid ${theme.border.default}`,
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[900],
          borderColor: theme.palette.grey[700],
        }),
      })}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <ButtonBase
            key={it.key}
            onClick={() => onSelect(it.key)}
            aria-pressed={isActive}
            sx={(theme) => ({
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              gap: 1,
              py: 2,
              borderRadius: `${theme.radius.md}px`,
              color: theme.palette.text.secondary,
              fontSize: theme.typography.caption.fontSize,
              fontWeight: "fontWeightMedium",
              transition: theme.motion.short,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
              ...(isActive && {
                bgcolor: theme.palette.action.selected,
                color: theme.palette.primary.main,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: -6,
                  top: 10,
                  bottom: 10,
                  width: 3,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: `0 ${theme.radius.sm}px ${theme.radius.sm}px 0`,
                },
              }),
            })}
          >
            {it.icon}
            <Box component="span">{it.label}</Box>
          </ButtonBase>
        );
      })}
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Settings" placement="right">
        <IconButton variant="ghost" size="medium" aria-label="Settings">
          <Settings size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ─── Shapes panel ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  priority = false,
  open,
  onToggle,
}: {
  title: string;
  priority?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onToggle}
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        border: 0,
        background: "none",
        cursor: "pointer",
        p: 0,
        mb: 3,
        color: priority ? theme.palette.text.primary : theme.palette.text.muted,
      })}
    >
      <Typography
        variant={priority ? "body2" : "overline"}
        sx={{
          fontWeight: priority ? "fontWeightSemibold" : "fontWeightBold",
          m: 0,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={(theme) => ({
          display: "inline-flex",
          color: theme.palette.text.muted,
          transition: theme.motion.short,
          transform: open ? "rotate(0)" : "rotate(-90deg)",
        })}
      >
        <ChevronDown size={14} />
      </Box>
    </Box>
  );
}

function ShapeCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={label}>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          py: 2,
          px: 1,
          minWidth: 0,
          overflow: "hidden",
          borderRadius: `${theme.radius.sm}px`,
          cursor: "grab",
          color: theme.palette.text.secondary,
          transition: theme.motion.short,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          },
        })}
      >
        <Box
          sx={{ width: 32, height: 28, display: "grid", placeItems: "center" }}
        >
          {children}
        </Box>
        <Typography
          variant="caption"
          noWrap
          sx={{ color: "text.muted", maxWidth: "100%", fontSize: 9 }}
        >
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
}

function ShapeGrid({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}
    >
      {children}
    </Box>
  );
}

function PanelSection({
  title,
  priority,
  children,
}: {
  title: string;
  priority?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 3,
        borderColor: theme.border.subtle,
        borderRadius: `${theme.radius.md}px`,
        ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
      })}
    >
      <SectionHeader
        title={title}
        priority={priority}
        open={open}
        onToggle={() => setOpen((o) => !o)}
      />
      <Collapse in={open} unmountOnExit>
        {children}
      </Collapse>
    </Paper>
  );
}

// Simple placeholder glyph for a shape cell.
function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 40 30"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width="100%"
      height="100%"
    >
      {children}
    </svg>
  );
}

function ShapesPanel() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Box
      sx={(theme) => ({
        width: 280,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        bgcolor: theme.surface.canvas,
        borderRight: `1px solid ${theme.border.default}`,
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[900],
          borderColor: theme.palette.grey[700],
        }),
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 4,
          borderBottom: `1px solid ${theme.border.subtle}`,
          ...theme.applyStyles("dark", {
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <OutlinedInput
          size="small"
          placeholder="Search shapes…"
          fullWidth
          startAdornment={
            <InputAdornment position="start">
              <Search size={14} />
            </InputAdornment>
          }
        />
        <Tooltip title="Shape settings">
          <IconButton
            variant="ghost"
            size="medium"
            aria-label="Shape settings"
            aria-pressed={settingsOpen}
            onClick={() => setSettingsOpen((o) => !o)}
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
              },
              "&[aria-pressed='true']": {
                bgcolor: theme.palette.action.selected,
                color: theme.palette.primary.main,
              },
            })}
          >
            <SlidersHorizontal size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <PanelSection title="Shapes in use" priority>
          <ShapeGrid>
            <ShapeCell label="Checklist">
              <Glyph>
                <rect x={1} y={3} width={38} height={24} rx={3} />
                <path d="M6 10h3M12 10h20M6 15h3M12 15h16M6 20h3M12 20h14" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Rectangle">
              <Glyph>
                <rect x={2} y={6} width={36} height={18} rx={3} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Rounded">
              <Glyph>
                <rect x={2} y={6} width={36} height={18} rx={9} />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>
        </PanelSection>

        <PanelSection title="Standard">
          <Typography
            variant="overline"
            sx={{ display: "block", color: "text.muted", mb: 2 }}
          >
            Content
          </Typography>
          <ShapeGrid>
            <ShapeCell label="Text">
              <Glyph>
                <path d="M10 8h20M20 8v16M15 24h10" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Checklist">
              <Glyph>
                <rect x={6} y={6} width={5} height={5} rx={1} />
                <path d="M13 9h20M6 16h28M6 22h22" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Document">
              <Glyph>
                <path d="M8 4h18l6 6v16H8z" />
                <path d="M26 4v6h6M12 14h16M12 19h16M12 24h10" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Rich text">
              <Glyph>
                <rect x={2} y={4} width={36} height={22} rx={2} />
                <path d="M7 11h4M7 16h20M7 20h14" />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>

          <Divider sx={{ my: 3, borderStyle: "dashed" }} />
          <Typography
            variant="overline"
            sx={{ display: "block", color: "text.muted", mb: 2 }}
          >
            Containers
          </Typography>
          <ShapeGrid>
            <ShapeCell label="Rectangle">
              <Glyph>
                <rect x={2} y={6} width={36} height={18} rx={2} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Header">
              <Glyph>
                <rect x={2} y={6} width={36} height={18} rx={2} />
                <rect
                  x={2}
                  y={6}
                  width={36}
                  height={6}
                  rx={2}
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Filled">
              <Glyph>
                <rect
                  x={2}
                  y={6}
                  width={36}
                  height={18}
                  rx={2}
                  fill="currentColor"
                  fillOpacity={0.12}
                />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Dashed">
              <Glyph>
                <rect
                  x={2}
                  y={6}
                  width={36}
                  height={18}
                  rx={2}
                  strokeDasharray="3 2"
                />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Rounded">
              <Glyph>
                <rect x={2} y={6} width={36} height={18} rx={9} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Hexagon">
              <Glyph>
                <path d="M20 4l14 8v6l-14 8-14-8v-6z" />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>

          <Divider sx={{ my: 3, borderStyle: "dashed" }} />
          <Typography
            variant="overline"
            sx={{ display: "block", color: "text.muted", mb: 2 }}
          >
            Utility
          </Typography>
          <ShapeGrid>
            <ShapeCell label="Link">
              <Glyph>
                <path d="M14 15a5 5 0 0 1 5-5h3M26 15a5 5 0 0 1-5 5h-3M16 15h8" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Warning">
              <Glyph>
                <path d="M20 5l16 22H4z" />
                <path d="M20 14v6M20 23v1" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Video">
              <Glyph>
                <rect x={2} y={5} width={28} height={20} rx={2} />
                <polygon
                  points="32 10 38 7 38 23 32 20"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Curbside">
              <Glyph>
                <rect x={2} y={5} width={36} height={20} rx={3} />
                <circle cx={11} cy={15} r={4} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Calculator">
              <Glyph>
                <rect x={8} y={3} width={24} height={24} rx={2} />
                <path d="M12 9h16M12 15h4M19 15h4M26 15h2M12 21h4M19 21h4M26 21h2" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Divider">
              <Glyph>
                <line x1={4} y1={15} x2={36} y2={15} />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>
        </PanelSection>

        <PanelSection title="Flowchart">
          <ShapeGrid>
            <ShapeCell label="End">
              <Glyph>
                <ellipse cx={20} cy={15} rx={16} ry={9} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Decision">
              <Glyph>
                <path d="M20 4l16 11-16 11L4 15z" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Process">
              <Glyph>
                <rect x={4} y={7} width={32} height={16} rx={1} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Input">
              <Glyph>
                <path d="M8 7h28l-4 16H4z" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Arrow">
              <Glyph>
                <path d="M4 10h18V5l14 10-14 10v-5H4z" />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Start">
              <Glyph>
                <path d="M8 23h24L28 7H12z" />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>
        </PanelSection>

        <PanelSection title="Statuses">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
            }}
          >
            {(["info", "warning", "success", "error", "primary"] as const).map(
              (intent) => (
                <Tooltip
                  key={intent}
                  title={intent.charAt(0).toUpperCase() + intent.slice(1)}
                >
                  <Box
                    sx={(theme) => ({
                      height: 22,
                      borderRadius: `${theme.radius.sm}px`,
                      bgcolor: alpha(
                        theme.palette[intent].main,
                        theme.palette.action.hoverOpacity * 3,
                      ),
                      border: `1px solid ${alpha(theme.palette[intent].main, 0.3)}`,
                      cursor: "grab",
                    })}
                  />
                </Tooltip>
              ),
            )}
          </Box>
        </PanelSection>

        <PanelSection title="Tables">
          <ShapeGrid>
            <ShapeCell label="2 col">
              <Glyph>
                <rect x={2} y={5} width={36} height={20} rx={1} />
                <line x1={20} y1={5} x2={20} y2={25} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="3 col">
              <Glyph>
                <rect x={2} y={5} width={36} height={20} rx={1} />
                <line x1={14} y1={5} x2={14} y2={25} />
                <line x1={26} y1={5} x2={26} y2={25} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Grid">
              <Glyph>
                <rect x={2} y={5} width={36} height={20} rx={1} />
                <line x1={20} y1={5} x2={20} y2={25} />
                <line x1={2} y1={15} x2={38} y2={15} />
              </Glyph>
            </ShapeCell>
            <ShapeCell label="Dense">
              <Glyph>
                <rect x={2} y={5} width={36} height={20} rx={1} />
                <line x1={14} y1={5} x2={14} y2={25} />
                <line x1={26} y1={5} x2={26} y2={25} />
                <line x1={2} y1={15} x2={38} y2={15} />
              </Glyph>
            </ShapeCell>
          </ShapeGrid>
        </PanelSection>
      </Box>

      <Box
        sx={(theme) => ({
          p: 3,
          borderTop: `1px solid ${theme.border.subtle}`,
          ...theme.applyStyles("dark", {
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Button
          fullWidth
          variant="outlined"
          color="neutral"
          startIcon={<Plus size={14} />}
          sx={(theme) => ({
            borderStyle: "dashed",
            bgcolor: theme.surface.subtle,
            "&:hover": {
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity * 2),
            },
            ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
          })}
        >
          Shape library
        </Button>
      </Box>
    </Box>
  );
}

// ─── Canvas ──────────────────────────────────────────────────────────────────

function Connector() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={(theme) => ({ width: 2, height: 28, bgcolor: theme.border.strong })}
      />
      <Box
        sx={(theme) => ({
          width: 0,
          height: 0,
          borderLeft: `${theme.spacing(1)} solid transparent`,
          borderRight: `${theme.spacing(1)} solid transparent`,
          borderTop: `${theme.spacing(2)} solid ${theme.border.strong}`,
        })}
      />
    </Box>
  );
}

function Node({ title, sub }: { title: string; sub?: string }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        px: 4,
        py: 3,
        minWidth: 180,
        borderRadius: `${theme.radius.md}px`,
        bgcolor: theme.surface.canvas,
        boxShadow: theme.elevation.low,
        ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
      })}
    >
      <Typography variant="body2" sx={{ fontWeight: "fontWeightSemibold" }}>
        {title}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.muted">
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

function HeaderNode({ title, body }: { title: string; body: string }) {
  return (
    <Box sx={{ minWidth: 220 }}>
      <Box
        sx={(theme) => ({
          px: 3,
          py: 1,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: `${theme.radius.md}px ${theme.radius.md}px 0 0`,
          fontWeight: "fontWeightSemibold",
          fontSize: theme.typography.caption.fontSize,
        })}
      >
        {title}
      </Box>
      <Box
        sx={(theme) => ({
          px: 3,
          py: 2,
          border: `1px solid ${theme.border.default}`,
          borderTop: 0,
          borderRadius: `0 0 ${theme.radius.md}px ${theme.radius.md}px`,
          bgcolor: theme.surface.canvas,
          color: theme.palette.text.secondary,
          fontSize: theme.typography.caption.fontSize,
          ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
        })}
      >
        {body}
      </Box>
    </Box>
  );
}

function Decision({ label }: { label: string }) {
  return (
    <Box
      sx={(theme) => ({
        width: 160,
        height: 72,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        px: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        bgcolor: theme.surface.canvas,
        borderRadius: `${theme.radius.sm}px`,
        fontWeight: "fontWeightSemibold",
        fontSize: theme.typography.caption.fontSize,
        ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
      })}
    >
      {label}
    </Box>
  );
}

function StatusNode({
  label,
  intent,
}: {
  label: string;
  intent: "success" | "info" | "warning";
}) {
  return (
    <Box
      sx={(theme) => ({
        px: 4,
        py: 2,
        borderRadius: `${theme.radius.md}px`,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: "fontWeightSemibold",
        bgcolor: alpha(
          theme.palette[intent].main,
          theme.palette.action.hoverOpacity * 3,
        ),
        color: theme.palette[intent].dark,
        border: `1px solid ${alpha(theme.palette[intent].main, 0.3)}`,
      })}
    >
      {label}
    </Box>
  );
}

function CanvasArea({
  aiOpen,
  onToggleAi,
}: {
  aiOpen: boolean;
  onToggleAi: () => void;
}) {
  const [zoom, setZoom] = useState(60);

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        bgcolor: theme.surface.subtle,
        backgroundImage: `radial-gradient(circle, ${theme.border.default} 1px, transparent 1px)`,
        backgroundSize: `${theme.spacing(5)} ${theme.spacing(5)}`,
        ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
      })}
    >
      {/* Canvas top tool pill */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 0,
          p: 1,
          borderRadius: `${theme.radius.pill}px`,
          border: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.canvas,
          boxShadow: theme.elevation.low,
          zIndex: theme.zIndex.fab,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Tooltip title="Select">
          <IconButton
            size="medium"
            variant="soft"
            color="primary"
            aria-label="Select"
            sx={{ borderRadius: "50%" }}
          >
            <MousePointer2 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Connector">
          <IconButton
            variant="ghost"
            size="medium"
            aria-label="Connector"
            sx={{ borderRadius: "50%" }}
          >
            <Waypoints size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Curved connector">
          <IconButton
            variant="ghost"
            size="medium"
            aria-label="Curved"
            sx={{ borderRadius: "50%" }}
          >
            <Spline size={14} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
        <Tooltip title="Show grid">
          <IconButton
            variant="soft"
            color="primary"
            size="medium"
            aria-label="Grid"
            sx={{ borderRadius: "50%" }}
          >
            <Grid3x3 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Canvas settings">
          <IconButton
            variant="ghost"
            size="medium"
            aria-label="Settings"
            sx={{ borderRadius: "50%" }}
          >
            <Settings size={14} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Draft watermark */}
      <Typography
        sx={(theme) => ({
          position: "absolute",
          top: 20,
          right: 24,
          fontWeight: "fontWeightBold",
          fontSize: theme.typography.h1.fontSize,
          color: alpha(theme.palette.text.primary, 0.06),
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.03em",
        })}
      >
        Draft
      </Typography>

      {/* Stage */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pt: 11,
          pb: 10,
          px: 8,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 7,
            pb: 8,
            mt: 2,
          }}
        >
          <Node title="Start: Patient intake" sub="Entry node · 1 outgoing" />
          <Connector />
          <HeaderNode
            title="Initial assessment"
            body="Capture vitals and primary complaint. Route based on severity."
          />
          <Connector />
          <Decision label="Severity ≥ moderate?" />
          <Box sx={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            {[
              { intent: "warning" as const, label: "Urgent referral" },
              { intent: "info" as const, label: "Standard workflow" },
              { intent: "success" as const, label: "Discharge + follow-up" },
            ].map((b) => (
              <Box
                key={b.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Connector />
                <StatusNode intent={b.intent} label={b.label} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom toolbar */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 0,
          p: 1,
          borderRadius: `${theme.radius.md}px`,
          border: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.canvas,
          boxShadow: theme.elevation.low,
          zIndex: theme.zIndex.fab,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Tooltip title="Attach content">
          <IconButton variant="ghost" size="medium" aria-label="Attach">
            <Paperclip size={14} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
        <Tooltip title="Show node IDs">
          <IconButton variant="ghost" size="medium" aria-label="IDs">
            <Hash size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom to start">
          <IconButton variant="ghost" size="medium" aria-label="Center">
            <Crosshair size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom to fit">
          <IconButton variant="ghost" size="medium" aria-label="Fit">
            <Maximize2 size={14} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Mini map">
          <IconButton variant="ghost" size="medium" aria-label="Map">
            <MapIcon size={14} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
        <IconButton
          variant="ghost"
          size="medium"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(10, z - 10))}
        >
          <Minus size={14} />
        </IconButton>
        <Slider
          size="medium"
          value={zoom}
          onChange={(_, v) => setZoom(v as number)}
          min={10}
          max={100}
          sx={{ width: 100, mx: 2 }}
          aria-label="Zoom"
        />
        <IconButton
          variant="ghost"
          size="medium"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(100, z + 10))}
        >
          <Plus size={14} />
        </IconButton>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            minWidth: 36,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {zoom}%
        </Typography>
        <Tooltip title="Fullscreen">
          <IconButton variant="ghost" size="medium" aria-label="Fullscreen">
            <Maximize size={14} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
        <Button
          size="medium"
          onClick={onToggleAi}
          startIcon={<Sparkles size={14} />}
          sx={(theme) => ({
            borderRadius: `${theme.radius.pill}px`,
            bgcolor: alpha(
              theme.palette.primary.main,
              theme.palette.action.hoverOpacity * 2,
            ),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
            "&:hover": {
              bgcolor: alpha(
                theme.palette.primary.main,
                theme.palette.action.hoverOpacity * 3,
              ),
            },
          })}
        >
          AI Assistant
        </Button>
      </Paper>

      {/* AI panel */}
      {aiOpen && <AiPanel onClose={onToggleAi} />}
    </Box>
  );
}

// ─── AI Panel ────────────────────────────────────────────────────────────────

function AiPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([
    {
      role: "assistant",
      text: "Hi! I'm your pathway assistant. I can help you understand and navigate this clinical pathway. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setShowSuggestions(false);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Got it — I'm analyzing this pathway now. In a moment I'll surface relevant decision points and context.",
        },
      ]);
    }, 500);
  };

  const suggestions = [
    "Summarize this pathway",
    "What are the decision points?",
    "Suggest improvements for clarity",
  ];

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        position: "absolute",
        right: 20,
        bottom: 68,
        width: 360,
        height: 500,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: `${theme.radius.lg}px`,
        border: `1px solid ${theme.border.default}`,
        bgcolor: theme.surface.canvas,
        boxShadow: theme.elevation.high,
        zIndex: theme.zIndex.modal,
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[800],
          borderColor: theme.palette.grey[700],
        }),
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          py: 3,
          bgcolor: theme.surface.subtle,
          borderBottom: `1px solid ${theme.border.subtle}`,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[900],
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ color: "primary.main", display: "inline-flex" }}>
            <Sparkles size={20} />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "fontWeightSemibold" }}
            >
              Pathway Assistant
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.muted">
                Powered by Curbside Health AI
              </Typography>
              <Chip
                label="BETA"
                size="medium"
                variant="soft"
                color="info"
                sx={{ height: 16, fontSize: 9, fontWeight: "fontWeightBold" }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 0 }}>
          <Tooltip title="Pin">
            <IconButton variant="ghost" size="medium" aria-label="Pin">
              <Pin size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton
              variant="ghost"
              size="medium"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={14} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={(theme) => ({
              maxWidth: "85%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              px: 3,
              py: 2,
              borderRadius: `${theme.radius.md}px`,
              fontSize: theme.typography.body2.fontSize,
              lineHeight: 1.45,
              ...(m.role === "user"
                ? {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }
                : {
                    bgcolor: theme.surface.subtle,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.border.subtle}`,
                    ...theme.applyStyles("dark", {
                      bgcolor: theme.palette.grey[900],
                      borderColor: theme.palette.grey[700],
                    }),
                  }),
            })}
          >
            {m.text}
          </Box>
        ))}
        {showSuggestions && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {suggestions.map((s) => (
              <Button
                key={s}
                variant="outlined"
                color="neutral"
                size="medium"
                onClick={() => send(s)}
                sx={{ justifyContent: "flex-start", textAlign: "left" }}
              >
                {s}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={(theme) => ({
          p: 3,
          display: "flex",
          gap: 2,
          borderTop: `1px solid ${theme.border.subtle}`,
          ...theme.applyStyles("dark", {
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <OutlinedInput
          size="medium"
          fullWidth
          placeholder="Ask about this pathway…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                variant="ghost"
                size="medium"
                aria-label="Send"
                onClick={() => send(input)}
              >
                <Send size={14} />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Paper>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function PathwayEditorPage() {
  const [rail, setRail] = useState<RailKey>("shapes");
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <TopBar />
      <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Rail active={rail} onSelect={setRail} />
        <ShapesPanel />
        <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
          <CanvasArea aiOpen={aiOpen} onToggleAi={() => setAiOpen((o) => !o)} />
        </Box>
      </Box>
    </Box>
  );
}
