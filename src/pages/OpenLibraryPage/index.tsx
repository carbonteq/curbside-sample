import { useState, useMemo, type ReactNode } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Search, SlidersHorizontal, ChevronDown, Globe, FileText,
  Calculator, Network, Library,
} from 'lucide-react';
import { focusRing } from '@/theme/recipes';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ItemType    = 'pathway' | 'document';
type FilterChip  = 'ALL' | 'HEENT';
type SpecialtyKey = 'Emergency Medicine' | 'Neurology' | 'Otolaryngology' | 'Pediatric Medicine';

interface LibraryItem {
  id: string;
  type: ItemType;
  title: string;
  isUpdated?: boolean;
}

// ─── Static data ────────────────────────────────────────────────────────────────

const LIBRARY_ITEMS: LibraryItem[] = [
  { id: '1',  type: 'pathway',  title: 'ACLS Healthcare Provider Post–Cardiac Arrest Care Algorithm' },
  { id: '2',  type: 'pathway',  title: 'ACLS Termination Of Resuscitation' },
  { id: '3',  type: 'pathway',  title: 'Acute Ear Pain and Otitis Media / Externa' },
  { id: '4',  type: 'pathway',  title: 'Acute headache and migraine (> 18 Years)' },
  { id: '5',  type: 'pathway',  title: 'Adult Basic Life Support Algorithm For Healthcare Providers' },
  { id: '6',  type: 'pathway',  title: 'Adult Bradycardia Algorithm' },
  { id: '7',  type: 'pathway',  title: 'Adult Cardiac Arrest Algorithm' },
  { id: '8',  type: 'pathway',  title: 'Adult Cardiac Arrest Circular Algorithm' },
  { id: '9',  type: 'pathway',  title: 'Adult Tachycardia With A Pulse Algorithm' },
  { id: '10', type: 'pathway',  title: 'Airway Decision Scheme' },
  { id: '11', type: 'pathway',  title: 'Algorithm for Drug-Assisted Intubation or Rapid' },
  { id: '12', type: 'pathway',  title: 'Algorithm for Initial Management of Severe Brain Injury' },
  { id: '13', type: 'pathway',  title: 'Algorithm for Management of Mild Brain Injury' },
  { id: '14', type: 'pathway',  title: 'Algorithm For Management Of Moderate Brain' },
  { id: '15', type: 'pathway',  title: 'BLS Termination Of Resuscitation' },
  { id: '16', type: 'pathway',  title: 'Cardiac Arrest In Pregnancy In-Hospital ACLS Algorithm' },
  { id: '17', type: 'pathway',  title: 'Field Triage Decision Scheme' },
  { id: '18', type: 'pathway',  title: 'Fishbone (Ishikawa) Diagram' },
  { id: '19', type: 'pathway',  title: 'Infectious Disease Threats Report' },
  { id: '20', type: 'pathway',  title: 'JumpSTART Pediatric Triage Algorithm' },
  { id: '21', type: 'pathway',  title: 'Measles Screening, Diagnosis And Testing', isUpdated: true },
  { id: '22', type: 'pathway',  title: 'Neonatal Resuscitation Algorithm' },
  { id: '23', type: 'pathway',  title: 'Opioid-Associated Emergency For Healthcare Providers Algorithm' },
  { id: '24', type: 'pathway',  title: 'Opioid-Associated Emergency For Lay Responders Algorithm' },
  { id: '25', type: 'pathway',  title: 'Pediatric Basic Life Support Algorithm For Healthcare Providers—2 Or More Rescuers' },
  { id: '26', type: 'pathway',  title: 'Pediatric Basic Life Support Algorithm for Healthcare Providers—Single Rescuer' },
  { id: '27', type: 'pathway',  title: 'Pediatric Bradycardia With A Pulse Algorithm' },
  { id: '28', type: 'pathway',  title: 'Pediatric Cardiac Arrest Algorithm' },
  { id: '29', type: 'pathway',  title: 'Pediatric Tachycardia With a Pulse Algorithm' },
  { id: '30', type: 'pathway',  title: 'Pelvic Fractures and Hemorrhagic Shock Management Algorithm' },
  { id: '31', type: 'document', title: 'Post–Cardiac Arrest Care Checklist' },
  { id: '32', type: 'pathway',  title: 'Resuscitation Flow Diagram For Pediatric Patients' },
  { id: '33', type: 'pathway',  title: 'SALT Mass Casualty Triage Algorithm (Sort, Assess, Lifesaving Interventions, Treatment/Transport)' },
  { id: '34', type: 'pathway',  title: 'Schematic ALS Recommendations Advanced Airways' },
  { id: '35', type: 'document', title: 'SMART Goal Planning Document' },
  { id: '36', type: 'pathway',  title: 'START Adult Triage Algorithm' },
  { id: '37', type: 'pathway',  title: 'Summary Guide to Tetanus Prophylaxis in Routine Wound Management' },
  { id: '38', type: 'pathway',  title: 'Testing Nodes' },
  { id: '39', type: 'pathway',  title: 'Traumatic Circulatory Arrest' },
  { id: '40', type: 'pathway',  title: 'Warming Strategies in Trauma' },
];

