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
import { CsSidebarItem } from "../../components/CsSidebarItem";
import { CsSectionHeader } from "../../components/CsSectionHeader";
import { CsEmptyState } from "../../components/CsEmptyState";

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

// ─── Chip label override — uses theme typography scale, not raw rem ───────────
// Height + label padding are intentional density overrides for this compact list.
const chipSx = { height: 17, "& .MuiChip-label": { px: 1 } };

// ─── Content list item ────────────────────────────────────────────────────────

function ContentListItem({ item, onStar }: { item: ContentItem; onStar: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const cfg = TYPE_CONFIG[item.type];

  return (
    <Box
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") e.preventDefault();
      }}
      sx={(theme) => ({
        display: "flex", alignItems: "center", gap: 2,
        px: 3, py: 1,
        borderRadius: `${theme.radius.md}px`,
        border: `1px solid ${theme.border.subtle}`,
        bgcolor: theme.surface.canvas,
        cursor: "pointer",
        transition: theme.motion.short,
        "&:hover": {
          bgcolor: theme.surface.subtle,
          borderColor: theme.border.default,
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
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
            p: 1, flexShrink: 0,
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
        sx={(theme) => ({
          flex: 1,
          fontWeight: theme.typography.fontWeightMedium,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        })}
      >
        {item.title}
      </Typography>

      {/* Badges — MUI Chip color prop handles dark mode automatically */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
        {item.isNew && (
          <Chip label="New" size="small" color="success" variant="soft" sx={chipSx} />
        )}
        {item.isUpdated && (
          <Chip label="Updated" size="small" color="info" variant="soft" sx={chipSx} />
        )}
        {item.labels.slice(0, 2).map((lbl) => (
          <Chip
            key={lbl.id}
            label={lbl.name}
            size="small"
            color={lbl.colorKey}
            variant="soft"
            sx={chipSx}
          />
        ))}
      </Box>

      {/* More menu (visible on hover) */}
      <IconButton
        size="small"
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
        sx={(theme) => ({
          p: 1, flexShrink: 0,
          color: theme.palette.text.secondary,
          opacity: hover ? 1 : 0,
          transition: theme.motion.short,
        })}
      >
        <MoreVertical size={13} aria-hidden="true" />
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
  const [deptFilters, setDeptFilters] = useState<Set<string>>(new Set());

  const specialties = useMemo(() => [...new Set(MOCK_ITEMS.map((i) => i.specialty))].sort(), []);

  const filtered = useMemo(() => {
    let list = items;
    if (query)             list = list.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
    if (typeFilters.size)  list = list.filter((i) => typeFilters.has(i.type));
    if (specFilters.size)  list = list.filter((i) => specFilters.has(i.specialty));
    if (deptFilters.size)  list = list.filter((i) => deptFilters.has(i.department));
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
  const toggleDept = (d: string) =>
    setDeptFilters((p) => { const s = new Set(p); s.has(d) ? s.delete(d) : s.add(d); return s; });
  const toggleStar = (id: string) =>
    setItems((p) => p.map((i) => i.id === id ? { ...i, starred: !i.starred } : i));
  const clearAllFilters = () => {
    setQuery(""); setTypeFilters(new Set()); setSpecFilters(new Set()); setDeptFilters(new Set()); setTab("All");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        bgcolor: theme.palette.primary.main,
        px: 3, py: 3,
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
              {/* Icon on primary bg — contrastText is the correct semantic token */}
              <Box component="span" sx={(theme) => ({ opacity: 0.6, display: "flex", color: theme.palette.primary.contrastText })}>
                <Search size={15} aria-hidden="true" />
              </Box>
            </InputAdornment>
          }
          sx={(theme) => ({
            width: "min(560px, 100%)",
            bgcolor: alpha(theme.palette.primary.contrastText, 0.12),
            borderRadius: `${theme.radius.pill}px`,
            color: theme.palette.primary.contrastText,
            "& fieldset": { border: "none" },
            "& input": { color: theme.palette.primary.contrastText, py: 1 },
            "& input::placeholder": { color: alpha(theme.palette.primary.contrastText, 0.55), opacity: 1 },
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.contrastText, 0.15)}`,
            "&:hover, &.Mui-focused": { boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.contrastText, 0.35)}` },
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
          px: 3, py: 4,
          display: "flex", flexDirection: "column", gap: 1,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Types */}
          <Accordion defaultExpanded disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemibold, textTransform: "uppercase", letterSpacing: "0.08em" })}>
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
                        display: "flex", alignItems: "center", gap: 1,
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
            my: 1,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* Specialty */}
          <Accordion defaultExpanded disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemibold, textTransform: "uppercase", letterSpacing: "0.08em" })}>
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
            my: 1,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* Department */}
          <Accordion disableGutters elevation={0}
            sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ChevronDown size={13} />} sx={{ minHeight: 36, py: 0 }}>
              <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemibold, textTransform: "uppercase", letterSpacing: "0.08em" })}>
                Department
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1, display: "flex", flexDirection: "column" }}>
              {["ICU", "ED", "Medical/Surg", "OR", "All"].map((d) => (
                <FormControlLabel
                  key={d}
                  control={<Checkbox size="small" checked={deptFilters.has(d)} onChange={() => toggleDept(d)} />}
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
            px: 6,
            borderBottom: `1px solid ${theme.border.default}`,
            flexShrink: 0,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })}>
            <Tabs
              value={tab}
              onChange={(_, v: FilterTab) => setTab(v)}
              sx={(theme) => ({ "& .MuiTab-root": { minHeight: 44, fontSize: theme.typography.caption.fontSize, py: 0 } })}
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
                  fontSize: theme.typography.caption.fontSize, height: 28,
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
          <Box sx={{
            flex: 1, overflow: "auto",
            px: 6, py: 4,
            display: "flex", flexDirection: "column", gap: 1,
          }}>
            {filtered.length === 0 ? (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CsEmptyState
                  variant="inline"
                  title="No results found"
                  description="Try adjusting your search, filters, or selected tab."
                  action={{ label: "Clear all filters", onClick: clearAllFilters }}
                />
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
          px: 4, py: 4,
          display: "flex", flexDirection: "column", gap: 5,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Announcements */}
          <Box>
            <CsSectionHeader
              variant="eyebrow"
              icon={<Bell size={13} />}
              title="Announcements"
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {ANNOUNCEMENTS.map((a) => (
                <CsSidebarItem key={a.id} alignItems="flex-start" style={{ flexDirection: "column" }}>
                  <Typography variant="caption" sx={(theme) => ({ display: "block", fontWeight: theme.typography.fontWeightMedium, lineHeight: 1.45 })}>
                    {a.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={(theme) => ({ fontSize: theme.typography.caption.fontSize })}>
                    {a.date}
                  </Typography>
                </CsSidebarItem>
              ))}
            </Box>
          </Box>

          <Divider sx={(theme) => ({
            borderColor: theme.border.subtle,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* New content */}
          <Box>
            <CsSectionHeader
              variant="eyebrow"
              icon={<Sparkles size={13} />}
              title="New Content"
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {MOCK_ITEMS.filter((i) => i.isNew).map((item) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <CsSidebarItem key={item.id} alignItems="flex-start">
                    <Box sx={(theme) => ({ color: theme.palette[cfg.colorKey].main, mt: 1, flexShrink: 0 })}>
                      {cfg.icon}
                    </Box>
                    <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightMedium, lineHeight: 1.45 })}>
                      {item.title}
                    </Typography>
                  </CsSidebarItem>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
