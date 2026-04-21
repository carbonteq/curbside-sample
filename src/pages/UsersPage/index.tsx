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
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import { Search, X, UserPlus, Pencil, Trash2, FileClock } from "lucide-react";
import { CsEmptyState } from "../../components/CsEmptyState";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

type Status = "active" | "inactive" | "pending";
type DraftStatus = "none" | "editing" | "submitted";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  institution: string;
  status: Status;
  draft: DraftStatus;
}

const INSTITUTIONS = ["All", "General Hospital", "City Medical Center", "St. Luke's", "Memorial Hospital"];

const MOCK_USERS: User[] = [
  { id: 1,  name: "Jordan Rivera",    email: "j.rivera@general.org",     role: "Clinical Lead",  institution: "General Hospital",    status: "active",   draft: "none" },
  { id: 2,  name: "Maya Patel",       email: "m.patel@citymed.org",       role: "Physician",      institution: "City Medical Center", status: "active",   draft: "editing" },
  { id: 3,  name: "Carlos Nguyen",    email: "c.nguyen@stlukes.org",      role: "Pharmacist",     institution: "St. Luke's",          status: "pending",  draft: "none" },
  { id: 4,  name: "Priya Okonkwo",    email: "p.okonkwo@memorial.org",    role: "Nurse",          institution: "Memorial Hospital",   status: "active",   draft: "submitted" },
  { id: 5,  name: "Derek Hoffman",    email: "d.hoffman@general.org",     role: "Admin",          institution: "General Hospital",    status: "inactive", draft: "none" },
  { id: 6,  name: "Sofia Marchetti",  email: "s.marchetti@citymed.org",   role: "Physician",      institution: "City Medical Center", status: "active",   draft: "none" },
  { id: 7,  name: "Ethan Brooks",     email: "e.brooks@stlukes.org",      role: "Clinical Lead",  institution: "St. Luke's",          status: "active",   draft: "editing" },
  { id: 8,  name: "Lena Zimmermann",  email: "l.zimmermann@memorial.org", role: "Pharmacist",     institution: "Memorial Hospital",   status: "pending",  draft: "none" },
  { id: 9,  name: "James Osei",       email: "j.osei@general.org",        role: "Nurse",          institution: "General Hospital",    status: "active",   draft: "none" },
  { id: 10, name: "Aisha Delacroix",  email: "a.delacroix@citymed.org",   role: "Admin",          institution: "City Medical Center", status: "active",   draft: "none" },
  { id: 11, name: "Ravi Sundaram",    email: "r.sundaram@stlukes.org",    role: "Physician",      institution: "St. Luke's",          status: "inactive", draft: "none" },
  { id: 12, name: "Claire Fontaine",  email: "c.fontaine@memorial.org",   role: "Clinical Lead",  institution: "Memorial Hospital",   status: "active",   draft: "submitted" },
  { id: 13, name: "Omar Hassan",      email: "o.hassan@general.org",      role: "Pharmacist",     institution: "General Hospital",    status: "active",   draft: "none" },
  { id: 14, name: "Nina Volkov",      email: "n.volkov@citymed.org",      role: "Nurse",          institution: "City Medical Center", status: "pending",  draft: "none" },
  { id: 15, name: "Tyler Benson",     email: "t.benson@stlukes.org",      role: "Admin",          institution: "St. Luke's",          status: "active",   draft: "editing" },
  { id: 16, name: "Fatima Al-Rashid", email: "f.alrashid@memorial.org",   role: "Physician",      institution: "Memorial Hospital",   status: "active",   draft: "none" },
  { id: 17, name: "Marcus Webb",      email: "m.webb@general.org",        role: "Clinical Lead",  institution: "General Hospital",    status: "inactive", draft: "none" },
  { id: 18, name: "Ingrid Larsson",   email: "i.larsson@citymed.org",     role: "Pharmacist",     institution: "City Medical Center", status: "active",   draft: "none" },
  { id: 19, name: "Dev Kapoor",       email: "d.kapoor@stlukes.org",      role: "Nurse",          institution: "St. Luke's",          status: "active",   draft: "submitted" },
  { id: 20, name: "Zara Mitchell",    email: "z.mitchell@memorial.org",   role: "Admin",          institution: "Memorial Hospital",   status: "pending",  draft: "none" },
];

