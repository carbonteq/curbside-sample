import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { Search, Plus, Pencil, Eye, Copy, Trash2 } from "lucide-react";
import { CsEmptyState } from "../../components/CsEmptyState";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

type ContentType = "Pathway" | "Protocol" | "Document" | "Workflow";
type ContentStatus = "Published" | "Draft" | "In Review" | "Archived";

interface ContentItem {
  id: number;
  title: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  authorInitials: string;
  lastModified: string;
  views: number;
}

const TYPE_COLOR: Record<ContentType, "primary" | "info" | "secondary" | "warning"> = {
  Pathway:  "primary",
  Protocol: "info",
  Document: "secondary",
  Workflow: "warning",
};

const STATUS_COLOR: Record<ContentStatus, "success" | "neutral" | "warning"> = {
  Published:   "success",
  Draft:       "neutral",
  "In Review": "warning",
  Archived:    "neutral",
};

const MOCK_CONTENT: ContentItem[] = [
  { id: 1,  title: "Sepsis Management Bundle",          type: "Pathway",  status: "Published", author: "Jordan Rivera",    authorInitials: "JR", lastModified: "Apr 18, 2026", views: 1284 },
  { id: 2,  title: "Antibiotic Stewardship Protocol",   type: "Protocol", status: "Published", author: "Maya Patel",       authorInitials: "MP", lastModified: "Apr 15, 2026", views: 892  },
  { id: 3,  title: "ICU Admission Checklist",           type: "Document", status: "Draft",     author: "Carlos Nguyen",    authorInitials: "CN", lastModified: "Apr 14, 2026", views: 0    },
  { id: 4,  title: "Stroke Alert Workflow",             type: "Workflow", status: "In Review", author: "Priya Okonkwo",    authorInitials: "PO", lastModified: "Apr 12, 2026", views: 47   },
  { id: 5,  title: "Chest Pain Triage Pathway",         type: "Pathway",  status: "Published", author: "Sofia Marchetti",  authorInitials: "SM", lastModified: "Apr 10, 2026", views: 2156 },
  { id: 6,  title: "Ventilator Weaning Protocol",       type: "Protocol", status: "Published", author: "Ethan Brooks",     authorInitials: "EB", lastModified: "Apr 9, 2026",  views: 674  },
  { id: 7,  title: "Post-Op Pain Management",           type: "Document", status: "Archived",  author: "Lena Zimmermann",  authorInitials: "LZ", lastModified: "Mar 30, 2026", views: 310  },
  { id: 8,  title: "DVT Prophylaxis Guideline",         type: "Protocol", status: "Published", author: "James Osei",       authorInitials: "JO", lastModified: "Mar 28, 2026", views: 543  },
  { id: 9,  title: "Medication Reconciliation Flow",    type: "Workflow", status: "Published", author: "Aisha Delacroix",  authorInitials: "AD", lastModified: "Mar 25, 2026", views: 988  },
  { id: 10, title: "Pneumonia Care Bundle",             type: "Pathway",  status: "In Review", author: "Ravi Sundaram",    authorInitials: "RS", lastModified: "Mar 22, 2026", views: 112  },
  { id: 11, title: "Hand Hygiene Compliance Doc",       type: "Document", status: "Published", author: "Claire Fontaine",  authorInitials: "CF", lastModified: "Mar 20, 2026", views: 1765 },
  { id: 12, title: "Rapid Response Team Protocol",      type: "Protocol", status: "Draft",     author: "Omar Hassan",      authorInitials: "OH", lastModified: "Mar 18, 2026", views: 0    },
  { id: 13, title: "Fall Prevention Pathway",           type: "Pathway",  status: "Published", author: "Nina Volkov",      authorInitials: "NV", lastModified: "Mar 15, 2026", views: 427  },
  { id: 14, title: "Blood Transfusion Workflow",        type: "Workflow", status: "Published", author: "Tyler Benson",     authorInitials: "TB", lastModified: "Mar 12, 2026", views: 339  },
  { id: 15, title: "Discharge Planning Checklist",      type: "Document", status: "In Review", author: "Fatima Al-Rashid", authorInitials: "FA", lastModified: "Mar 10, 2026", views: 64   },
  { id: 16, title: "AKI Management Pathway",            type: "Pathway",  status: "Published", author: "Marcus Webb",      authorInitials: "MW", lastModified: "Mar 8, 2026",  views: 718  },
  { id: 17, title: "Insulin Drip Protocol",             type: "Protocol", status: "Archived",  author: "Ingrid Larsson",   authorInitials: "IL", lastModified: "Feb 28, 2026", views: 205  },
  { id: 18, title: "Code Blue Response Workflow",       type: "Workflow", status: "Published", author: "Dev Kapoor",       authorInitials: "DK", lastModified: "Feb 25, 2026", views: 1091 },
  { id: 19, title: "Delirium Screening Protocol",       type: "Protocol", status: "Draft",     author: "Zara Mitchell",    authorInitials: "ZM", lastModified: "Feb 20, 2026", views: 0    },
  { id: 20, title: "Palliative Care Pathway",           type: "Pathway",  status: "Published", author: "Jordan Rivera",    authorInitials: "JR", lastModified: "Feb 15, 2026", views: 863  },
];