const SPECIALTIES: SpecialtyKey[] = [
  'Emergency Medicine',
  'Neurology',
  'Otolaryngology',
  'Pediatric Medicine',
];

const ANNOUNCEMENTS = [
  { id: 'a1', text: 'Demo' },
  { id: 'a2', text: 'This is the name of an announcement...' },
];

// ─── Small shared components ────────────────────────────────────────────────────

function FilterGroupSearch() {
  return (
    <Box sx={(t) => ({
      display: 'flex', alignItems: 'center', gap: 1,
      border: `1px solid ${t.border.default}`,
      borderRadius: `${t.radius.md}px`,
      px: 2, py: 1,
      mb: 2,
      bgcolor: t.surface.canvas,
      ...t.applyStyles('dark', {
        bgcolor: t.palette.grey[900],
        borderColor: t.palette.grey[700],
      }),
    })}>
      <Box component="span" sx={(t) => ({ color: t.palette.text.disabled, display: 'flex', flexShrink: 0 })}>
        <Search size={13} aria-hidden="true" />
      </Box>
      <InputBase
        placeholder="Type to search more..."
        sx={(t) => ({ fontSize: t.typography.caption.fontSize, flex: 1 })}
      />
    </Box>
  );
}

function FilterGroup({
  label,
  defaultExpanded = false,
  children,
}: {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={(t) => ({
        bgcolor: t.surface.subtle,
        borderRadius: `${t.radius.lg}px`,
        overflow: 'hidden',
        '&::before': { display: 'none' },
        '&.MuiAccordion-root': { borderRadius: `${t.radius.lg}px` },
        ...t.applyStyles('dark', { bgcolor: t.palette.grey[800] }),
      })}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={14} />}
        sx={(t) => ({
          minHeight: 42,
          px: 3,
          '& .MuiAccordionSummary-expandIconWrapper': { color: t.palette.primary.main },
        })}
      >
        <Typography variant="caption" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
          {label}
        </Typography>
      </AccordionSummary>
      {children !== null && (
        <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
          {children}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

function TypeFilterRow({
  icon,
  label,
  count,
  checked,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Checkbox
        size="small"
        checked={checked}
        onChange={onChange}
        sx={{ p: 0, flexShrink: 0 }}
      />
      <Box sx={(t) => ({
        width: 32, height: 32, flexShrink: 0,
        bgcolor: t.palette.primary.main,
        borderRadius: `${t.radius.md}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.palette.primary.contrastText,
      })}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ flex: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={(t) => ({ color: t.palette.primary.main, fontWeight: t.typography.fontWeightBold, flexShrink: 0 })}>
        {count}
      </Typography>
    </Box>
  );
}

function PanelCard({ children }: { children: ReactNode }) {
  return (
    <Box sx={(t) => ({
      bgcolor: t.surface.subtle,
      borderRadius: `${t.radius.xl}px`,
      p: 3,
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[800] }),
    })}>
      {children}
    </Box>
  );
}

function ResultItem({ item }: { item: LibraryItem }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      }}
      sx={(t) => ({
        display: 'flex', alignItems: 'center', gap: 3,
        px: 4, py: 3,
        border: `1px solid ${t.border.subtle}`,
        borderRadius: `${t.radius.lg}px`,
        cursor: 'pointer',
        transition: t.motion.short,
        '&:hover': {
          bgcolor: t.surface.subtle,
          borderColor: t.border.default,
        },
        '&:focus-visible': { ...focusRing(t) },
        ...t.applyStyles('dark', {
          borderColor: t.palette.grey[800],
          '&:hover': { bgcolor: t.palette.grey[800], borderColor: t.palette.grey[700] },
        }),
      })}
    >
      <Box sx={(t) => ({
        width: 38, height: 38, flexShrink: 0,
        bgcolor: t.palette.primary.main,
        borderRadius: `${t.radius.lg}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.palette.primary.contrastText,
      })}>
        {item.type === 'document'
          ? <FileText size={22} aria-hidden="true" />
          : <Network size={22} aria-hidden="true" />
        }
      </Box>
      <Typography
        variant="body2"
        sx={(t) => ({
          flex: 1,
          fontWeight: t.typography.fontWeightSemibold,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        })}
      >
        {item.title}
      </Typography>
      {item.isUpdated && (
        <Chip
          label="Updated"
          size="small"
          color="warning"
          variant="soft"
          sx={{ flexShrink: 0, height: 20, '& .MuiChip-label': { px: 1 } }}
        />
      )}
    </Box>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────────

export function OpenLibraryPage() {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeChip,   setActiveChip]   = useState<FilterChip>('ALL');
  const [specFilters,  setSpecFilters]  = useState<Set<SpecialtyKey>>(new Set());
  const [heentChecked, setHeentChecked] = useState(false);
  const [typePathways, setTypePathways] = useState(false);
  const [typeDocs,     setTypeDocs]     = useState(false);
  const [typeCalcs,    setTypeCalcs]    = useState(false);

  const filtered = useMemo(() => {
    let list = LIBRARY_ITEMS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }

    const hasTypeFilter = typePathways || typeDocs;
    if (hasTypeFilter) {
      list = list.filter((i) => {
        if (typePathways && i.type === 'pathway') return true;
        if (typeDocs     && i.type === 'document') return true;
        return false;
      });
    }

    return list;
  }, [searchQuery, typePathways, typeDocs]);

  const toggleSpec = (spec: SpecialtyKey) => {
    setSpecFilters((prev) => {
      const next = new Set(prev);
      next.has(spec) ? next.delete(spec) : next.add(spec);
      return next;
    });
  };

  return (
    <Box sx={(t) => ({
      display: 'flex', flexDirection: 'column', height: '100dvh',
      bgcolor: t.surface.canvas,
      ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
    })}>

      {/* ── Topbar ──────────────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={(t) => ({
          bgcolor: t.surface.canvas,
          borderBottom: `1px solid ${t.border.default}`,
          color: t.palette.text.primary,
          ...t.applyStyles('dark', {
            bgcolor: t.palette.grey[900],
            borderColor: t.palette.grey[700],
          }),
        })}
      >
        <Toolbar sx={{ minHeight: 52, px: 4 }}>
          {/* Left — brand logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={(t) => ({
              width: 32, height: 32,
              bgcolor: t.palette.primary.main,
              borderRadius: `${t.radius.md}px`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.palette.primary.contrastText,
            })}>
              <Typography sx={(t) => ({
                fontWeight: t.typography.fontWeightBold,
                fontSize: t.typography.h6.fontSize,
                color: 'inherit',
                lineHeight: 1,
              })}>
                C
              </Typography>
            </Box>
            <Typography variant="body1" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
              Curbside
            </Typography>
          </Box>

          {/* Center — page title, absolutely centered so logo/avatar don't affect it */}
          <Box sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 2,
            pointerEvents: 'none',
          }}>
            <Globe size={28} aria-hidden="true" />
            <Typography variant="subtitle1" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
              Curbside Open
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Right — avatar */}
          <Avatar
            aria-label="User account — HA"
            sx={(t) => ({
              width: 36, height: 36,
              bgcolor: t.palette.primary.main,
              fontSize: t.typography.caption.fontSize,
              fontWeight: t.typography.fontWeightBold,
              cursor: 'pointer',
            })}
          >
            HA
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* ── Search bar ──────────────────────────────────────────────────────── */}
      <Box sx={(t) => ({
        bgcolor: t.palette.primary.main,
        px: 4, py: 3,
        display: 'flex', justifyContent: 'center',
        flexShrink: 0,
      })}>
        <Box sx={(t) => ({
          display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: t.surface.canvas,
          borderRadius: `${t.radius.lg}px`,
          px: 3,
          width: '100%',
          maxWidth: 860,
          height: 46,
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
        })}>
          <Box component="span" sx={(t) => ({ color: t.palette.text.disabled, display: 'flex', flexShrink: 0 })}>
            <Search size={18} aria-hidden="true" />
          </Box>
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Curbside Open"
            inputProps={{ 'aria-label': 'Search Curbside Open' }}
            sx={(t) => ({ flex: 1, fontSize: t.typography.body1.fontSize })}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <IconButton
              size="small"
              aria-label="Filter options"
              sx={(t) => ({ color: t.palette.primary.main, p: 1 })}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
            </IconButton>
            <Switch size="small" aria-label="Toggle view mode" />
          </Box>
        </Box>
      </Box>

      {/* ── 3-column body ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left sidebar ──────────────────────────────────────────────────── */}
        <Box sx={(t) => ({
          width: 270, flexShrink: 0, overflow: 'auto',
          borderRight: `1px solid ${t.border.default}`,
          bgcolor: t.surface.canvas,
          px: 3, py: 4,
          display: 'flex', flexDirection: 'column', gap: 2,
          ...t.applyStyles('dark', {
            bgcolor: t.palette.grey[900],
            borderColor: t.palette.grey[700],
          }),
        })}>

          <FilterGroup label="Sort By ( Alphabetically )">
            <Typography variant="caption" color="text.secondary">
              Sorted alphabetically A–Z
            </Typography>
          </FilterGroup>

          <FilterGroup label="Ungrouped" defaultExpanded>
            <FilterGroupSearch />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={heentChecked}
                  onChange={(e) => setHeentChecked(e.target.checked)}
                />
              }
              label={<Typography variant="body2">HEENT</Typography>}
              sx={{ mx: 0 }}
            />
          </FilterGroup>

          <FilterGroup label="Specialties">
            <FilterGroupSearch />
            {SPECIALTIES.map((spec) => (
              <FormControlLabel
                key={spec}
                control={
                  <Checkbox
                    size="small"
                    checked={specFilters.has(spec)}
                    onChange={() => toggleSpec(spec)}
                  />
                }
                label={<Typography variant="body2">{spec}</Typography>}
                sx={{ mx: 0 }}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Types">
            <TypeFilterRow
              icon={<Network size={18} aria-hidden="true" />}
              label="Pathways"
              count={38}
              checked={typePathways}
              onChange={() => setTypePathways((v) => !v)}
            />
            <TypeFilterRow
              icon={<FileText size={18} aria-hidden="true" />}
              label="Text Documents"
              count={2}
              checked={typeDocs}
              onChange={() => setTypeDocs((v) => !v)}
            />
            <TypeFilterRow
              icon={<Calculator size={18} aria-hidden="true" />}
              label="Calculators"
              count={158}
              checked={typeCalcs}
              onChange={() => setTypeCalcs((v) => !v)}
            />
          </FilterGroup>

          {/* Editor Library View */}
          <Box
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
            }}
            sx={(t) => ({
              display: 'flex', alignItems: 'center', gap: 2,
              px: 3, py: 2,
              borderRadius: `${t.radius.lg}px`,
              cursor: 'pointer',
              color: t.palette.text.primary,
              transition: t.motion.short,
              mt: 1,
              '&:hover': { bgcolor: t.surface.subtle },
              '&:focus-visible': { ...focusRing(t) },
              ...t.applyStyles('dark', {
                '&:hover': { bgcolor: t.palette.grey[800] },
              }),
            })}
          >
            <Library size={16} aria-hidden="true" />
            <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightSemibold })}>
              Editor Library View
            </Typography>
          </Box>
        </Box>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <Box sx={(t) => ({
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          bgcolor: t.surface.canvas,
          ...t.applyStyles('dark', { bgcolor: t.palette.grey[900] }),
        })}>
          {/* Filter chips + result count */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            px: 5, pt: 4, pb: 3,
            flexWrap: 'wrap', flexShrink: 0,
          }}>
            {(['ALL', 'HEENT'] as FilterChip[]).map((chip) => {
              const isActive = activeChip === chip;
              return (
                <Chip
                  key={chip}
                  label={chip}
                  onClick={() => setActiveChip(chip)}
                  color={isActive ? 'primary' : 'default'}
                  sx={(t) => ({
                    borderRadius: `${t.radius.pill}px`,
                    fontWeight: isActive
                      ? t.typography.fontWeightSemibold
                      : t.typography.fontWeightMedium,
                    ...(isActive ? {} : {
                      bgcolor: t.surface.subtle,
                      color: t.palette.text.primary,
                      '&:hover': { bgcolor: t.fill.default },
                    }),
                  })}
                />
              );
            })}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', flexShrink: 0 }}>
              {filtered.length} Results
            </Typography>
          </Box>

          {/* Results list */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 5, pb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((item) => (
              <ResultItem key={item.id} item={item} />
            ))}
            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>
              End of list
            </Typography>
          </Box>
        </Box>

        {/* ── Right panel ───────────────────────────────────────────────────── */}
        <Box sx={(t) => ({
          width: 210, flexShrink: 0, overflow: 'auto',
          borderLeft: `1px solid ${t.border.default}`,
          bgcolor: t.surface.canvas,
          px: 3, py: 4,
          display: 'flex', flexDirection: 'column', gap: 3,
          ...t.applyStyles('dark', {
            bgcolor: t.palette.grey[900],
            borderColor: t.palette.grey[700],
          }),
        })}>

          {/* Download the Mobile App */}
          <PanelCard>
            <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightBold, mb: 2 })}>
              Download the Mobile App
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {['iOS', 'Android'].map((platform) => (
                <Box key={platform} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={(t) => ({
                    width: 70, height: 70,
                    bgcolor: t.surface.raised,
                    borderRadius: `${t.radius.sm}px`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...t.applyStyles('dark', { bgcolor: t.palette.grey[700] }),
                  })}>
                    <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', lineHeight: 1.3 }}>
                      QR Code
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{platform}</Typography>
                </Box>
              ))}
            </Box>
          </PanelCard>

          {/* Announcements */}
          <PanelCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ lineHeight: 1 }} aria-hidden="true">📢</Typography>
              <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
                Announcement
              </Typography>
              <Chip
                label="2"
                size="small"
                color="primary"
                sx={{ height: 18, '& .MuiChip-label': { px: 1 } }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ANNOUNCEMENTS.map((a) => (
                <Box
                  key={a.id}
                  sx={(t) => ({
                    bgcolor: t.surface.canvas,
                    borderRadius: `${t.radius.lg}px`,
                    px: 2, py: 2,
                    overflow: 'hidden',
                    ...t.applyStyles('dark', { bgcolor: alpha(t.palette.grey[900], 0.6) }),
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {a.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </PanelCard>

          {/* Newly Updated */}
          <PanelCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ lineHeight: 1 }} aria-hidden="true">✨</Typography>
              <Typography variant="body2" sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}>
                Newly Updated
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {LIBRARY_ITEMS.filter((i) => i.isUpdated).map((item) => (
                <Box
                  key={item.id}
                  sx={(t) => ({
                    display: 'flex', alignItems: 'center', gap: 2,
                    bgcolor: t.surface.canvas,
                    borderRadius: `${t.radius.lg}px`,
                    px: 2, py: 2,
                    overflow: 'hidden',
                    ...t.applyStyles('dark', { bgcolor: alpha(t.palette.grey[900], 0.6) }),
                  })}
                >
                  <Box sx={(t) => ({
                    width: 28, height: 28, flexShrink: 0,
                    bgcolor: t.palette.primary.main,
                    borderRadius: `${t.radius.md}px`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.palette.primary.contrastText,
                  })}>
                    <Network size={16} aria-hidden="true" />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </PanelCard>
        </Box>
      </Box>
    </Box>
  );
}