const STATUS_COLOR: Record<Status, "success" | "neutral" | "warning"> = {
  active:   "success",
  inactive: "neutral",
  pending:  "warning",
};

const DRAFT_LABEL: Record<DraftStatus, string | null> = {
  none:      null,
  editing:   "Editing",
  submitted: "Submitted",
};

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export function UsersPage() {
  const [query,        setQuery]        = useState("");
  const [institution,  setInstitution]  = useState("All");
  const [page,         setPage]         = useState(0);
  const [rowsPerPage,  setRowsPerPage]  = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_USERS.filter(u => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
      const matchesInst  = institution === "All" || u.institution === institution;
      return matchesQuery && matchesInst;
    });
  }, [query, institution]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const hasFilters = query !== "" || institution !== "All";

  function clearFilters() {
    setQuery("");
    setInstitution("All");
    setPage(0);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>All Users</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage clinicians, pharmacists, and administrators across all institutions.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<UserPlus size={16} aria-hidden="true" />}>
          Invite user
        </Button>
      </Box>

      {/* Filter bar */}
      <Card
        variant="outlined"
        sx={(theme) => ({
          borderRadius: `${theme.radius.lg}px ${theme.radius.lg}px 0 0`,
          borderBottom: "none",
        })}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search by name, email, or role…"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(0); }}
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
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

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="institution-label">Institution</InputLabel>
            <Select
              labelId="institution-label"
              label="Institution"
              value={institution}
              onChange={e => { setInstitution(e.target.value); setPage(0); }}
            >
              {INSTITUTIONS.map(inst => (
                <MenuItem key={inst} value={inst}>{inst}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {hasFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={clearFilters}
              startIcon={<X size={14} aria-hidden="true" />}
            >
              Clear filters
            </Button>
          )}
        </Box>
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
                {["User", "Role", "Institution", "Status", "Draft", "Actions"].map(col => (
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
                  <TableCell colSpan={6} sx={{ border: "none" }}>
                    <CsEmptyState
                      variant="inline"
                      title="No users found"
                      description="No users match your search. Try adjusting your filters."
                      action={hasFilters ? { label: "Clear filters", onClick: clearFilters } : undefined}
                    />
                  </TableCell>
                </TableRow>
              ) : paginated.map(user => (
                <TableRow
                  key={user.id}
                  hover
                  sx={(theme) => ({
                    transition: theme.motion.short,
                    "&:last-child td": { borderBottom: "none" },
                  })}
                >
                  {/* User */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        variant="soft"
                        color="primary"
                        sx={(theme) => ({ width: 32, height: 32, fontSize: theme.typography.caption.fontSize })}
                      >
                        {initials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.muted">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Typography variant="body2">{user.role}</Typography>
                  </TableCell>

                  {/* Institution */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.institution}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      variant="soft"
                      color={STATUS_COLOR[user.status]}
                      size="small"
                    />
                  </TableCell>

                  {/* Draft */}
                  <TableCell>
                    {DRAFT_LABEL[user.draft] ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FileClock size={14} aria-hidden="true" style={{ opacity: 0.6 }} />
                        <Typography variant="caption" color="text.secondary">
                          {DRAFT_LABEL[user.draft]}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.muted">—</Typography>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit user">
                        <IconButton size="small" aria-label={`Edit ${user.name}`}>
                          <Pencil size={14} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete user">
                        <IconButton size="small" color="error" aria-label={`Delete ${user.name}`} onClick={() => setDeleteTarget(user)}>
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
          sx={(theme) => ({
            borderTop: "none",
            fontSize: theme.typography.caption.fontSize,
          })}
        />
      </Card>
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove <strong>{deleteTarget?.name}</strong> from the system. This action cannot be undone.
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