type FilterTab = "All" | ContentType;
const TABS: FilterTab[] = ["All", "Pathway", "Protocol", "Document", "Workflow"];

export function LibraryPage() {
  const [query,        setQuery]        = useState("");
  const [activeTab,    setActiveTab]    = useState<FilterTab>("All");
  const [page,         setPage]         = useState(0);
  const [rowsPerPage,  setRowsPerPage]  = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_CONTENT.filter(item => {
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
      const matchesTab   = activeTab === "All" || item.type === activeTab;
      return matchesQuery && matchesTab;
    });
  }, [query, activeTab]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const counts = useMemo(() => {
    const c: Record<FilterTab, number> = { All: MOCK_CONTENT.length, Pathway: 0, Protocol: 0, Document: 0, Workflow: 0 };
    MOCK_CONTENT.forEach(item => c[item.type]++);
    return c;
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 4,
        })}
      >
        <Box>
          <Typography variant="h4" gutterBottom>Library</Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and manage clinical pathways, protocols, documents, and workflows.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={16} aria-hidden="true" />}>
          New content
        </Button>
      </Box>

      {/* Search + tabs */}
      <Card
        variant="outlined"
        sx={(theme) => ({
          borderRadius: `${theme.radius.lg}px ${theme.radius.lg}px 0 0`,
          borderBottom: "none",
        })}
      >
        <Box sx={(theme) => ({ px: 2, pt: 2, pb: 0 })}>
          <TextField
            placeholder="Search by title or author…"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(0); }}
            size="small"
            sx={{ width: 320, mb: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} aria-hidden="true" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_, v) => { setActiveTab(v); setPage(0); }}
          sx={(theme) => ({ px: 2 })}
          aria-label="Filter by content type"
        >
          {TABS.map(tab => (
            <Tab
              key={tab}
              value={tab}
              label={
                <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1 })}>
                  {tab}
                  <Chip
                    label={counts[tab]}
                    size="small"
                    variant="soft"
                    color={tab === "All" ? "neutral" : TYPE_COLOR[tab as ContentType]}
                    sx={(theme) => ({ height: 18, fontSize: theme.typography.caption.fontSize, pointerEvents: "none" })}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Card>

      {/* Table */}
      <Card
        variant="outlined"
        sx={(theme) => ({
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: `0 0 ${theme.radius.lg}px ${theme.radius.lg}px`,
          overflow: "hidden",
        })}
      >
        <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["Title", "Type", "Status", "Author", "Last modified", "Views", "Actions"].map(col => (
                  <TableCell
                    key={col}
                    sx={(theme) => ({
                      bgcolor: theme.surface.subtle,
                      fontWeight: theme.typography.fontWeightSemibold,
                      fontSize: theme.typography.caption.fontSize,
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
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ border: "none" }}>
                    <CsEmptyState
                      variant="inline"
                      title="No content found"
                      description="No content matches your search. Try adjusting your filters."
                      action={query ? { label: "Clear search", onClick: () => { setQuery(""); setPage(0); } } : undefined}
                    />
                  </TableCell>
                </TableRow>
              ) : paginated.map(item => (
                <TableRow
                  key={item.id}
                  hover
                  sx={(theme) => ({
                    transition: theme.motion.short,
                    cursor: "pointer",
                    "&:last-child td": { borderBottom: "none" },
                  })}
                >
                  {/* Title */}
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography variant="body2" fontWeight="fontWeightMedium" noWrap>
                      {item.title}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Chip label={item.type} variant="soft" color={TYPE_COLOR[item.type]} size="small" />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip label={item.status} variant="soft" color={STATUS_COLOR[item.status]} size="small" />
                  </TableCell>

                  {/* Author */}
                  <TableCell>
                    <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1 })}>
                      <Avatar variant="soft" sx={(theme) => ({ width: 24, height: 24, fontSize: theme.typography.caption.fontSize })}>
                        {item.authorInitials}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {item.author}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Last modified */}
                  <TableCell>
                    <Typography variant="caption" color="text.muted">{item.lastModified}</Typography>
                  </TableCell>

                  {/* Views */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.views.toLocaleString()}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={(theme) => ({ display: "flex", gap: 1 })}>
                      <Tooltip title="Preview">
                        <IconButton size="small" aria-label={`Preview ${item.title}`}>
                          <Eye size={14} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" aria-label={`Edit ${item.title}`}>
                          <Pencil size={14} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" aria-label={`Duplicate ${item.title}`}>
                          <Copy size={14} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" aria-label={`Delete ${item.title}`} onClick={() => setDeleteTarget(item)}>
                          <Trash2 size={14} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ borderTop: "none" }}
        />
      </Card>
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete content?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{deleteTarget?.title}</strong>. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setDeleteTarget(null)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
