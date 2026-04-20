import { useState, useMemo } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import {
  Search, ChevronDown, Star, MoreVertical,
  GitBranch, FileText, Workflow, ClipboardList, Bell, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType  = "Pathway" | "Protocol" | "Workflow" | "Document";
type FilterTab    = "All" | "Suggested" | "Starred" | "Recent" | "New" | "Updated";
type SortBy       = "Alpha" | "Recent" | "Popular";
// Only palette intent keys — no raw hex at call sites
type PaletteIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success";

interface Label { id: string; name: string; colorKey: PaletteIntent }

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  specialty: string;
  department: string;
  labels: Label[];
  starred: boolean;
  isNew?: boolean;
  isUpdated?: boolean;
  views: number;
}

// ─── Design-system-aligned type config ───────────────────────────────────────
// Colors come from theme.palette — no hardcoded hex

const TYPE_CONFIG: Record<ContentType, { icon: React.ReactNode; colorKey: PaletteIntent }> = {
  Pathway:  { icon: <GitBranch size={13} />,    colorKey: "info"      },
  Workflow: { icon: <Workflow size={13} />,      colorKey: "warning"   },
  Protocol: { icon: <ClipboardList size={13} />, colorKey: "secondary" },
  Document: { icon: <FileText size={13} />,      colorKey: "success"   },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ITEMS: ContentItem[] = [
  { id: "1",  type: "Pathway",  title: "Sepsis Management Bundle",          specialty: "Critical Care",      department: "ICU",          labels: [{ id: "l1", name: "Cardiology", colorKey: "info"      }, { id: "l2", name: "Urgent",     colorKey: "error"     }], starred: true,  isNew: true,     views: 2341 },
  { id: "2",  type: "Workflow", title: "Chest Pain Assessment Workflow",     specialty: "Cardiology",         department: "ED",           labels: [{ id: "l1", name: "Cardiology", colorKey: "info"      }],                                                              starred: false, isUpdated: true, views: 1856 },
  { id: "3",  type: "Protocol", title: "Antibiotic Stewardship Protocol",    specialty: "Infectious Disease", department: "Medical/Surg", labels: [{ id: "l3", name: "Pharmacy",   colorKey: "secondary" }],                                                              starred: true,                   views: 1102 },
  { id: "4",  type: "Document", title: "Hand Hygiene Compliance Policy",     specialty: "Infection Control",  department: "All",          labels: [{ id: "l4", name: "Policy",     colorKey: "warning"   }],                                                              starred: false,                  views: 1765 },
  { id: "5",  type: "Pathway",  title: "Stroke Alert Clinical Pathway",      specialty: "Neurology",          department: "ED",           labels: [{ id: "l5", name: "Neurology",  colorKey: "success"   }],                                                              starred: false, isNew: true,     views: 894  },
  { id: "6",  type: "Workflow", title: "Medication Reconciliation Flow",     specialty: "Pharmacy",           department: "Medical/Surg", labels: [{ id: "l3", name: "Pharmacy",   colorKey: "secondary" }],                                                              starred: true,                   views: 988  },
  { id: "7",  type: "Protocol", title: "Ventilator Weaning Protocol",        specialty: "Critical Care",      department: "ICU",          labels: [{ id: "l1", name: "Cardiology", colorKey: "info"      }],                                                              starred: false, isUpdated: true, views: 674  },
  { id: "8",  type: "Document", title: "Discharge Planning Checklist",       specialty: "Care Coordination",  department: "All",          labels: [{ id: "l4", name: "Policy",     colorKey: "warning"   }],                                                              starred: false,                  views: 543  },
  { id: "9",  type: "Pathway",  title: "Fall Prevention Care Pathway",       specialty: "Geriatrics",         department: "Medical/Surg", labels: [{ id: "l6", name: "Safety",     colorKey: "warning"   }],                                                              starred: false,                  views: 427  },
  { id: "10", type: "Workflow", title: "Code Blue Response Workflow",        specialty: "Emergency",          department: "All",          labels: [{ id: "l2", name: "Urgent",     colorKey: "error"     }],                                                              starred: true,  isNew: true,     views: 1091 },
  { id: "11", type: "Protocol", title: "DVT Prophylaxis Guideline",          specialty: "Surgery",            department: "Medical/Surg", labels: [{ id: "l3", name: "Pharmacy",   colorKey: "secondary" }],                                                              starred: false,                  views: 543  },
  { id: "12", type: "Document", title: "Post-Op Pain Management Policy",     specialty: "Surgery",            department: "OR",           labels: [{ id: "l4", name: "Policy",     colorKey: "warning"   }],                                                              starred: false,                  views: 310  },
  { id: "13", type: "Pathway",  title: "AKI Management Clinical Pathway",    specialty: "Nephrology",         department: "ICU",          labels: [{ id: "l7", name: "Nephrology", colorKey: "info"      }],                                                              starred: false, isUpdated: true, views: 718  },
  { id: "14", type: "Protocol", title: "Delirium Screening Protocol",        specialty: "Geriatrics",         department: "Medical/Surg", labels: [{ id: "l6", name: "Safety",     colorKey: "warning"   }],                                                              starred: false,                  views: 312  },
  { id: "15", type: "Pathway",  title: "Palliative Care Pathway",            specialty: "Palliative",         department: "All",          labels: [{ id: "l8", name: "Palliative", colorKey: "secondary" }],                                                              starred: true,                   views: 863  },
  { id: "16", type: "Workflow", title: "Blood Transfusion Workflow",         specialty: "Hematology",         department: "Medical/Surg", labels: [{ id: "l3", name: "Pharmacy",   colorKey: "secondary" }],                                                              starred: false,                  views: 339  },
  { id: "17", type: "Protocol", title: "Insulin Drip Titration Protocol",    specialty: "Endocrinology",      department: "ICU",          labels: [{ id: "l3", name: "Pharmacy",   colorKey: "secondary" }],                                                              starred: false,                  views: 205  },
  { id: "18", type: "Document", title: "ICU Admission Criteria Document",    specialty: "Critical Care",      department: "ICU",          labels: [{ id: "l6", name: "Safety",     colorKey: "warning"   }],                                                              starred: false,                  views: 612  },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "New COVID-19 management protocol now live",       date: "Apr 18" },
  { id: "a2", title: "Updated sepsis guidelines — effective Monday",    date: "Apr 15" },
  { id: "a3", title: "Pharmacy formulary changes Q2 2026",              date: "Apr 12" },
];

