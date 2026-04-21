import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useState } from "react";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Download,
  Star,
  User,
  Heart,
  Settings,
  ChevronDown,
  Activity,
  Users,
  FileText,
  TrendingUp,
  Inbox,
  Search,
  Filter,
} from "lucide-react";
import { softTint, focusRing } from "@/theme/recipes";
import { CsStatCard } from "@/components/CsStatCard";
import { CsStatusDot } from "@/components/CsStatusDot";
import { CsEmptyState } from "@/components/CsEmptyState";
import { CsSectionHeader } from "@/components/CsSectionHeader";

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="overline"
        color="text.muted"
        sx={{ mb: 1, display: "block" }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: "block" }}
      >
        {label}
      </Typography>
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function ComponentShowcase() {
  return (
    <Box
      component="main"
      id="main-content"
      tabIndex={-1}
      sx={{ p: { xs: 3, md: 5 }, maxWidth: 900, mx: "auto" }}
    >
      <Typography variant="h4" gutterBottom>
        Component Showcase
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Every custom variant, color extension, and recipe from the Curbside
        Health design system.
      </Typography>

      {/* ── Buttons ── */}
      <Section title="Buttons">
        <Row label="contained (default)">
          <Button variant="contained">Save changes</Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
          <Button variant="contained" color="success">
            Approve
          </Button>
          <Button variant="contained" color="neutral">
            Neutral
          </Button>
          <Button variant="contained" disabled>
            Disabled
          </Button>
        </Row>
        <Row label="outlined">
          <Button variant="outlined">Cancel</Button>
          <Button variant="outlined" color="error">
            Remove
          </Button>
          <Button variant="outlined" color="neutral">
            Export
          </Button>
          <Button variant="outlined" disabled>
            Disabled
          </Button>
        </Row>
        <Row label="ghost (custom variant)">
          <Button variant="ghost">View details</Button>
          <Button
            variant="ghost"
            startIcon={<Edit2 size={14} aria-hidden="true" />}
          >
            Edit
          </Button>
          <Button variant="ghost" color="error">
            Discard
          </Button>
        </Row>
        <Row label="sizes">
          <Button variant="contained" size="small">
            Small
          </Button>
          <Button variant="contained" size="medium">
            Medium
          </Button>
          <Button variant="contained" size="large">
            Large
          </Button>
        </Row>
        <Row label="with icons">
          <Button
            variant="contained"
            startIcon={<Plus size={14} aria-hidden="true" />}
          >
            New pathway
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={14} aria-hidden="true" />}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={14} aria-hidden="true" />}
          >
            Delete
          </Button>
        </Row>
        <Row label="icon buttons">
          <Tooltip title="Edit">
            <IconButton aria-label="Edit" size="small">
              <Edit2 size={16} aria-hidden="true" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" size="small" color="error">
              <Trash2 size={16} aria-hidden="true" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton aria-label="Notifications" size="small">
              <Bell size={16} aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Row>
        <Row label="loading state pattern">
          <Button variant="contained" disabled sx={{ minWidth: 120 }}>
            <CircularProgress size={14} sx={{ mr: 1 }} aria-hidden="true" />
            Saving…
          </Button>
        </Row>
      </Section>

      {/* ── Cards ── */}
      <Section title="Cards">
        <Row label="outlined (default)">
          <Card sx={{ width: 260 }}>
            <CardHeader
              title="Sepsis Protocol v3"
              subheader="Updated 2 days ago"
              avatar={
                <Avatar
                  sx={(t) => ({
                    bgcolor: t.vars.palette.primary.main,
                    width: 32,
                    height: 32,
                  })}
                >
                  S
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Evidence-based pathway for early sepsis recognition across ICU
                and ED.
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Chip label="Published" color="success" size="small" />
                <Chip label="ICU" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ width: 260 }}>
            <CardHeader title="Discharge Checklist" subheader="Draft" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Standardized post-acute discharge steps for care transitions.
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Chip label="Draft" color="warning" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Row>

        <Row label="subtle — secondary panel, info tile (custom variant)">
          <Card variant="subtle" sx={{ width: 260 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Related resources
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uses <code>variant="subtle"</code> — <code>surface.subtle</code>{" "}
                bg + <code>border.subtle</code> stroke. One step above canvas,
                lower contrast than default.
              </Typography>
            </CardContent>
          </Card>
        </Row>

        <Row label="raised — featured / highlighted content (custom variant)">
          <Card variant="raised" sx={{ width: 260 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Featured pathway
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uses <code>variant="raised"</code> — <code>surface.raised</code>{" "}
                bg. Two steps above canvas, draws the eye without a shadow.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label="Featured" color="primary" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Row>

        <Row label="all three variants side by side">
          {(["outlined", "subtle", "raised"] as const).map((v) => (
            <Card
              key={v}
              variant={v as "outlined" | "subtle" | "raised"}
              sx={{ width: 180 }}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.muted"
                  sx={(theme) => ({ display: "block", mb: theme.space["2xs"] })}
                >
                  variant="{v}"
                </Typography>
                <Typography variant="body2">
                  {v === "outlined"
                    ? "Default card surface"
                    : v === "subtle"
                      ? "Subdued bg, subtle border"
                      : "Raised bg, default border"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Row>
      </Section>

      {/* ── Chips ── */}
      <Section title="Chips">
        <Row label="filled (default) — palette colors">
          <Chip label="Default" />
          <Chip label="Primary" color="primary" />
          <Chip label="Success" color="success" />
          <Chip label="Warning" color="warning" />
          <Chip label="Error" color="error" />
          <Chip label="Info" color="info" />
          <Chip label="Neutral" color="neutral" />
        </Row>
        <Row label="outlined — transparent fill, intent border">
          <Chip label="Default" variant="outlined" />
          <Chip label="Primary" variant="outlined" color="primary" />
          <Chip label="Success" variant="outlined" color="success" />
          <Chip label="Warning" variant="outlined" color="warning" />
          <Chip label="Error" variant="outlined" color="error" />
          <Chip label="Info" variant="outlined" color="info" />
          <Chip label="Neutral" variant="outlined" color="neutral" />
        </Row>
        <Row label="soft (custom variant) — softTint bg, no border">
          <Chip label="Default" variant="soft" />
          <Chip label="Primary" variant="soft" color="primary" />
          <Chip label="Success" variant="soft" color="success" />
          <Chip label="Warning" variant="soft" color="warning" />
          <Chip label="Error" variant="soft" color="error" />
          <Chip label="Info" variant="soft" color="info" />
          <Chip label="Neutral" variant="soft" color="neutral" />
        </Row>
        <Row label="with icon">
          <Chip
            variant="soft"
            label="Verified"
            color="success"
            icon={<Check size={12} aria-hidden="true" />}
          />
          <Chip
            variant="soft"
            label="Needs review"
            color="warning"
            icon={<AlertTriangle size={12} aria-hidden="true" />}
          />
          <Chip
            variant="outlined"
            label="Archived"
            icon={<XCircle size={12} aria-hidden="true" />}
          />
        </Row>
        <Row label="deletable">
          <Chip label="Cardiology" onDelete={() => {}} />
          <Chip
            label="ICU"
            variant="soft"
            color="primary"
            onDelete={() => {}}
          />
          <Chip
            label="ED"
            variant="outlined"
            color="error"
            onDelete={() => {}}
          />
        </Row>
      </Section>

      {/* ── Alerts ── */}
      <Section title="Alerts">
        <Row label="outlined (default) — intent border, subtle bg">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Alert severity="info">
              This pathway has been updated. Review changes before publishing.
            </Alert>
            <Alert severity="success">
              Pathway published successfully and is now live for all clinicians.
            </Alert>
            <Alert severity="warning">
              3 required fields are incomplete. Complete them before submitting
              for review.
            </Alert>
            <Alert severity="error">
              Failed to save changes. Please check your connection and try
              again.
            </Alert>
          </Box>
        </Row>
        <Row label="filled — solid bg, white text">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Alert variant="filled" severity="info">
              Scheduled maintenance window tonight from 2–4 am.
            </Alert>
            <Alert variant="filled" severity="success">
              All checks passed. Pathway is ready to publish.
            </Alert>
            <Alert variant="filled" severity="warning">
              Your session will expire in 5 minutes.
            </Alert>
            <Alert variant="filled" severity="error">
              Access denied. Contact your administrator.
            </Alert>
          </Box>
        </Row>
        <Row label="soft (custom variant) — softTint bg, no border, icon inherits color">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Alert variant="soft" severity="info">
              New comment added to the Fall Prevention pathway.
            </Alert>
            <Alert variant="soft" severity="success">
              Draft auto-saved at 10:42 am.
            </Alert>
            <Alert variant="soft" severity="warning">
              This pathway has unpublished changes.
            </Alert>
            <Alert variant="soft" severity="error">
              One or more steps are missing required evidence links.
            </Alert>
          </Box>
        </Row>
      </Section>

      {/* ── Form fields ── */}
      <Section title="Form fields">
        <Row label="states">
          <TextField
            label="Default"
            placeholder="Enter value"
            helperText="Helper text"
          />
          <TextField
            label="With value"
            defaultValue="jordan.rivera@example.com"
            helperText=" "
          />
          <TextField
            label="Error state"
            error
            defaultValue="invalid-email"
            helperText="Enter a valid email address."
          />
          <TextField
            label="Disabled"
            disabled
            defaultValue="Read only"
            helperText=" "
          />
        </Row>
        <Row label="types">
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            helperText=" "
          />
          <TextField
            label="Password"
            type="password"
            defaultValue="secret"
            helperText=" "
          />
          <TextField
            label="Search"
            placeholder="Search pathways…"
            helperText=" "
          />
        </Row>
        <Row label="multiline">
          <TextField
            label="Notes"
            multiline
            rows={3}
            placeholder="Add clinical notes…"
            sx={{ width: 320 }}
            helperText=" "
          />
        </Row>
        <Row label="switches">
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email notifications"
          />
          <FormControlLabel control={<Switch />} label="Push notifications" />
          <FormControlLabel control={<Switch disabled />} label="Disabled" />
        </Row>
        <Row label="input color=ghost — borderless at rest, appears on hover/focus">
          <FormControl sx={{ width: 240 }}>
            <InputLabel htmlFor="input-ghost">Search pathways</InputLabel>
            <OutlinedInput
              id="input-ghost"
              label="Search pathways"
              color="ghost"
              placeholder="Search…"
            />
          </FormControl>
          <FormControl sx={{ width: 240 }}>
            <InputLabel htmlFor="input-ghost-val">Assigned user</InputLabel>
            <OutlinedInput
              id="input-ghost-val"
              label="Assigned user"
              color="ghost"
              defaultValue="Dr. Rivera"
            />
          </FormControl>
        </Row>
        <Row label="input color=soft — tinted surface background">
          <FormControl sx={{ width: 240 }}>
            <InputLabel htmlFor="input-soft">Quick filter</InputLabel>
            <OutlinedInput
              id="input-soft"
              label="Quick filter"
              color="soft"
              placeholder="Filter…"
            />
          </FormControl>
          <FormControl sx={{ width: 240 }}>
            <InputLabel htmlFor="input-soft-val">Clinical notes</InputLabel>
            <OutlinedInput
              id="input-soft-val"
              label="Clinical notes"
              color="soft"
              defaultValue="Patient is stable"
            />
          </FormControl>
        </Row>
        <Row label="switch color=soft — muted track, primary thumb on checked">
          <FormControlLabel
            control={<Switch color="soft" defaultChecked />}
            label="Pathway updates"
          />
          <FormControlLabel
            control={<Switch color="soft" />}
            label="Push notifications"
          />
          <FormControlLabel
            control={<Switch color="soft" disabled defaultChecked />}
            label="Disabled"
          />
        </Row>
      </Section>

      {/* ── Surface & border tokens ── */}
      <Section title="Surface & border tokens">
        <Row label="theme.surface.*">
          {(["canvas", "subtle", "raised", "overlay"] as const).map((s) => (
            <Box
              key={s}
              sx={(theme) => ({
                width: 140,
                p: 2,
                borderRadius: `${theme.radius.md}px`,
                backgroundColor: theme.surface[s],
                border: `1px solid ${theme.border.default}`,
                ...theme.applyStyles("dark", {
                  backgroundColor:
                    s === "canvas"
                      ? theme.palette.grey[900]
                      : s === "subtle"
                        ? theme.palette.grey[800]
                        : s === "raised"
                          ? theme.palette.grey[700]
                          : theme.palette.grey[800],
                }),
              })}
            >
              <Typography variant="caption" color="text.secondary">
                surface.{s}
              </Typography>
            </Box>
          ))}
        </Row>
        <Row label="theme.border.*">
          {(["subtle", "default", "strong"] as const).map((b) => (
            <Box
              key={b}
              sx={(theme) => ({
                width: 140,
                p: 2,
                borderRadius: `${theme.radius.md}px`,
                backgroundColor: theme.surface.canvas,
                border: `2px solid`,
                borderColor: theme.border[b],
                ...theme.applyStyles("dark", {
                  backgroundColor: theme.palette.grey[900],
                  borderColor:
                    b === "subtle"
                      ? theme.palette.grey[700]
                      : b === "default"
                        ? theme.palette.grey[600]
                        : theme.palette.grey[500],
                }),
              })}
            >
              <Typography variant="caption" color="text.secondary">
                border.{b}
              </Typography>
            </Box>
          ))}
        </Row>
        <Row label="theme.radius.*">
          {(
            [
              ["sm", 4],
              ["md", 6],
              ["lg", 8],
              ["pill", 9999],
            ] as const
          ).map(([name]) => (
            <Box
              key={name}
              sx={(theme) => ({
                width: name === "pill" ? 96 : 64,
                height: 40,
                borderRadius: `${theme.radius[name]}px`,
                backgroundColor: theme.fill.default,
                border: `1px solid ${theme.border.default}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...theme.applyStyles("dark", {
                  backgroundColor: theme.palette.grey[700],
                  borderColor: theme.palette.grey[600],
                }),
              })}
            >
              <Typography variant="caption" color="text.secondary">
                {name}
              </Typography>
            </Box>
          ))}
        </Row>
      </Section>

      {/* ── focusRing recipe ── */}
      <Section title="focusRing recipe">
        <Row label="tab into these inputs to see the focusRing recipe applied">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Focus me"
              helperText="focusRing(theme) via MuiOutlinedInput override"
              sx={{ width: 280 }}
            />
            <Button
              variant="outlined"
              sx={(theme) => ({ '&:focus-visible': focusRing(theme) })}
            >
              Focus me
            </Button>
          </Box>
        </Row>
      </Section>

      {/* ── Avatars & Badges ── */}
      <Section title="Avatars & Badges">
        <Row label="avatar sizes with intent fills">
          {(["primary", "success", "error", "warning"] as const).map(
            (color) => (
              <Avatar
                key={color}
                sx={(t) => ({
                  bgcolor: t.vars.palette[color].main,
                  width: 40,
                  height: 40,
                })}
              >
                {color[0].toUpperCase()}
              </Avatar>
            ),
          )}
        </Row>
        <Row label="variant=soft — tinted background, neutral default then intent colors">
          <Avatar variant="soft">JR</Avatar>
          {(["primary", "secondary", "error", "warning", "info", "success"] as const).map((color) => (
            <Avatar key={color} variant="soft" color={color}>
              {color[0].toUpperCase()}
            </Avatar>
          ))}
        </Row>
        <Row label="variant=outlined — ring border, neutral default then intent colors">
          <Avatar variant="outlined">JR</Avatar>
          {(["primary", "secondary", "error", "warning", "info", "success"] as const).map((color) => (
            <Avatar key={color} variant="outlined" color={color}>
              {color[0].toUpperCase()}
            </Avatar>
          ))}
        </Row>
        <Row label="soft + outlined combined with MUI shape variants">
          <Avatar variant="soft" color="primary">AB</Avatar>
          <Avatar variant="soft" color="primary" sx={{ borderRadius: 1 }}>AB</Avatar>
          <Avatar variant="outlined" color="success">CD</Avatar>
          <Avatar variant="outlined" color="error" sx={{ borderRadius: 1 }}>CD</Avatar>
        </Row>
      </Section>

      {/* ── Typography scale ── */}
      <Section title="Typography scale">
        {(
          [
            ["h1", "Heading 1 — Page title"],
            ["h2", "Heading 2 — Section title"],
            ["h3", "Heading 3 — Sub-section"],
            ["h4", "Heading 4 — Card title"],
            ["h5", "Heading 5 — Group label"],
            ["h6", "Heading 6 — Dense label"],
            ["subtitle1", "Subtitle 1 — Supporting header"],
            ["subtitle2", "Subtitle 2 — Field label"],
            [
              "body1",
              "Body 1 — Default reading text used in descriptions and paragraphs.",
            ],
            [
              "body2",
              "Body 2 — Smaller body for compact contexts and helper copy.",
            ],
            ["caption", "Caption — Timestamps, counts, meta"],
            ["overline", "Overline — section category label"],
            ["button", "Button — interactive label"],
          ] as const
        ).map(([variant, text]) => (
          <Box
            key={variant}
            sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 1 }}
          >
            <Typography
              variant="caption"
              color="text.muted"
              sx={{ width: 80, flexShrink: 0 }}
            >
              {variant}
            </Typography>
            <Typography variant={variant}>{text}</Typography>
          </Box>
        ))}
        <Box sx={{ mt: 2, display: "flex", gap: 3, flexWrap: "wrap" }}>
          {(
            [
              ["fontWeightLight", 300],
              ["fontWeightRegular", 400],
              ["fontWeightMedium", 500],
              ["fontWeightSemibold", 600],
              ["fontWeightBold", 700],
            ] as const
          ).map(([name, w]) => (
            <Typography key={name} variant="body1" fontWeight={w}>
              {name} ({w})
            </Typography>
          ))}
        </Box>
      </Section>

      {/* ── Palette intentions ── */}
      <Section title="Palette intentions">
        <Row label="main colors">
          {(
            [
              "primary",
              "secondary",
              "error",
              "warning",
              "info",
              "success",
              "neutral",
            ] as const
          ).map((color) => (
            <Box
              key={color}
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: theme.space["2xs"],
                alignItems: "center",
              })}
            >
              <Box
                sx={(t) => ({
                  width: 48,
                  height: 48,
                  borderRadius: `${t.radius.md}px`,
                  bgcolor: t.vars.palette[color].main,
                  border: `1px solid ${t.border.subtle}`,
                })}
              />
              <Typography variant="caption" color="text.secondary">
                {color}
              </Typography>
            </Box>
          ))}
        </Row>
        <Row label="text hierarchy">
          {(["primary", "secondary", "muted", "disabled"] as const).map(
            (variant) => (
              <Typography
                key={variant}
                variant="body1"
                color={`text.${variant}`}
              >
                text.{variant}
              </Typography>
            ),
          )}
        </Row>
      </Section>

      {/* ── Elevation ── */}
      <Section title="Elevation (three levels only)">
        <Row label="elevation.none / low / high">
          {(
            [
              ["none", 0, "Cards, default containers"],
              ["low", 2, "Dropdowns, popovers"],
              ["high", 4, "Modals, dialogs"],
            ] as const
          ).map(([name, _idx, desc]) => (
            <Box
              key={name}
              sx={(t) => ({
                p: 2,
                width: 180,
                borderRadius: `${t.radius.lg}px`,
                backgroundColor: t.surface.overlay,
                boxShadow: t.shadows[t.elevation[name]],
                border:
                  name === "none" ? `1px solid ${t.border.default}` : "none",
                ...t.applyStyles("dark", {
                  backgroundColor: t.palette.grey[800],
                }),
              })}
            >
              <Typography variant="subtitle2">elevation.{name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {desc}
              </Typography>
            </Box>
          ))}
        </Row>
      </Section>

      {/* ── motion ── */}
      <Section title="Motion roles">
        <Row label="hover over each box to see the motion role in action">
          {(["short", "standard", "complex"] as const).map((role) => (
            <Box
              key={role}
              sx={(t) => ({
                p: 2,
                width: 160,
                borderRadius: `${t.radius.lg}px`,
                backgroundColor: t.surface.subtle,
                border: `1px solid ${t.border.default}`,
                cursor: "pointer",
                transition: t.motion[role],
                "&:hover": {
                  backgroundColor: t.vars.palette.primary.main,
                  color: t.vars.palette.primary.contrastText,
                  borderColor: t.vars.palette.primary.main,
                },
                ...t.applyStyles("dark", {
                  backgroundColor: t.palette.grey[800],
                  borderColor: t.palette.grey[700],
                }),
              })}
            >
              <Typography variant="subtitle2">motion.{role}</Typography>
              <Typography variant="caption" color="inherit">
                Hover me
              </Typography>
            </Box>
          ))}
        </Row>
      </Section>

      {/* ── fill tokens ── */}
      <Section title="Fill tokens">
        <Row label="theme.fill.* — for chips, tags, filled shapes on a surface">
          {(["default", "emphasis", "selected"] as const).map((f) => (
            <Box
              key={f}
              sx={(t) => ({
                px: 2,
                py: 1,
                borderRadius: `${t.radius.sm}px`,
                backgroundColor: t.fill[f],
                ...t.applyStyles("dark", {
                  backgroundColor:
                    f === "default"
                      ? t.palette.grey[700]
                      : f === "emphasis"
                        ? t.palette.grey[600]
                        : t.palette.action.selected,
                }),
              })}
            >
              <Typography variant="body2">fill.{f}</Typography>
            </Box>
          ))}
        </Row>
      </Section>

      {/* ── misc components ── */}
      <Section title="Misc — tooltips, loading, progress">
        <Row label="tooltips">
          <Tooltip title="View pathway history">
            <Button variant="outlined" size="small">
              Hover me
            </Button>
          </Tooltip>
          <Tooltip title="Requires admin permission">
            <span>
              <Button variant="outlined" size="small" disabled>
                Disabled with tooltip
              </Button>
            </span>
          </Tooltip>
        </Row>
        <Row label="loading states">
          <CircularProgress size={20} aria-label="Loading" />
          <CircularProgress size={28} color="success" aria-label="Loading" />
          <CircularProgress size={36} color="error" aria-label="Loading" />
        </Row>
        <Row label="favorite / action icons">
          {[Heart, Star, Settings].map((Icon, i) => (
            <IconButton key={i} aria-label={`Action ${i}`} size="small">
              <Icon size={18} aria-hidden="true" />
            </IconButton>
          ))}
        </Row>
      </Section>

      {/* ── Icon Buttons ── */}
      <Section title="Icon Buttons (new variants)">
        <Row label="variant=contained — solid fill, intent colors">
          {(["primary", "success", "error", "warning", "info", "neutral"] as const).map(
            (color) => (
              <Tooltip key={color} title={color}>
                <IconButton variant="contained" color={color} aria-label={color}>
                  <Activity size={18} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            )
          )}
        </Row>
        <Row label="variant=soft — tinted fill, intent colors">
          {(["primary", "success", "error", "warning", "info", "neutral"] as const).map(
            (color) => (
              <Tooltip key={color} title={color}>
                <IconButton variant="soft" color={color} aria-label={color}>
                  <Activity size={18} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            )
          )}
        </Row>
        <Row label="variant=ghost — transparent at rest, colored on hover">
          {(["primary", "success", "error", "warning", "info", "neutral"] as const).map(
            (color) => (
              <Tooltip key={color} title={color}>
                <IconButton variant="ghost" color={color} aria-label={color}>
                  <Activity size={18} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            )
          )}
        </Row>
        <Row label="sizes — small / medium / large">
          <IconButton variant="contained" size="small" aria-label="small">
            <Edit2 size={14} aria-hidden="true" />
          </IconButton>
          <IconButton variant="contained" size="medium" aria-label="medium">
            <Edit2 size={18} aria-hidden="true" />
          </IconButton>
          <IconButton variant="contained" size="large" aria-label="large">
            <Edit2 size={22} aria-hidden="true" />
          </IconButton>
          <IconButton variant="soft" size="small" color="error" aria-label="delete small">
            <Trash2 size={14} aria-hidden="true" />
          </IconButton>
          <IconButton variant="soft" size="medium" color="error" aria-label="delete medium">
            <Trash2 size={18} aria-hidden="true" />
          </IconButton>
          <IconButton variant="ghost" size="small" color="neutral" aria-label="settings">
            <Settings size={14} aria-hidden="true" />
          </IconButton>
        </Row>
      </Section>

      {/* ── Linear Progress ── */}
      <Section title="Linear Progress (rounded, themed)">
        <Row label="determinate — intent colors, rounded pill track">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            {(
              [
                ["primary", 72],
                ["success", 88],
                ["warning", 45],
                ["error",   22],
                ["info",    60],
                ["neutral", 55],
              ] as const
            ).map(([color, value]) => (
              <Box key={color} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="caption"
                  color="text.muted"
                  sx={{ width: 56, flexShrink: 0 }}
                >
                  {color}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    color={color}
                    aria-label={`${color} progress ${value}%`}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ width: 32 }}>
                  {value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Row>
        <Row label="indeterminate — animated">
          <Box sx={{ width: "100%" }}>
            <LinearProgress aria-label="Loading" />
          </Box>
        </Row>
      </Section>

      {/* ── Tabs ── */}
      <TabsSection />

      {/* ── Accordion ── */}
      <Section title="Accordion (themed)">
        <Row label="default — outlined, rounded, clean base styles">
          <Box sx={{ width: "100%" }}>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Typography variant="subtitle2">What is a clinical pathway?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  A clinical pathway is a structured, evidence-based plan of care for
                  patients with specific conditions, outlining expected treatment steps
                  and timelines.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Typography variant="subtitle2">How do I publish a pathway?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Once all required fields are complete and the pathway has been reviewed,
                  click "Submit for review" and an admin will approve it for publication.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Typography variant="subtitle2">Archived section (disabled)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">Not accessible.</Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Row>
        <Row label="variant=soft — surface.subtle background">
          <Box sx={{ width: "100%" }}>
            <Accordion variant="soft">
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Typography variant="subtitle2">Evidence links</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Attach published guidelines or clinical studies to this step.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion variant="soft">
              <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                <Typography variant="subtitle2">Decision criteria</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Define the branch logic that determines which route a patient follows.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Row>
      </Section>

      {/* ── Stat Cards ── */}
      <Section title="CsStatCard — KPI metric card">
        <Row label="with icon + trend indicator">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
            <CsStatCard
              label="Active Pathways"
              value="142"
              delta="+12 this month"
              trend="up"
              color="primary"
              icon={<FileText size={16} />}
            />
            <CsStatCard
              label="Enrolled Patients"
              value="3,841"
              delta="+8.4% vs last month"
              trend="up"
              color="success"
              icon={<Users size={16} />}
            />
            <CsStatCard
              label="Avg. Completion"
              value="76%"
              delta="-3% vs target"
              trend="down"
              color="warning"
              icon={<TrendingUp size={16} />}
            />
            <CsStatCard
              label="Pending Reviews"
              value="9"
              color="error"
              icon={<Activity size={16} />}
            />
          </Box>
        </Row>
        <Row label="no icon, neutral trend">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <CsStatCard label="Total Steps" value="2,390" delta="no change" trend="neutral" />
            <CsStatCard label="Draft Pathways" value="18" />
          </Box>
        </Row>
      </Section>

      {/* ── Status Dot ── */}
      <Section title="CsStatusDot — presence indicator">
        <Row label="all statuses — dot only">
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <CsStatusDot key={status} status={status} size="md" />
          ))}
        </Row>
        <Row label="with label — showLabel=true">
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <CsStatusDot key={status} status={status} size="md" showLabel />
          ))}
        </Row>
        <Row label="sizes — sm / md / lg">
          <CsStatusDot status="online" size="sm" showLabel />
          <CsStatusDot status="online" size="md" showLabel />
          <CsStatusDot status="online" size="lg" showLabel />
        </Row>
        <Row label="in context — avatar + status overlay pattern">
          {(["online", "away", "busy", "offline"] as const).map((status) => (
            <Box key={status} sx={{ position: "relative", display: "inline-flex" }}>
              <Avatar variant="soft" color="primary" sx={{ width: 40, height: 40 }}>
                JR
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  p: 1,
                  borderRadius: "50%",
                  backgroundColor: "background.paper",
                }}
              >
                <CsStatusDot status={status} size="sm" />
              </Box>
            </Box>
          ))}
        </Row>
      </Section>

      {/* ── Empty State ── */}
      <Section title="CsEmptyState — zero-data placeholder">
        <Row label="with icon, description, and action">
          <Box sx={{ width: "100%" }}>
            <CsEmptyState
              icon={<Inbox size={28} />}
              title="No pathways yet"
              description="Create your first clinical pathway to start standardising care delivery across your team."
              action={{ label: "Create pathway", onClick: () => {} }}
            />
          </Box>
        </Row>
        <Row label="search / filter empty — no icon, short copy">
          <Box sx={{ width: "100%" }}>
            <CsEmptyState
              title="No results found"
              description='Try adjusting your filters or searching with different keywords.'
              action={{ label: "Clear filters", onClick: () => {}, variant: "ghost" }}
            />
          </Box>
        </Row>
        <Row label="minimal — title only">
          <Box sx={{ width: "100%" }}>
            <CsEmptyState title="Nothing here yet" />
          </Box>
        </Row>
      </Section>

      {/* ── Section Header ── */}
      <Section title="CsSectionHeader — titled content block">
        <Row label="variant=divider — title + bottom border">
          <Box sx={{ width: "100%" }}>
            <CsSectionHeader variant="divider" title="Team members" />
            <Typography variant="body2" color="text.secondary">
              Content beneath the header.
            </Typography>
          </Box>
        </Row>
        <Row label="variant=divider + subtitle + action">
          <Box sx={{ width: "100%" }}>
            <CsSectionHeader
              variant="divider"
              title="Active pathways"
              subtitle="Pathways currently available to clinicians"
              action={
                <Button variant="contained" size="small" startIcon={<Plus size={14} />}>
                  New pathway
                </Button>
              }
            />
            <Typography variant="body2" color="text.secondary">
              Content beneath the header.
            </Typography>
          </Box>
        </Row>
        <Row label="variant=default (no divider)">
          <Box sx={{ width: "100%" }}>
            <CsSectionHeader
              title="Related resources"
              subtitle="Linked guidelines and evidence"
              action={
                <Button variant="ghost" size="small" startIcon={<Filter size={14} />}>
                  Filter
                </Button>
              }
            />
            <Typography variant="body2" color="text.secondary">
              Content sits tightly below the header.
            </Typography>
          </Box>
        </Row>
      </Section>
    </Box>
  );
}

// ─── Tabs section (needs local state) ────────────────────────────────────────
function TabsSection() {
  const [tab1, setTab1] = useState(0);
  const [tab2, setTab2] = useState(0);
  const [tab3, setTab3] = useState(1);

  return (
    <Section title="Tabs (standard + pills variant)">
      <Row label="standard — underline indicator (default)">
        <Tabs value={tab1} onChange={(_, v) => setTab1(v)} aria-label="standard tabs">
          <Tab label="Overview" />
          <Tab label="Pathways" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>
      </Row>
      <Row label="standard — with icons">
        <Tabs value={tab2} onChange={(_, v) => setTab2(v)} aria-label="icon tabs">
          <Tab icon={<Activity size={16} />} iconPosition="start" label="Activity" />
          <Tab icon={<Users size={16} />} iconPosition="start" label="Team" />
          <Tab icon={<FileText size={16} />} iconPosition="start" label="Docs" />
        </Tabs>
      </Row>
      <Row label="variant=pills — segmented pill tabs (custom variant)">
        <Tabs
          value={tab3}
          onChange={(_, v) => setTab3(v)}
          variant="pills"
          aria-label="pill tabs"
        >
          <Tab label="All" />
          <Tab label="Published" />
          <Tab label="Draft" />
          <Tab label="Archived" />
        </Tabs>
      </Row>
      <Row label="variant=pills — with icons">
        <Tabs
          value={tab1}
          onChange={(_, v) => setTab1(v)}
          variant="pills"
          aria-label="pill tabs with icons"
        >
          <Tab icon={<Activity size={15} />} iconPosition="start" label="Activity" />
          <Tab icon={<Users size={15} />} iconPosition="start" label="Team" />
          <Tab icon={<Search size={15} />} iconPosition="start" label="Search" />
        </Tabs>
      </Row>
    </Section>
  );
}
