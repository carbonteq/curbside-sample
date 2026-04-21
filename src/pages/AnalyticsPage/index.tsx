import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import { Users, Eye, Activity, ShoppingCart, TrendingUp, TrendingDown, Minus, X, Maximize2, Minimize2, Monitor, Cloud } from "lucide-react";
import { CsStatCard } from "../../components/CsStatCard";

type DateRange = "7D" | "30D" | "3M" | "6M" | "12M";
type DataSource = "PLATFORM" | "EHR";

// --- Spark bar chart ---
interface SparkBarProps { data: number[]; color: string }
function SparkBar({ data, color }: SparkBarProps) {
  const max = Math.max(...data);
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 60, mt: 1 }}>
      {data.map((v, i) => (
        <Box
          key={i}
          sx={(theme) => ({
            flex: 1,
            height: `${(v / max) * 100}%`,
            minHeight: 3,
            bgcolor: color,
            borderRadius: `${theme.radius.sm}px ${theme.radius.sm}px 0 0`,
            opacity: i === data.length - 1 ? 1 : 0.5,
            transition: theme.motion.standard,
          })}
        />
      ))}
    </Box>
  );
}

// --- Spark line chart (SVG polyline) ---
interface SparkLineProps { data: number[]; color: string }
function SparkLine({ data, color }: SparkLineProps) {
  const w = 200;
  const h = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <Box sx={{ mt: 1 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={60} style={{ overflow: "visible" }}>
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts} />
        <polyline fill="url(#grad)" stroke="none" points={`0,${h} ${pts} ${w},${h}`} opacity={0.15} />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
}

// --- Mock data by range ---
const RANGE_DATA: Record<DateRange, {
  activeUsers: number; pageViews: number; sessions: number; orders: number;
  trend: { activeUsers: number; pageViews: number; sessions: number; orders: number };
  usersBars: number[]; viewsLine: number[]; sessionsBars: number[]; ordersBars: number[];
}> = {
  "7D":  {
    activeUsers: 412,  pageViews: 9841,   sessions: 1876,  orders: 387,
    trend: { activeUsers: 8, pageViews: 12, sessions: 3, orders: -2 },
    usersBars:    [38, 45, 51, 39, 62, 58, 72],
    viewsLine:    [820, 950, 1120, 890, 1380, 1290, 1391],
    sessionsBars: [210, 280, 310, 245, 398, 350, 448],
    ordersBars:   [42, 58, 71, 49, 68, 55, 44],
  },
  "30D": {
    activeUsers: 1284, pageViews: 48391,  sessions: 9847,  orders: 2156,
    trend: { activeUsers: 12, pageViews: 8, sessions: 5, orders: -2 },
    usersBars:    [82, 91, 78, 103, 115, 98, 126, 119, 134, 108, 142, 138, 155, 148, 162, 157, 171, 164, 178, 170, 184, 179, 191, 186, 198, 190, 204, 199, 211, 203],
    viewsLine:    [1200, 1450, 1320, 1680, 1890, 1760, 2100, 1980, 2240, 2080, 2390, 2250, 2560, 2420, 2710, 2580, 2860, 2730, 3010, 2880, 3160, 3030, 3310, 3180, 3460, 3330, 3610, 3480, 3761, 3631],
    sessionsBars: [280, 310, 290, 340, 380, 360, 415, 395, 445, 420, 470, 448, 495, 472, 520, 498, 545, 522, 568, 545, 592, 569, 615, 592, 638, 615, 661, 638, 684, 661],
    ordersBars:   [55, 72, 63, 88, 95, 81, 110, 98, 125, 112, 140, 128, 155, 142, 170, 158, 185, 172, 200, 188, 215, 202, 230, 218, 245, 232, 260, 248, 275, 263],
  },
  "3M":  {
    activeUsers: 3840, pageViews: 142750, sessions: 29500, orders: 6420,
    trend: { activeUsers: 18, pageViews: 22, sessions: 11, orders: 7 },
    usersBars:    [310, 340, 380, 420, 460, 500, 540, 580, 620, 660, 700, 740],
    viewsLine:    [9800, 10500, 11200, 12100, 12900, 13800, 14700, 15600, 16500, 17400, 18300, 19200],
    sessionsBars: [1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000],
    ordersBars:   [420, 460, 500, 540, 580, 620, 660, 700, 740, 780, 820, 860],
  },
  "6M":  {
    activeUsers: 7200, pageViews: 295000, sessions: 58000, orders: 13100,
    trend: { activeUsers: 24, pageViews: 31, sessions: 19, orders: 15 },
    usersBars:    [980, 1050, 1120, 1200, 1280, 1380],
    viewsLine:    [38000, 42000, 46000, 51000, 55000, 63000],
    sessionsBars: [7800, 8500, 9200, 10100, 10800, 11600],
    ordersBars:   [1800, 1950, 2100, 2280, 2450, 2620],
  },
  "12M": {
    activeUsers: 13500, pageViews: 580000, sessions: 112000, orders: 24800,
    trend: { activeUsers: 38, pageViews: 45, sessions: 29, orders: 22 },
    usersBars:    [820, 900, 980, 1060, 1140, 1220, 1300, 1380, 1460, 1540, 1620, 1700],
    viewsLine:    [32000, 36000, 40000, 44000, 48000, 52000, 56000, 60000, 64000, 68000, 72000, 76000],
    sessionsBars: [5800, 6400, 7100, 7900, 8700, 9500, 10300, 11100, 11900, 12700, 13500, 14300],
    ordersBars:   [1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600],
  },
};

const TOP_CONTENT = [
  { title: "Chest Pain Triage Pathway",      views: 2156, change: 18 },
  { title: "Hand Hygiene Compliance Doc",     views: 1765, change: 5  },
  { title: "Code Blue Response Workflow",     views: 1091, change: -3 },
  { title: "Sepsis Management Bundle",        views: 1284, change: 12 },
  { title: "Medication Reconciliation Flow",  views: 988,  change: 7  },
];

const TOP_USERS = [
  { name: "Maya Patel",      initials: "MP", role: "Physician",     sessions: 84 },
  { name: "Jordan Rivera",   initials: "JR", role: "Clinical Lead", sessions: 71 },
  { name: "Sofia Marchetti", initials: "SM", role: "Physician",     sessions: 65 },
  { name: "Ethan Brooks",    initials: "EB", role: "Clinical Lead", sessions: 58 },
  { name: "Dev Kapoor",      initials: "DK", role: "Nurse",         sessions: 52 },
];

function fmtValue(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString();
}
function fmtDelta(v: number) {
  return `${v > 0 ? "+" : ""}${v}% vs prev.`;
}
function toTrend(v: number): "up" | "down" | "neutral" {
  return v > 0 ? "up" : v < 0 ? "down" : "neutral";
}

interface ChartCardProps {
  title: string; description: string; chart: React.ReactNode;
  hidden: boolean; onHide: () => void; width: 1 | 2;
  onExpand: () => void; onShrink: () => void;
}
function ChartCard({ title, description, chart, hidden, onHide, width, onExpand, onShrink }: ChartCardProps) {
  if (hidden) return null;
  return (
    <Card
      variant="subtle"
      sx={(theme) => ({
        height: "100%",
        border: `1px solid ${theme.border.subtle}`,
        transition: theme.motion.standard,
        "&:hover": { borderColor: theme.border.default },
      })}
    >
      <CardContent sx={{ p: 6, "&:last-child": { pb: 6 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="caption" color="text.muted">{description}</Typography>
          </Box>
          <Box
            sx={(theme) => ({
              display: "flex",
              gap: 1,
              opacity: 0,
              ".MuiCard-root:hover &": { opacity: 1 },
              transition: theme.motion.short,
            })}
          >
            {width < 2 && (
              <Tooltip title="Expand">
                <IconButton size="small" onClick={onExpand} aria-label={`Expand ${title} chart`}><Maximize2 size={12} aria-hidden="true" /></IconButton>
              </Tooltip>
            )}
            {width > 1 && (
              <Tooltip title="Shrink">
                <IconButton size="small" onClick={onShrink} aria-label={`Shrink ${title} chart`}><Minimize2 size={12} aria-hidden="true" /></IconButton>
              </Tooltip>
            )}
            <Tooltip title="Hide">
              <IconButton size="small" onClick={onHide} aria-label={`Hide ${title} chart`}><X size={12} aria-hidden="true" /></IconButton>
            </Tooltip>
          </Box>
        </Box>
        {chart}
      </CardContent>
    </Card>
  );
}

export function AnalyticsPage() {
  const theme = useTheme();
  const [range,  setRange]  = useState<DateRange>("30D");
  const [source, setSource] = useState<DataSource>("PLATFORM");
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [widths, setWidths] = useState<Record<string, 1 | 2>>({ views: 2 });

  const d = RANGE_DATA[range];

  const hide   = (id: string) => setHidden(h => ({ ...h, [id]: true }));
  const expand = (id: string) => setWidths(w => ({ ...w, [id]: Math.min(2, (w[id] || 1) + 1) as 1 | 2 }));
  const shrink = (id: string) => setWidths(w => ({ ...w, [id]: Math.max(1, (w[id] || 1) - 1) as 1 | 2 }));

  const hiddenCards = Object.entries(hidden).filter(([, v]) => v).map(([k]) => k);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>Analytics</Typography>
          <Typography variant="body1" color="text.secondary">
            Platform usage, content engagement, and clinical activity metrics.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <ToggleButtonGroup value={source} exclusive onChange={(_, v) => v && setSource(v)} size="small" aria-label="Data source">
            <ToggleButton value="PLATFORM" aria-label="Platform data">
              <Box component="span" sx={{ display: "flex", mr: 1 }}><Monitor size={14} aria-hidden="true" /></Box>
              Platform
            </ToggleButton>
            <ToggleButton value="EHR" aria-label="EHR data">
              <Box component="span" sx={{ display: "flex", mr: 1 }}><Cloud size={14} aria-hidden="true" /></Box>
              EHR
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup value={range} exclusive onChange={(_, v) => v && setRange(v)} size="small" aria-label="Date range">
            {(["7D", "30D", "3M", "6M", "12M"] as DateRange[]).map(r => (
              <ToggleButton key={r} value={r} aria-label={r}>{r}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Hidden cards notice */}
      {hiddenCards.length > 0 && (
        <Box
          sx={(theme) => ({
            mb: 2,
            px: 2,
            py: 1,
            borderRadius: `${theme.radius.md}px`,
            bgcolor: theme.surface.subtle,
            border: `1px solid ${theme.border.subtle}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          })}
        >
          <Typography variant="caption" color="text.secondary">Hidden cards:</Typography>
          {hiddenCards.map(id => (
            <Chip key={id} label={id} size="small" variant="soft" color="neutral" onDelete={() => setHidden(h => ({ ...h, [id]: false }))} />
          ))}
        </Box>
      )}

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {!hidden["users"] && (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box sx={{ position: "relative", "&:hover .cs-hide-btn": { opacity: 1 } }}>
              <CsStatCard label="Active Users" value={fmtValue(d.activeUsers)}
                delta={fmtDelta(d.trend.activeUsers)} trend={toTrend(d.trend.activeUsers)}
                icon={<Users size={16} aria-hidden="true" />} color="primary" />
              <Tooltip title="Hide card">
                <IconButton className="cs-hide-btn" size="small" onClick={() => hide("users")} aria-label="Hide Active Users card"
                  sx={(theme) => ({ position: "absolute", top: 8, right: 8, opacity: 0, transition: theme.motion.short })}>
                  <X size={12} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        )}
        {!hidden["pageviews"] && (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box sx={{ position: "relative", "&:hover .cs-hide-btn": { opacity: 1 } }}>
              <CsStatCard label="Page Views" value={fmtValue(d.pageViews)}
                delta={fmtDelta(d.trend.pageViews)} trend={toTrend(d.trend.pageViews)}
                icon={<Eye size={16} aria-hidden="true" />} color="info" />
              <Tooltip title="Hide card">
                <IconButton className="cs-hide-btn" size="small" onClick={() => hide("pageviews")} aria-label="Hide Page Views card"
                  sx={(theme) => ({ position: "absolute", top: 8, right: 8, opacity: 0, transition: theme.motion.short })}>
                  <X size={12} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        )}
        {!hidden["sessions-stat"] && (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box sx={{ position: "relative", "&:hover .cs-hide-btn": { opacity: 1 } }}>
              <CsStatCard label="Sessions" value={fmtValue(d.sessions)}
                delta={fmtDelta(d.trend.sessions)} trend={toTrend(d.trend.sessions)}
                icon={<Activity size={16} aria-hidden="true" />} color="success" />
              <Tooltip title="Hide card">
                <IconButton className="cs-hide-btn" size="small" onClick={() => hide("sessions-stat")} aria-label="Hide Sessions card"
                  sx={(theme) => ({ position: "absolute", top: 8, right: 8, opacity: 0, transition: theme.motion.short })}>
                  <X size={12} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        )}
        {!hidden["orders-stat"] && (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box sx={{ position: "relative", "&:hover .cs-hide-btn": { opacity: 1 } }}>
              <CsStatCard label="Orders" value={fmtValue(d.orders)}
                delta={fmtDelta(d.trend.orders)} trend={toTrend(d.trend.orders)}
                icon={<ShoppingCart size={16} aria-hidden="true" />} color="warning" />
              <Tooltip title="Hide card">
                <IconButton className="cs-hide-btn" size="small" onClick={() => hide("orders-stat")} aria-label="Hide Orders card"
                  sx={(theme) => ({ position: "absolute", top: 8, right: 8, opacity: 0, transition: theme.motion.short })}>
                  <X size={12} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Chart cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: widths["views"] === 2 ? 8 : 6 }}>
          <ChartCard title="Content Views" description={`Trend over ${range}`}
            chart={<SparkLine data={d.viewsLine} color={theme.palette.info.main} />}
            hidden={!!hidden["views-chart"]} onHide={() => hide("views-chart")}
            width={widths["views"] || 1} onExpand={() => expand("views")} onShrink={() => shrink("views")} />
        </Grid>
        <Grid size={{ xs: 12, md: widths["views"] === 2 ? 4 : 6 }}>
          <ChartCard title="Sessions" description={`Volume over ${range}`}
            chart={<SparkBar data={d.sessionsBars} color={theme.palette.success.main} />}
            hidden={!!hidden["sessions-chart"]} onHide={() => hide("sessions-chart")}
            width={widths["sessions"] || 1} onExpand={() => expand("sessions")} onShrink={() => shrink("sessions")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Orders" description={`Volume over ${range}`}
            chart={<SparkBar data={d.ordersBars} color={theme.palette.warning.main} />}
            hidden={!!hidden["orders-chart"]} onHide={() => hide("orders-chart")}
            width={widths["orders"] || 1} onExpand={() => expand("orders")} onShrink={() => shrink("orders")} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Active Users" description={`DAU over ${range}`}
            chart={<SparkBar data={d.usersBars} color={theme.palette.primary.main} />}
            hidden={!!hidden["users-chart"]} onHide={() => hide("users-chart")}
            width={widths["users-chart"] || 1} onExpand={() => expand("users-chart")} onShrink={() => shrink("users-chart")} />
        </Grid>
      </Grid>

      {/* List cards */}
      <Grid container spacing={2}>
        {/* Top content */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={(theme) => ({ transition: theme.motion.standard })}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Box sx={{ px: 6, py: 2 }}>
                <Typography variant="h6">Top Content</Typography>
                <Typography variant="caption" color="text.muted">Most viewed this period</Typography>
              </Box>
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Title", "Views", "Change"].map(col => (
                      <TableCell
                        key={col}
                        sx={(theme) => ({
                          bgcolor: theme.surface.subtle,
                          fontSize: theme.typography.caption.fontSize,
                          fontWeight: theme.typography.fontWeightSemibold,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "text.secondary",
                          ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
                        })}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TOP_CONTENT.map((item, i) => (
                    <TableRow key={i} hover sx={(theme) => ({ transition: theme.motion.short, "&:last-child td": { borderBottom: "none" } })}>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{item.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.views.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {item.change === 0
                            ? <Minus size={12} aria-hidden="true" />
                            : item.change > 0
                              ? <TrendingUp size={12} aria-hidden="true" />
                              : <TrendingDown size={12} aria-hidden="true" />}
                          <Typography
                            variant="caption"
                            color={item.change === 0 ? "text.muted" : item.change > 0 ? "success.main" : "error.main"}
                            sx={{ fontWeight: 'fontWeightMedium' }}
                          >
                            {item.change > 0 ? "+" : ""}{item.change}% vs prev.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Top users */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={(theme) => ({ transition: theme.motion.standard })}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Box sx={{ px: 6, py: 2 }}>
                <Typography variant="h6">Most Active Users</Typography>
                <Typography variant="caption" color="text.muted">By session count this period</Typography>
              </Box>
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["User", "Role", "Sessions"].map(col => (
                      <TableCell
                        key={col}
                        sx={(theme) => ({
                          bgcolor: theme.surface.subtle,
                          fontSize: theme.typography.caption.fontSize,
                          fontWeight: theme.typography.fontWeightSemibold,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "text.secondary",
                          ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
                        })}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TOP_USERS.map((user, i) => (
                    <TableRow key={i} hover sx={(theme) => ({ transition: theme.motion.short, "&:last-child td": { borderBottom: "none" } })}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar variant="soft" color="primary" sx={(theme) => ({ width: 28, height: 28, fontSize: theme.typography.caption.fontSize })}>
                            {user.initials}
                          </Avatar>
                          <Typography variant="body2">{user.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.sessions} variant="soft" color="primary" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