// ─── Content list item ────────────────────────────────────────────────────────

function ContentListItem({ item, onStar }: { item: ContentItem; onStar: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const cfg = TYPE_CONFIG[item.type];

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={(theme) => ({
        display: "flex", alignItems: "center", gap: theme.space.sm,
        px: theme.space.md, py: "8px",
        borderRadius: `${theme.radius.md}px`,
        border: `1px solid ${theme.border.subtle}`,
        bgcolor: theme.surface.canvas,
        cursor: "pointer",
        transition: theme.motion.short,
        "&:hover": {
          bgcolor: theme.surface.subtle,
          borderColor: theme.border.default,
        },
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[900],
          borderColor: theme.palette.grey[800],
          "&:hover": { bgcolor: theme.palette.grey[800], borderColor: theme.palette.grey[700] },
        }),
      })}
    >
      {/* Star */}
      <Tooltip title={item.starred ? "Remove from starred" : "Star this"}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onStar(item.id); }}
          sx={(theme) => ({
            p: "2px", flexShrink: 0,
            color: item.starred ? theme.palette.warning.main : theme.palette.text.disabled,
            "&:hover": { color: theme.palette.warning.main },
            transition: theme.motion.short,
          })}
        >
          <Star size={13} fill={item.starred ? "currentColor" : "none"} />
        </IconButton>
      </Tooltip>

      {/* Type icon bubble — uses palette intent, auto-adapts in dark mode */}
      <Box sx={(theme) => ({
        width: 26, height: 26, borderRadius: `${theme.radius.md}px`,
        bgcolor: alpha(theme.palette[cfg.colorKey].main, 0.1),
        color: theme.palette[cfg.colorKey].main,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      })}>
        {cfg.icon}
      </Box>

      {/* Title */}
      <Typography
        variant="body2"
        sx={{ flex: 1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {item.title}
      </Typography>

      {/* Badges — MUI Chip color prop handles dark mode automatically */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
        {item.isNew && (
          <Chip label="New" size="small" color="success" variant="soft"
            sx={{ height: 17, "& .MuiChip-label": { px: "5px", fontSize: "0.62rem" } }} />
        )}
        {item.isUpdated && (
          <Chip label="Updated" size="small" color="info" variant="soft"
            sx={{ height: 17, "& .MuiChip-label": { px: "5px", fontSize: "0.62rem" } }} />
        )}
        {item.labels.slice(0, 2).map((lbl) => (
          <Chip
            key={lbl.id}
            label={lbl.name}
            size="small"
            color={lbl.colorKey}
            variant="soft"
            sx={{ height: 17, "& .MuiChip-label": { px: "5px", fontSize: "0.62rem" } }}
          />
        ))}
      </Box>

      {/* More menu (visible on hover) */}
      <IconButton
        size="small"
        onClick={(e) => e.stopPropagation()}
        sx={(theme) => ({
          p: "2px", flexShrink: 0,
          color: theme.palette.text.secondary,
          opacity: hover ? 1 : 0,
          transition: theme.motion.short,
        })}
      >
        <MoreVertical size={13} />
      </IconButton>
    </Box>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function BrowsePage() {
  const [query,       setQuery]       = useState("");
  const [tab,         setTab]         = useState<FilterTab>("All");
  const [sortBy,      setSortBy]      = useState<SortBy>("Alpha");
  const [items,       setItems]       = useState(MOCK_ITEMS);
  const [typeFilters, setTypeFilters] = useState<Set<ContentType>>(new Set());
  const [specFilters, setSpecFilters] = useState<Set<string>>(new Set());

  const specialties = useMemo(() => [...new Set(MOCK_ITEMS.map((i) => i.specialty))].sort(), []);

  const filtered = useMemo(() => {
    let list = items;
    if (query)             list = list.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
    if (typeFilters.size)  list = list.filter((i) => typeFilters.has(i.type));
    if (specFilters.size)  list = list.filter((i) => specFilters.has(i.specialty));
    if (tab === "Starred") list = list.filter((i) => i.starred);
    if (tab === "New")     list = list.filter((i) => !!i.isNew);
    if (tab === "Updated") list = list.filter((i) => !!i.isUpdated);
    if (sortBy === "Alpha")   return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "Popular") return [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [query, tab, sortBy, typeFilters, specFilters, items]);

  const toggleType = (t: ContentType) =>
    setTypeFilters((p) => { const s = new Set(p); s.has(t) ? s.delete(t) : s.add(t); return s; });
  const toggleSpec = (s: string) =>
    setSpecFilters((p) => { const set = new Set(p); set.has(s) ? set.delete(s) : set.add(s); return set; });
  const toggleStar = (id: string) =>
    setItems((p) => p.map((i) => i.id === id ? { ...i, starred: !i.starred } : i));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        bgcolor: theme.palette.primary.main,
        px: 3, py: "14px",
        display: "flex", justifyContent: "center",
        flexShrink: 0,
      })}>
        <OutlinedInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Mayo Clinic…"
          size="small"
          notched={false}
          startAdornment={
            <InputAdornment position="start">
              <Search size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
            </InputAdornment>
          }
          sx={(theme) => ({
            width: "min(560px, 100%)",
            bgcolor: alpha("#fff", 0.12),
            borderRadius: `${theme.radius.pill}px`,
            color: "#fff",
            "& fieldset": { border: "none" },
            "& input": { color: "#fff", py: "8px" },
            "& input::placeholder": { color: alpha("#fff", 0.55), opacity: 1 },
            boxShadow: `0 0 0 2px ${alpha("#fff", 0.15)}`,
            "&:hover, &.Mui-focused": { boxShadow: `0 0 0 2px ${alpha("#fff", 0.35)}` },
          })}
        />
      </Box>

      {/* ── 3-column body ──────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left sidebar – filters */}
        <Box sx={(theme) => ({
          width: 228, flexShrink: 0, overflow: "auto",
          borderRight: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.subtle,
          px: theme.space.md, py: theme.space.lg,
          display: "flex", flexDirection: "column", gap: "2px",
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Types */}
          <Accordion defaultExpanded disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Types
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1, display: "flex", flexDirection: "column" }}>
              {(["Pathway", "Protocol", "Workflow", "Document"] as ContentType[]).map((t) => {
                const cfg = TYPE_CONFIG[t];
                return (
                  <FormControlLabel
                    key={t}
                    control={<Checkbox size="small" checked={typeFilters.has(t)} onChange={() => toggleType(t)} />}
                    label={
                      <Box sx={(theme) => ({
                        display: "flex", alignItems: "center", gap: "5px",
                        color: theme.palette[cfg.colorKey].main,
                      })}>
                        {cfg.icon}
                        <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.primary })}>
                          {t}
                        </Typography>
                      </Box>
                    }
                    sx={{ mx: 0 }}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>

          <Divider sx={(theme) => ({
            borderColor: theme.border.subtle,
            my: theme.space.xs,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* Specialty */}
          <Accordion defaultExpanded disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Specialty
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1, display: "flex", flexDirection: "column" }}>
              {specialties.map((s) => (
                <FormControlLabel
                  key={s}
                  control={<Checkbox size="small" checked={specFilters.has(s)} onChange={() => toggleSpec(s)} />}
                  label={<Typography variant="body2">{s}</Typography>}
                  sx={{ mx: 0 }}
                />
              ))}
            </AccordionDetails>
          </Accordion>

          <Divider sx={(theme) => ({
            borderColor: theme.border.subtle,
            my: theme.space.xs,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* Department */}
          <Accordion disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Department
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1, display: "flex", flexDirection: "column" }}>
              {["ICU", "ED", "Medical/Surg", "OR", "All"].map((d) => (
                <FormControlLabel
                  key={d}
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">{d}</Typography>}
                  sx={{ mx: 0 }}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Center – content list */}
        <Box sx={(theme) => ({
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          bgcolor: theme.surface.canvas,
          ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
        })}>
          {/* Tab bar + sort */}
          <Box sx={(theme) => ({
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: theme.space["2xl"],
            borderBottom: `1px solid ${theme.border.default}`,
            flexShrink: 0,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })}>
            <Tabs
              value={tab}
              onChange={(_, v: FilterTab) => setTab(v)}
              sx={{ "& .MuiTab-root": { minHeight: 44, fontSize: "0.78rem", py: 0 } }}
            >
              {(["All", "Suggested", "Starred", "Recent", "New", "Updated"] as FilterTab[]).map((t) => (
                <Tab key={t} value={t} label={t} />
              ))}
            </Tabs>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary">{filtered.length} results</Typography>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                size="small"
                sx={(theme) => ({
                  fontSize: "0.75rem", height: 28,
                  "& fieldset": { borderColor: theme.border.default },
                  ...theme.applyStyles("dark", { "& fieldset": { borderColor: theme.palette.grey[700] } }),
                })}
              >
                <MenuItem value="Alpha">A – Z</MenuItem>
                <MenuItem value="Recent">Most Recent</MenuItem>
                <MenuItem value="Popular">Most Viewed</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Items */}
          <Box sx={(theme) => ({
            flex: 1, overflow: "auto",
            px: theme.space["2xl"], py: theme.space.lg,
            display: "flex", flexDirection: "column", gap: theme.space.xs,
          })}>
            {filtered.length === 0 ? (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color="text.secondary">No results found</Typography>
              </Box>
            ) : (
              filtered.map((item) => (
                <ContentListItem key={item.id} item={item} onStar={toggleStar} />
              ))
            )}
          </Box>
        </Box>

        {/* Right panel – announcements & new content */}
        <Box sx={(theme) => ({
          width: 236, flexShrink: 0, overflow: "auto",
          borderLeft: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.subtle,
          px: theme.space.lg, py: theme.space.lg,
          display: "flex", flexDirection: "column", gap: theme.space.xl,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Announcements */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: 1.5 }}>
              <Bell size={13} />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Announcements
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {ANNOUNCEMENTS.map((a) => (
                <Box key={a.id} sx={(theme) => ({
                  p: theme.space.sm, borderRadius: `${theme.radius.md}px`,
                  border: `1px solid ${theme.border.default}`,
                  bgcolor: theme.surface.canvas,
                  cursor: "pointer", transition: theme.motion.short,
                  "&:hover": { bgcolor: theme.surface.raised },
                  ...theme.applyStyles("dark", {
                    bgcolor: theme.palette.grey[900],
                    borderColor: theme.palette.grey[700],
                    "&:hover": { bgcolor: theme.palette.grey[700] },
                  }),
                })}>
                  <Typography variant="caption" sx={{ display: "block", fontWeight: 500, lineHeight: 1.45 }}>
                    {a.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                    {a.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={(theme) => ({
            borderColor: theme.border.subtle,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* New content */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: 1.5 }}>
              <Sparkles size={13} />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                New Content
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {MOCK_ITEMS.filter((i) => i.isNew).map((item) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <Box key={item.id} sx={(theme) => ({
                    display: "flex", alignItems: "flex-start", gap: theme.space.xs,
                    p: theme.space.sm, borderRadius: `${theme.radius.md}px`,
                    border: `1px solid ${theme.border.default}`,
                    bgcolor: theme.surface.canvas,
                    cursor: "pointer", transition: theme.motion.short,
                    "&:hover": { bgcolor: theme.surface.raised },
                    ...theme.applyStyles("dark", {
                      bgcolor: theme.palette.grey[900],
                      borderColor: theme.palette.grey[700],
                      "&:hover": { bgcolor: theme.palette.grey[700] },
                    }),
                  })}>
                    <Box sx={(theme) => ({ color: theme.palette[cfg.colorKey].main, mt: "2px", flexShrink: 0 })}>
                      {cfg.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1.45 }}>
                      {item.title}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
