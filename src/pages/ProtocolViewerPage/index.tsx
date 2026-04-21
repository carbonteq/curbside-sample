import { useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {
  Star, FileText, Paperclip, ChevronRight,
  BookOpen, Download, ExternalLink, Clock, User,
  AlertTriangle, CheckCircle, Info,
  GitBranch, Workflow, ClipboardList,
} from "lucide-react";
import { CsSidebarItem } from "../../components/CsSidebarItem";
import { CsSectionHeader } from "../../components/CsSectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

// All color references use palette intent keys — no hardcoded hex at call sites
type PaletteIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success";

// ─── Design-system-aligned config ────────────────────────────────────────────

const TYPE_COLOR: Record<string, PaletteIntent> = {
  Pathway:  "info",
  Protocol: "secondary",
  Document: "success",
  Workflow: "warning",
};

const TYPE_ICON: Record<string, React.ElementType> = {
  Pathway:  GitBranch,
  Protocol: ClipboardList,
  Document: FileText,
  Workflow: Workflow,
};

// Section marker configs — icon component + palette intent key
const SECTION_CONFIG: Record<string, { Icon: React.ElementType; colorKey: PaletteIntent }> = {
  info:  { Icon: Info,          colorKey: "info"    },
  alert: { Icon: AlertTriangle, colorKey: "warning" },
  check: { Icon: CheckCircle,   colorKey: "success" },
};

// ─── Mock protocol data ───────────────────────────────────────────────────────

const PROTOCOL = {
  id: "p-001",
  title: "Sepsis Management Protocol",
  category: "Protocol",
  specialty: "Critical Care",
  version: "v4.2",
  lastUpdated: "March 28, 2026",
  author: "Dr. Jordan Rivera, MD",
  authorInitials: "JR",
  institution: "Mayo Clinic",
  starred: false,
  sections: [
    {
      id: "s1",
      heading: "Purpose & Scope",
      icon: "info",
      content: `This protocol establishes standardized criteria and management steps for the identification and treatment of sepsis and septic shock in adult patients (≥18 years) presenting to or admitted at Mayo Clinic. It applies to all inpatient care areas including the Emergency Department, Medical/Surgical floors, and the Intensive Care Unit.`,
    },
    {
      id: "s2",
      heading: "Identification Criteria",
      icon: "alert",
      content: `Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. Screening should occur for any patient with suspected infection and two or more of the following SIRS criteria:

• Temperature > 38.3°C or < 36°C
• Heart rate > 90 bpm
• Respiratory rate > 20 breaths/min or PaCO₂ < 32 mmHg
• WBC > 12,000/μL, < 4,000/μL, or > 10% bands

Septic shock is identified by hypotension (MAP < 65 mmHg) despite adequate fluid resuscitation, requiring vasopressors, with a lactate > 2 mmol/L.`,
    },
    {
      id: "s3",
      heading: "Initial Management — The Sepsis Bundle",
      icon: "check",
      content: `Within 1 hour of sepsis recognition, complete all of the following:

1. Obtain blood cultures (≥2 sets) before antibiotic administration
2. Administer broad-spectrum IV antibiotics
3. Measure lactate; re-measure if initial lactate > 2 mmol/L
4. Administer 30 mL/kg crystalloid for hypotension or lactate ≥ 4 mmol/L
5. Apply vasopressors if patient is hypotensive during/after fluid resuscitation to maintain MAP ≥ 65 mmHg

Fluid resuscitation should be guided by reassessment of hemodynamic status. Avoid fluid overload — reassess after each 500 mL bolus.`,
    },
    {
      id: "s4",
      heading: "Antibiotic Selection",
      icon: "info",
      content: `Empiric antibiotic therapy should be started as soon as blood cultures are obtained. Selection should be guided by:

• Suspected source of infection
• Local resistance patterns
• Patient allergy history
• Prior culture results

Community-acquired: Piperacillin-tazobactam 4.5g IV q8h
Healthcare-associated: Add vancomycin 25–30 mg/kg IV for MRSA coverage
Immunocompromised: Extend gram-negative coverage; consult Infectious Disease

De-escalate therapy within 48–72 hours based on culture results.`,
    },
    {
      id: "s5",
      heading: "Monitoring & Reassessment",
      icon: "check",
      content: `Continuous monitoring is required for all sepsis patients:

• Vital signs every 30 minutes until stable, then every 1–2 hours
• Repeat lactate every 2 hours until < 2 mmol/L
• Urine output monitoring (goal ≥ 0.5 mL/kg/hr)
• Reassess fluid responsiveness with dynamic measures (pulse pressure variation, passive leg raise)
• Daily assessment for antibiotic de-escalation

ICU escalation criteria: persistent hypotension, lactate > 4 mmol/L, acute kidney injury, or respiratory failure (SpO₂ < 90% despite supplemental O₂).`,
    },
  ],
};

const ATTACHMENTS = [
  { id: "att1", name: "Sepsis Bundle Order Set.pdf",          size: "142 KB" },
  { id: "att2", name: "Quick Reference Card — Sepsis.pdf",    size: "84 KB"  },
  { id: "att3", name: "Vasopressor Titration Guide.xlsx",      size: "56 KB"  },
  { id: "att4", name: "Antibiotic Selection Algorithm.pdf",    size: "218 KB" },
];

const RELATED = [
  { id: "r1", title: "Sepsis Management Bundle",        type: "Pathway"  },
  { id: "r2", title: "Antibiotic Stewardship Protocol", type: "Protocol" },
  { id: "r3", title: "ICU Admission Criteria",          type: "Document" },
  { id: "r4", title: "Fluid Resuscitation Workflow",    type: "Workflow" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProtocolViewerPage() {
  const [starred, setStarred] = useState(PROTOCOL.starred);

  const typeColorKey = TYPE_COLOR[PROTOCOL.category] ?? "primary";

  return (
    <Box sx={(theme) => ({
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
      bgcolor: theme.surface.canvas,
      ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
    })}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        px: 6, py: 4,
        borderBottom: `1px solid ${theme.border.default}`,
        flexShrink: 0,
        ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
      })}>
        {/* Breadcrumb */}
        <Box component="nav" aria-label="Breadcrumb" sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1, mb: 1 })}>
          <Typography variant="caption" color="text.secondary"
            role="link" tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: "2px solid", outlineOffset: 2 } }}>
            Library
          </Typography>
          <Box component="span" sx={{ opacity: 0.4, display: "flex" }} aria-hidden="true">
            <ChevronRight size={12} />
          </Box>
          <Typography variant="caption" color="text.secondary"
            role="link" tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: "2px solid", outlineOffset: 2 } }}>
            Protocols
          </Typography>
          <Box component="span" sx={{ opacity: 0.4, display: "flex" }} aria-hidden="true">
            <ChevronRight size={12} />
          </Box>
          <Typography variant="caption" color="primary" aria-current="page">Sepsis Management Protocol</Typography>
        </Box>

        {/* Title row */}
        <Box sx={(theme) => ({ display: "flex", alignItems: "flex-start", gap: 4 })}>
          {/* Type icon bubble — alpha() called inside sx so theme is resolved */}
          <Box sx={(theme) => ({
            width: 40, height: 40, borderRadius: `${theme.radius.lg}px`,
            bgcolor: alpha(theme.palette[typeColorKey].main, 0.1),
            color: theme.palette[typeColorKey].main,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, mt: 1,
          })}>
            <BookOpen size={18} aria-hidden="true" />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1 })}>
              <Typography variant="h5" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, lineHeight: 1.3 })}>
                {PROTOCOL.title}
              </Typography>
              <Tooltip title={starred ? "Remove from starred" : "Add to starred"}>
                <IconButton
                  size="small"
                  aria-label={starred ? "Remove from starred" : "Add to starred"}
                  onClick={() => setStarred((s) => !s)}
                  sx={(theme) => ({
                    color: starred ? theme.palette.warning.main : theme.palette.text.disabled,
                    "&:hover": { color: theme.palette.warning.main },
                    transition: theme.motion.short,
                  })}
                >
                  <Star size={16} fill={starred ? "currentColor" : "none"} aria-hidden="true" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1, mt: 1, flexWrap: "wrap" })}>
              {/* Chip color prop handles dark mode automatically */}
              <Chip label={PROTOCOL.category}  size="small" color={typeColorKey}  variant="soft" />
              <Chip label={PROTOCOL.specialty}  size="small" color="primary"       variant="soft" />
              <Chip label={PROTOCOL.version}    size="small" variant="outlined" />
              <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1 })}>
                <Box component="span" sx={{ opacity: 0.5, display: "flex" }}>
                  <Clock size={12} aria-hidden="true" />
                </Box>
                <Typography variant="caption" color="text.secondary">Updated {PROTOCOL.lastUpdated}</Typography>
              </Box>
              <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 1 })}>
                <Box component="span" sx={{ opacity: 0.5, display: "flex" }}>
                  <User size={12} aria-hidden="true" />
                </Box>
                <Typography variant="caption" color="text.secondary">{PROTOCOL.author}</Typography>
              </Box>
            </Box>
          </Box>

          <Button variant="outlined" size="small" startIcon={<Download size={13} aria-hidden="true" />} sx={{ flexShrink: 0 }}>
            Export
          </Button>
        </Box>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Main content area */}
        <Box sx={(theme) => ({
          flex: 1, overflow: "auto",
          px: { xs: 6, md: 8 },
          py: 6,
        })}>
          <Box sx={{ maxWidth: 780 }}>
            {PROTOCOL.sections.map((section, idx) => {
              const secCfg = SECTION_CONFIG[section.icon] ?? SECTION_CONFIG.info;
              const { Icon: SectionIcon } = secCfg;

              return (
                <Box key={section.id} sx={(theme) => ({ mb: 7 })}>
                  {/* Section heading */}
                  <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: 2, mb: 2 })}>
                    <Box sx={(theme) => ({ color: theme.palette[secCfg.colorKey].main, display: "flex", alignItems: "center" })}>
                      <SectionIcon size={14} aria-hidden="true" />
                    </Box>
                    <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}>
                      {section.heading}
                    </Typography>
                  </Box>

                  {idx === 0 && (
                    <Divider sx={(theme) => ({
                      mb: 2, borderColor: theme.border.subtle,
                      ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
                    })} />
                  )}

                  {/* Section body */}
                  <Box sx={(theme) => ({
                    p: 5,
                    borderRadius: `${theme.radius.lg}px`,
                    border: `1px solid ${theme.border.subtle}`,
                    bgcolor: theme.surface.subtle,
                    ...theme.applyStyles("dark", {
                      bgcolor: theme.palette.grey[800],
                      borderColor: theme.palette.grey[700],
                    }),
                  })}>
                    <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
                      {section.content}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {/* Author card */}
            <Box sx={(theme) => ({
              display: "flex", alignItems: "center", gap: 3,
              p: 4,
              borderRadius: `${theme.radius.lg}px`,
              border: `1px solid ${theme.border.default}`,
              bgcolor: theme.surface.canvas,
              mt: 4,
              ...theme.applyStyles("dark", {
                bgcolor: theme.palette.grey[900],
                borderColor: theme.palette.grey[700],
              }),
            })}>
              <Avatar variant="soft" color="primary" sx={{ width: 36, height: 36 }}>
                {PROTOCOL.authorInitials}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemibold })}>{PROTOCOL.author}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {PROTOCOL.institution} · Critical Care Medicine
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Right sidebar – attachments & related ──────────────────────── */}
        <Box sx={(theme) => ({
          width: 260, flexShrink: 0, overflow: "auto",
          borderLeft: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.subtle,
          px: 4, py: 6,
          display: "flex", flexDirection: "column", gap: 6,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {/* Attachments */}
          <Box>
            <CsSectionHeader
              variant="eyebrow"
              icon={<Paperclip size={13} />}
              title={`Attachments (${ATTACHMENTS.length})`}
            />
            <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: 1 })}>
              {ATTACHMENTS.map((att) => (
                <CsSidebarItem
                  key={att.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Download ${att.name}`}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
                >
                  <Box sx={(theme) => ({ color: theme.palette.primary.main, flexShrink: 0 })}>
                    <FileText size={14} aria-hidden="true" />
                  </Box>
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography variant="caption" sx={(theme) => ({
                      display: "block", fontWeight: theme.typography.fontWeightMedium,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    })}>
                      {att.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {att.size}
                    </Typography>
                  </Box>
                  <Box component="span" sx={{ opacity: 0.4, display: "flex", flexShrink: 0 }}>
                    <Download size={12} aria-hidden="true" />
                  </Box>
                </CsSidebarItem>
              ))}
            </Box>
          </Box>

          <Divider sx={(theme) => ({
            borderColor: theme.border.subtle,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })} />

          {/* Related content */}
          <Box>
            <CsSectionHeader
              variant="eyebrow"
              icon={<ExternalLink size={13} />}
              title="Related Content"
            />
            <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: 1 })}>
              {RELATED.map((rel) => {
                const relColorKey = TYPE_COLOR[rel.type] ?? "primary";
                const RelIcon = TYPE_ICON[rel.type] ?? FileText;
                return (
                  <CsSidebarItem key={rel.id}>
                    {/* Type icon + palette color — never color-only */}
                    <Box sx={(theme) => ({ color: theme.palette[relColorKey].main, display: "flex", flexShrink: 0 })}>
                      <RelIcon size={13} aria-hidden="true" />
                    </Box>
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      <Typography variant="caption" sx={(theme) => ({
                        display: "block", fontWeight: theme.typography.fontWeightMedium,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      })}>
                        {rel.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rel.type}
                      </Typography>
                    </Box>
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
