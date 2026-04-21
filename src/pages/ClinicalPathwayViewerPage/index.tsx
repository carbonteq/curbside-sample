import { useState, useEffect, useRef, useCallback } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {
  Plus, Minus, Maximize2, Share2, Camera, Printer,
  BookOpen, MessageSquare, X, Clock, User, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PillKind = "decision" | "action" | "outcome" | "reference";
type PaletteIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATHWAY = {
  title: "Community-Acquired Pneumonia — Adult Admission & Empiric Therapy",
  subtitle: "Treatment options based on IDSA/ATS major and minor criteria",
  version: "v2.1",
  reviewed: "March 2026",
  author: "Dr. J. Smith, ED Medical Director",
  source: "IDSA/ATS Adult CAP Guideline, 2019 Ed.",
};

const FOOTNOTES: Record<number, string> = {
  1: "Minor criteria: respiratory rate ≥ 30/min, PaO₂/FiO₂ ≤ 250, multilobar infiltrates, confusion/disorientation, uremia (BUN ≥ 20 mg/dL), leukopenia (WBC < 4,000 cells/mm³), thrombocytopenia (platelets < 100,000/mm³), hypothermia (core temp < 36°C), or hypotension requiring aggressive fluid resuscitation.",
  2: "Major criteria: septic shock with need for vasopressors, or respiratory failure requiring mechanical ventilation.",
  3: "Prior isolation within the last 12 months from any site is relevant. Check recent microbiology results and prior hospitalisation notes before selecting the escalated regimen.",
  4: "Adjust vancomycin dose based on trough levels after the 3rd dose. Target 15–20 mg/L for severe infections. Consult pharmacy for renal dosing.",
};

const ABBREVIATIONS: { k: string; v: string }[] = [
  { k: "CAP",  v: "Community-Acquired Pneumonia" },
  { k: "ICU",  v: "Intensive Care Unit" },
  { k: "IV",   v: "Intravenous" },
  { k: "MRSA", v: "Methicillin-Resistant Staphylococcus aureus" },
  { k: "BUN",  v: "Blood Urea Nitrogen" },
  { k: "WBC",  v: "White Blood Cell count" },
  { k: "PaO₂", v: "Partial pressure of oxygen (arterial)" },
  { k: "FiO₂", v: "Fraction of inspired oxygen" },
  { k: "IDSA", v: "Infectious Diseases Society of America" },
  { k: "ATS",  v: "American Thoracic Society" },
];

const ORGANISMS: string[] = [
  "Streptococcus pneumoniae",
  "Mycoplasma pneumoniae",
  "Haemophilus influenzae",
  "Moraxella catarrhalis",
  "Chlamydophila pneumoniae",
  "Legionella species",
  "Staphylococcus aureus",
  "Gram-negative rods",
];

// ─── Canvas layout constants ───────────────────────────────────────────────────
// These are diagram-coordinate values, not spacing tokens

const CANVAS_W = 1560;
const CANVAS_H = 1820;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1.6;

// Pill kind → palette intent (decision uses the default outlined style)
const PILL_PALETTE: Partial<Record<PillKind, PaletteIntent>> = {
  action:    "success",
  outcome:   "error",
  reference: "primary",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Superscript footnote reference button */
function FnRef({ n, onFootnote }: { n: number; onFootnote: (n: number, e: React.MouseEvent) => void }) {
  return (
    <Box
      component="button"
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); onFootnote(n, e); }}
      aria-label={`View footnote ${n}`}
      sx={(theme) => ({
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 18, height: 18, px: "5px",
        border: `1px solid ${theme.border.default}`,
        bgcolor: theme.surface.canvas,
        color: "text.secondary",
        borderRadius: `${theme.radius.pill}px`,
        fontSize: 11, fontWeight: theme.typography.fontWeightBold,
        cursor: "pointer", verticalAlign: "middle", ml: "2px",
        fontFamily: "inherit",
        transition: theme.motion.short,
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: "text.primary",
        },
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[800],
          borderColor: theme.palette.grey[600],
          "&:hover": { bgcolor: theme.palette.grey[700] },
        }),
      })}
    >
      {n}
    </Box>
  );
}

/** Rounded pill — decision / action / outcome / reference */
function Pill({
  kind = "decision",
  children,
  footnoteIds = [],
  onFootnote,
  wide = false,
}: {
  kind?: PillKind;
  children: React.ReactNode;
  footnoteIds?: number[];
  onFootnote?: (n: number, e: React.MouseEvent) => void;
  wide?: boolean;
}) {
  const intentKey = PILL_PALETTE[kind];

  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: theme.space.sm,
        px: theme.space.md,
        py: theme.space.xs,
        border: `1px solid ${theme.border.default}`,
        borderRadius: `${theme.radius.pill}px`,
        fontSize: 14,
        lineHeight: 1.3,
        whiteSpace: wide ? "normal" : "nowrap",
        // Filled kinds
        ...(intentKey
          ? {
              bgcolor: theme.palette[intentKey].main,
              color: theme.palette[intentKey].contrastText,
              borderColor: theme.palette[intentKey].main,
            }
          : {
              // Decision: white bg, border
              bgcolor: theme.surface.canvas,
              color: "text.primary",
              ...theme.applyStyles("dark", {
                bgcolor: theme.palette.grey[800],
                borderColor: theme.palette.grey[600],
              }),
            }),
      })}
    >
      <span>{children}</span>
      {footnoteIds.map((n) =>
        onFootnote ? <FnRef key={n} n={n} onFootnote={onFootnote} /> : null,
      )}
    </Box>
  );
}

/** Card node — white card with a tinted header strip */
function CardNode({
  x, y, w,
  title,
  footnoteIds = [],
  onFootnote,
  children,
}: {
  x: number; y: number; w: number;
  title: string;
  footnoteIds?: number[];
  onFootnote: (n: number, e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={(theme) => ({
        position: "absolute", left: x, top: y, width: w,
        bgcolor: theme.surface.canvas,
        border: `1px solid ${theme.border.default}`,
        borderRadius: `${theme.radius.lg}px`,
        boxShadow: theme.shadows[1],
        overflow: "hidden",
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[800],
          borderColor: theme.palette.grey[700],
          boxShadow: "none",
        }),
      })}
    >
      {/* Header strip */}
      <Box sx={(theme) => ({
        px: theme.space.lg, py: "12px",
        bgcolor: alpha(theme.palette.primary.main, 0.10),
        borderBottom: `1px solid ${theme.border.default}`,
        display: "flex", alignItems: "center", gap: theme.space.sm,
        ...theme.applyStyles("dark", {
          bgcolor: alpha(theme.palette.primary.main, 0.18),
          borderColor: theme.palette.grey[700],
        }),
      })}>
        <Typography sx={(theme) => ({ fontSize: 18, fontWeight: theme.typography.fontWeightBold, letterSpacing: "-0.005em" })}>
          {title}
        </Typography>
        {footnoteIds.map((n) => (
          <FnRef key={n} n={n} onFootnote={onFootnote} />
        ))}
      </Box>
      {/* Body */}
      <Box sx={(theme) => ({ p: theme.space.lg })}>
        {children}
      </Box>
    </Box>
  );
}

/** Diamond decision shape using SVG polygon; fill/stroke driven by CSS custom properties */
function Diamond({
  x, y, w, h,
  children,
  footnoteIds = [],
  onFootnote,
}: {
  x: number; y: number; w: number; h: number;
  children: React.ReactNode;
  footnoteIds?: number[];
  onFootnote: (n: number, e: React.MouseEvent) => void;
}) {
  const pts = `${w / 2},1 ${w - 1},${h / 2} ${w / 2},${h - 1} 1,${h / 2}`;
  return (
    <Box sx={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* SVG shape — fill/stroke use CSS custom properties set on the canvas wrapper */}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
        <polygon points={pts} fill="var(--cpv-diamond-fill)" stroke="var(--cpv-diamond-stroke)" strokeWidth={1} />
      </svg>
      {/* Text layer */}
      <Box sx={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", px: "14%",
      }}>
        <Typography sx={(theme) => ({ fontSize: 14, fontWeight: theme.typography.fontWeightMedium, lineHeight: 1.35 })}>
          {children}
          {footnoteIds.map((n) => (
            <FnRef key={n} n={n} onFootnote={onFootnote} />
          ))}
        </Typography>
      </Box>
    </Box>
  );
}

/** Small label that sits at decision branches */
function BranchLabel({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <Box sx={(theme) => ({
      position: "absolute", left: x, top: y,
      px: "10px", py: "4px",
      bgcolor: theme.surface.canvas,
      border: `1px solid ${theme.border.default}`,
      borderRadius: `${theme.radius.md}px`,
      fontSize: 13, fontWeight: theme.typography.fontWeightMedium,
      color: "text.secondary",
      ...theme.applyStyles("dark", {
        bgcolor: theme.palette.grey[800],
        borderColor: theme.palette.grey[600],
      }),
    })}>
      {children}
    </Box>
  );
}

/** SVG arrow-edge layer rendered behind all nodes */
function Edges({ paths }: { paths: string[] }) {
  return (
    <svg
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        <marker id="cpv-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--cpv-edge-stroke)" />
        </marker>
      </defs>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="var(--cpv-edge-stroke)"
          strokeWidth={1.25}
          fill="none"
          markerEnd="url(#cpv-arrow)"
        />
      ))}
    </svg>
  );
}

/** The full pannable/zoomable diagram canvas */
function PathwayCanvas({
  onFootnote,
  onOpenOrganisms,
  showGrid,
}: {
  onFootnote: (n: number, e: React.MouseEvent) => void;
  onOpenOrganisms: () => void;
  showGrid: boolean;
}) {
  const cx       = CANVAS_W / 2;
  const leftCX   = 430;
  const rightCX  = 1130;
  const bigCardW = 620;
  const smallCardW = 430;

  // Precompute edge SVG paths
  const edges = useCallback(() => {
    const v = (x: number, y1: number, y2: number) => `M ${x} ${y1} L ${x} ${y2}`;
    return [
      v(cx, 78, 130),
      v(cx, 440, 500),
      `M ${cx} 500 L ${leftCX} 500 L ${leftCX} 540`,
      `M ${cx} 500 L ${rightCX} 500 L ${rightCX} 540`,
      v(leftCX, 590, 630),
      v(rightCX, 590, 630),
      v(leftCX, 680, 730),
      v(rightCX, 680, 730),
      `M ${leftCX} 780 L ${leftCX} 830 L ${cx - 130} 830`,
      `M ${rightCX} 780 L ${rightCX} 830 L ${cx + 130} 830`,
      v(cx, 1030, 1090),
      `M ${cx} 1090 L ${leftCX} 1090 L ${leftCX} 1130`,
      `M ${cx} 1090 L ${rightCX} 1090 L ${rightCX} 1130`,
      v(leftCX, 1170, 1210),
      v(rightCX, 1170, 1210),
    ];
  }, [cx, leftCX, rightCX])();

  const sectionLabel: React.CSSProperties = {
    fontSize: 12, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: 8,
  };
  const helperText: React.CSSProperties = {
    fontSize: 13, marginBottom: 6,
  };
  const listBase: React.CSSProperties = {
    margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.55,
  };

  return (
    <Box
      sx={(theme) => ({
        position: "relative", width: CANVAS_W, height: CANVAS_H,
        // CSS custom properties used by SVG children
        "--cpv-diamond-fill":   theme.surface.canvas,
        "--cpv-diamond-stroke": theme.border.default,
        "--cpv-edge-stroke":    theme.border.strong,
        ...(showGrid
          ? { backgroundImage: `radial-gradient(circle, var(--cpv-edge-stroke) 1px, transparent 1px)`, backgroundSize: "20px 20px" }
          : {}),
        ...theme.applyStyles("dark", {
          "--cpv-diamond-fill":   theme.palette.grey[800],
          "--cpv-diamond-stroke": theme.palette.grey[600],
          "--cpv-edge-stroke":    theme.palette.grey[600],
        }),
      })}
    >
      <Edges paths={edges} />

      {/* ── Start pill ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: "absolute", left: cx - 280, top: 30, width: 560, display: "flex", justifyContent: "center" }}>
        <Pill kind="action">Begin — Evaluate severity on admission</Pill>
      </Box>

      {/* ── Clinical Criteria card ─────────────────────────────────────────── */}
      <CardNode x={cx - bigCardW / 2} y={130} w={bigCardW} title="Clinical Criteria" footnoteIds={[1, 2]} onFootnote={onFootnote}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mb: theme.space.sm })}>
              Minor criteria
            </Box>
            <ul style={listBase}>
              <li>Respiratory rate ≥ 30 breaths/min</li>
              <li>PaO₂/FiO₂ ratio ≤ 250</li>
              <li>Multilobar infiltrates</li>
              <li>Confusion / disorientation</li>
              <li>Uremia (BUN ≥ 20 mg/dL)</li>
              <li>Leukopenia (WBC &lt; 4,000 cells/mm³)</li>
            </ul>
          </div>
          <div>
            <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mb: theme.space.sm })}>
              Major criteria
            </Box>
            <ul style={listBase}>
              <li>Septic shock requiring vasopressors</li>
              <li>Respiratory failure requiring mechanical ventilation</li>
            </ul>
            <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mt: theme.space.lg, mb: "2px" })}>
              Assess within
            </Box>
            <Box sx={(theme) => ({
              display: "inline-flex", alignItems: "center", gap: theme.space.xs,
              mt: "2px", px: theme.space.md, py: "6px",
              border: `1px solid ${theme.border.default}`,
              borderRadius: `${theme.radius.pill}px`,
              fontSize: 13, color: "text.secondary",
              bgcolor: theme.surface.subtle,
              ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[700], borderColor: theme.palette.grey[600] }),
            })}>
              <Clock size={13} aria-hidden="true" />
              <span>First 4 hours of admission</span>
            </Box>
          </div>
        </Box>
      </CardNode>

      {/* ── Likely organisms reference pill ───────────────────────────────── */}
      <Box sx={{ position: "absolute", left: cx - bigCardW / 2, top: 448, width: bigCardW, display: "flex", justifyContent: "flex-end" }}>
        <Box component="button" onClick={onOpenOrganisms} sx={{ cursor: "pointer", background: "none", border: "none", p: 0 }}>
          <Pill kind="reference">Likely organisms · reference</Pill>
        </Box>
      </Box>

      {/* ── Branch decision pills ──────────────────────────────────────────── */}
      <Box sx={{ position: "absolute", left: leftCX - 180, top: 540, width: 360, display: "flex", justifyContent: "center" }}>
        <Pill kind="decision">0 major or &lt; 3 minor criteria</Pill>
      </Box>
      <Box sx={{ position: "absolute", left: rightCX - 180, top: 540, width: 360, display: "flex", justifyContent: "center" }}>
        <Pill kind="decision">≥ 1 major or ≥ 3 minor criteria</Pill>
      </Box>

      {/* ── Admit outcome pills ────────────────────────────────────────────── */}
      <Box sx={{ position: "absolute", left: leftCX - 160, top: 630, width: 320, display: "flex", justifyContent: "center" }}>
        <Pill kind="outcome">Admit to Floor</Pill>
      </Box>
      <Box sx={{ position: "absolute", left: rightCX - 160, top: 630, width: 320, display: "flex", justifyContent: "center" }}>
        <Pill kind="outcome">Admit to ICU</Pill>
      </Box>

      {/* ── Start antibiotics action pills ────────────────────────────────── */}
      <Box sx={{ position: "absolute", left: leftCX - 200, top: 730, width: 400, display: "flex", justifyContent: "center" }}>
        <Pill kind="action">Start empiric antibiotics within 1 hour</Pill>
      </Box>
      <Box sx={{ position: "absolute", left: rightCX - 200, top: 730, width: 400, display: "flex", justifyContent: "center" }}>
        <Pill kind="action">Start empiric antibiotics within 1 hour</Pill>
      </Box>

      {/* ── MRSA / Pseudomonas decision diamond ───────────────────────────── */}
      <Diamond x={cx - 210} y={830} w={420} h={200} onFootnote={onFootnote} footnoteIds={[3]}>
        Previous MRSA or <em>Pseudomonas aeruginosa</em> isolation?
      </Diamond>

      {/* ── Branch labels ─────────────────────────────────────────────────── */}
      <BranchLabel x={leftCX - 18} y={1100}>No</BranchLabel>
      <BranchLabel x={rightCX - 22} y={1100}>Yes</BranchLabel>

      {/* ── Standard empiric therapy card ─────────────────────────────────── */}
      <CardNode x={leftCX - smallCardW / 2} y={1210} w={smallCardW} title="Standard empiric therapy" onFootnote={onFootnote}>
        <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mb: theme.space.sm })}>
          Combination therapy
        </Box>
        <Box component="p" sx={(theme) => ({ ...helperText, color: theme.palette.text.secondary, m: 0, mb: theme.space.xs })}>
          One of the following beta-lactams (IV):
        </Box>
        <ul style={listBase}>
          <li>Ampicillin-sulbactam 1.5–3 g every 6 hours</li>
          <li>Cefotaxime 1–2 g every 8 hours</li>
          <li>Ceftriaxone 1–2 g daily</li>
          <li>Ceftaroline 600 mg every 12 hours</li>
        </ul>
        <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mt: theme.space.lg, mb: theme.space.xs })}>
          Plus a macrolide
        </Box>
        <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.sm, alignItems: "flex-start" })}>
          <Pill>Azithromycin 500 mg orally or IV daily</Pill>
          <Pill wide>Clarithromycin 500 mg orally twice daily</Pill>
        </Box>
        <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mt: theme.space.lg, mb: theme.space.xs })}>
          Or monotherapy
        </Box>
        <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.sm, alignItems: "flex-start" })}>
          <Pill>Ceftazidime 2 g every 8 hours</Pill>
          <Pill wide>Piperacillin-tazobactam 4.5 g every 6 hours</Pill>
        </Box>
      </CardNode>

      {/* ── Escalated empiric therapy card ────────────────────────────────── */}
      <CardNode x={rightCX - smallCardW / 2} y={1210} w={smallCardW} title="Escalated empiric therapy" footnoteIds={[4]} onFootnote={onFootnote}>
        <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mb: theme.space.xs })}>
          If previous MRSA, add one
        </Box>
        <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.sm, alignItems: "flex-start" })}>
          <Pill wide>Vancomycin 15 mg/kg IV every 12 hours (adjust by level)</Pill>
          <Pill wide>Linezolid 600 mg IV every 12 hours</Pill>
        </Box>
        <Box component="p" sx={(theme) => ({ ...sectionLabel, color: theme.palette.text.secondary, m: 0, mt: theme.space.lg, mb: theme.space.xs })}>
          If previous Pseudomonas, use one
        </Box>
        <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.sm, alignItems: "flex-start" })}>
          <Pill>Imipenem 500 mg IV every 6 hours</Pill>
          <Pill>Meropenem 1 g IV every 8 hours</Pill>
          <Pill>Aztreonam 2 g IV every 8 hours</Pill>
          <Pill>Ceftazidime 2 g IV every 8 hours</Pill>
          <Pill wide>Piperacillin-tazobactam 4.5 g IV every 6 hours</Pill>
        </Box>
      </CardNode>
    </Box>
  );
}

// ─── Overlay: Zoom panel ──────────────────────────────────────────────────────

function ZoomPanel({
  zoom,
  onIn,
  onOut,
  onFit,
}: {
  zoom: number;
  onIn: () => void;
  onOut: () => void;
  onFit: () => void;
}) {
  return (
    <Box sx={(theme) => ({
      position: "absolute", right: theme.space.xl, top: theme.space.xl,
      display: "flex", flexDirection: "column", gap: "2px",
      p: "6px",
      bgcolor: theme.surface.canvas,
      border: `1px solid ${theme.border.default}`,
      borderRadius: `${theme.radius.pill}px`,
      boxShadow: theme.shadows[3],
      ...theme.applyStyles("dark", {
        bgcolor: theme.palette.grey[800],
        borderColor: theme.palette.grey[700],
      }),
    })}>
      <Tooltip title="Zoom in" placement="left">
        <IconButton size="small" onClick={onIn} aria-label="Zoom in">
          <Plus size={16} aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Typography sx={(theme) => ({
        fontSize: 11, textAlign: "center", color: "text.secondary",
        py: "4px", fontVariantNumeric: "tabular-nums",
        minWidth: theme.space["3xl"],
      })}>
        {Math.round(zoom * 100)}%
      </Typography>
      <Tooltip title="Zoom out" placement="left">
        <IconButton size="small" onClick={onOut} aria-label="Zoom out">
          <Minus size={16} aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Divider sx={(theme) => ({ my: "4px", borderColor: theme.border.subtle })} />
      <Tooltip title="Fit to screen" placement="left">
        <IconButton size="small" onClick={onFit} aria-label="Fit to screen">
          <Maximize2 size={16} aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ─── Overlay: Legend ──────────────────────────────────────────────────────────

function Legend() {
  return (
    <Box sx={(theme) => ({
      position: "absolute", right: theme.space.xl, bottom: theme.space.xl,
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      border: `1px solid ${theme.border.default}`,
      borderRadius: `${theme.radius.lg}px`,
      p: theme.space.md,
      boxShadow: theme.shadows[2],
      display: "flex", flexDirection: "column", gap: "6px",
      minWidth: 148,
      ...theme.applyStyles("dark", {
        bgcolor: theme.palette.grey[800],
        borderColor: theme.palette.grey[700],
      }),
    })}>
      <Typography sx={(theme) => ({
        fontSize: 11, fontWeight: theme.typography.fontWeightBold,
        textTransform: "uppercase", letterSpacing: "0.08em",
        mb: "2px",
      })}>
        Legend
      </Typography>
      {/* Decision */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width={22} height={14} aria-hidden="true">
          <polygon points="11,1 21,7 11,13 1,7" fill="var(--cpv-diamond-fill)" stroke="var(--cpv-diamond-stroke)" />
        </svg>
        <Typography variant="caption" color="text.secondary">Decision</Typography>
      </Box>
      {/* Action */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={(theme) => ({
          width: 22, height: 12, borderRadius: `${theme.radius.pill}px`,
          bgcolor: theme.palette.success.main, flexShrink: 0,
        })} />
        <Typography variant="caption" color="text.secondary">Action</Typography>
      </Box>
      {/* Outcome */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={(theme) => ({
          width: 22, height: 12, borderRadius: `${theme.radius.pill}px`,
          bgcolor: theme.palette.error.main, flexShrink: 0,
        })} />
        <Typography variant="caption" color="text.secondary">Outcome</Typography>
      </Box>
      {/* Reference */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={(theme) => ({
          width: 22, height: 12, borderRadius: `${theme.radius.pill}px`,
          bgcolor: theme.palette.primary.main, flexShrink: 0,
        })} />
        <Typography variant="caption" color="text.secondary">Reference</Typography>
      </Box>
      {/* Card */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={(theme) => ({
          width: 22, height: 12, flexShrink: 0,
          bgcolor: theme.surface.canvas,
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.sm}px`,
          boxShadow: `inset 0 4px 0 ${alpha(theme.palette.primary.main, 0.10)}`,
          ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[800] }),
        })} />
        <Typography variant="caption" color="text.secondary">Card</Typography>
      </Box>
    </Box>
  );
}

// ─── Overlay: Bottom toolbar ──────────────────────────────────────────────────

function CpToolbar({
  sidebarOpen,
  onToggleSidebar,
  onShare,
  onPrint,
  onScreenshot,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onShare: () => void;
  onPrint: () => void;
  onScreenshot: () => void;
}) {
  const ToolBtn = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <Tooltip title={label}>
      <Button
        onClick={onClick}
        variant="text"
        size="small"
        sx={(theme) => ({
          display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
          px: theme.space.md, py: theme.space.xs,
          minWidth: 64, color: "text.secondary",
          fontSize: 11,
          "&:hover": { bgcolor: theme.fill.default },
          ...theme.applyStyles("dark", { "&:hover": { bgcolor: theme.palette.grey[700] } }),
        })}
        aria-label={label}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Tooltip>
  );

  return (
    <Box sx={(theme) => ({
      position: "absolute", bottom: theme.space.xl,
      left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: theme.space.xs,
      p: theme.space.sm,
      bgcolor: theme.surface.canvas,
      border: `1px solid ${theme.border.default}`,
      borderRadius: `${theme.radius.lg}px`,
      boxShadow: theme.shadows[4],
      ...theme.applyStyles("dark", {
        bgcolor: theme.palette.grey[800],
        borderColor: theme.palette.grey[700],
      }),
    })}>
      <ToolBtn
        icon={<BookOpen size={16} aria-hidden="true" />}
        label={sidebarOpen ? "Hide glossary" : "Glossary"}
        onClick={onToggleSidebar}
      />
      <Divider orientation="vertical" flexItem sx={(theme) => ({ borderColor: theme.border.subtle })} />
      <ToolBtn icon={<Camera size={16} aria-hidden="true" />} label="Screenshot" onClick={onScreenshot} />
      <ToolBtn icon={<Share2 size={16} aria-hidden="true" />} label="Share" onClick={onShare} />
      <ToolBtn icon={<Printer size={16} aria-hidden="true" />} label="Print" onClick={onPrint} />
    </Box>
  );
}

// ─── Left sidebar: Glossary ───────────────────────────────────────────────────

function CpSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Box sx={(theme) => ({
      width: open ? 320 : 0,
      flexShrink: 0,
      bgcolor: theme.surface.subtle,
      borderRight: open ? `1px solid ${theme.border.default}` : "none",
      transition: theme.motion.standard,
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      ...theme.applyStyles("dark", {
        bgcolor: theme.palette.grey[850] ?? theme.palette.grey[900],
        borderColor: theme.palette.grey[700],
      }),
    })}>
      <Box sx={(theme) => ({ width: 320, p: theme.space.lg, overflowY: "auto", height: "100%" })}>
        {/* Header */}
        <Box sx={(theme) => ({
          display: "flex", alignItems: "center", justifyContent: "space-between",
          mb: theme.space.xs,
        })}>
          <Typography variant="h6" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}>
            Abbreviations
          </Typography>
          <Tooltip title="Close glossary">
            <IconButton size="small" onClick={onClose} aria-label="Close glossary">
              <X size={14} aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={(theme) => ({ display: "block", mb: theme.space.lg })}>
          Persistent — always available while you read.
        </Typography>

        {/* Abbreviations table */}
        <Box sx={(theme) => ({
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.lg}px`,
          bgcolor: theme.surface.canvas,
          overflow: "hidden",
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          {ABBREVIATIONS.map((a, i) => (
            <Box key={a.k} sx={(theme) => ({
              display: "grid", gridTemplateColumns: "72px 1fr", gap: theme.space.sm,
              px: theme.space.md, py: theme.space.sm,
              borderTop: i === 0 ? "none" : `1px solid ${theme.border.subtle}`,
              fontSize: 13,
              ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
            })}>
              <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, color: "text.primary" })}>
                {a.k}
              </Typography>
              <Typography variant="caption" color="text.secondary">{a.v}</Typography>
            </Box>
          ))}
        </Box>

        {/* Organisms */}
        <Typography variant="h6" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, mt: theme.space["3xl"], mb: theme.space.sm })}>
          Likely organisms
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={(theme) => ({ display: "block", mb: theme.space.md })}>
          Organisms responsible for CAP include:
        </Typography>
        <Box sx={(theme) => ({
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.lg}px`,
          bgcolor: theme.surface.canvas,
          px: theme.space.lg, py: theme.space.md,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8 }}>
            {ORGANISMS.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </Box>

        {/* Source */}
        <Typography variant="h6" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, mt: theme.space["3xl"], mb: theme.space.sm })}>
          Source
        </Typography>
        <Box sx={(theme) => ({
          fontSize: 13, color: "text.secondary",
          bgcolor: theme.surface.canvas,
          border: `1px solid ${theme.border.default}`,
          borderRadius: `${theme.radius.lg}px`,
          p: theme.space.md,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          <Typography variant="caption" sx={(theme) => ({ display: "block", fontWeight: theme.typography.fontWeightBold, color: "text.primary", mb: "4px" })}>
            {PATHWAY.source}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Clinical criteria follow IDSA/ATS consensus. Empiric regimens reflect local antibiogram defaults; verify against institutional stewardship guidance before prescribing.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Top header ───────────────────────────────────────────────────────────────

function CpHeader({ onFeedback }: { onFeedback: () => void }) {
  return (
    <Box sx={(theme) => ({
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      borderBottom: `1px solid ${theme.border.default}`,
      px: theme.space["2xl"], py: "14px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: theme.space.lg, flexShrink: 0,
      ...theme.applyStyles("dark", {
        bgcolor: alpha(theme.palette.primary.main, 0.14),
        borderColor: theme.palette.grey[700],
      }),
    })}>
      {/* Left: logo + title */}
      <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 })}>
        <Box sx={(theme) => ({
          width: 32, height: 32,
          borderRadius: `${theme.radius.lg}px`,
          bgcolor: theme.surface.canvas,
          border: `1px solid ${theme.border.default}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: theme.palette.primary.main,
          fontWeight: theme.typography.fontWeightBold, fontSize: 13,
          flexShrink: 0,
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[600],
          }),
        })}>
          CP
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={(theme) => ({
            fontSize: 11, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "text.secondary",
          })}>
            Clinical Pathway Viewer
          </Typography>
          <Typography sx={(theme) => ({
            fontSize: 18, fontWeight: theme.typography.fontWeightBold,
            letterSpacing: "-0.005em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          })}>
            {PATHWAY.title}
          </Typography>
        </Box>
      </Box>

      {/* Right: metadata + feedback */}
      <Box sx={(theme) => ({
        display: "flex", alignItems: "center", gap: theme.space["2xl"],
        color: "text.secondary", fontSize: 12,
        fontVariantNumeric: "tabular-nums", flexShrink: 0,
      })}>
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs })}>
          <Tag size={13} aria-hidden="true" />
          <Typography variant="caption">
            <strong>{PATHWAY.version}</strong>
          </Typography>
        </Box>
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs })}>
          <Clock size={13} aria-hidden="true" />
          <Typography variant="caption">
            Reviewed <strong>{PATHWAY.reviewed}</strong>
          </Typography>
        </Box>
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs })}>
          <User size={13} aria-hidden="true" />
          <Typography variant="caption">{PATHWAY.author}</Typography>
        </Box>
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs })}>
          <BookOpen size={13} aria-hidden="true" />
          <Typography variant="caption">Source: {PATHWAY.source}</Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MessageSquare size={13} aria-hidden="true" />}
          onClick={onFeedback}
          sx={(theme) => ({ borderRadius: `${theme.radius.pill}px`, whiteSpace: "nowrap" })}
        >
          What could be better?
        </Button>
      </Box>
    </Box>
  );
}

// ─── Footnote tooltip ─────────────────────────────────────────────────────────

function FootnoteTooltip({
  n,
  anchor,
  onClose,
}: {
  n: number | null;
  anchor: { x: number; y: number };
  onClose: () => void;
}) {
  if (n == null) return null;
  const body = FOOTNOTES[n];
  if (!body) return null;

  const left = Math.min(
    typeof window !== "undefined" ? window.innerWidth - 380 : 9999,
    Math.max(12, anchor.x + 16),
  );
  const top = Math.max(12, anchor.y - 8);

  return (
    <Box sx={{ position: "fixed", left, top, width: 360, zIndex: (theme) => theme.zIndex.tooltip }}>
      <Box sx={(theme) => ({
        bgcolor: theme.surface.subtle,
        border: `1px solid ${theme.border.default}`,
        borderRadius: `${theme.radius.lg}px`,
        boxShadow: theme.shadows[8],
        overflow: "hidden",
        ...theme.applyStyles("dark", {
          bgcolor: theme.palette.grey[800],
          borderColor: theme.palette.grey[700],
        }),
      })}>
        {/* Tooltip header */}
        <Box sx={(theme) => ({
          bgcolor: alpha(theme.palette.primary.main, 0.10),
          borderBottom: `1px solid ${theme.border.default}`,
          px: theme.space.md, py: theme.space.sm,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          ...theme.applyStyles("dark", {
            bgcolor: alpha(theme.palette.primary.main, 0.18),
            borderColor: theme.palette.grey[700],
          }),
        })}>
          <Typography variant="caption" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}>
            Footnote {n}
          </Typography>
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose} aria-label="Close footnote">
              <X size={13} aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Box>
        {/* Body */}
        <Box sx={(theme) => ({ p: theme.space.md })}>
          <Typography variant="caption" sx={{ lineHeight: 1.55 }}>
            {body}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ClinicalPathwayViewerPage() {
  const [zoom, setZoom]           = useState(0.7);
  const [pan, setPan]             = useState({ x: 0, y: 0 });
  const [dragging, setDragging]   = useState<{ sx: number; sy: number; px: number; py: number } | false>(false);
  const [sidebarOpen, setSidebar] = useState(true);
  const [showGrid, setShowGrid]   = useState(true);
  const [fn, setFn]               = useState<{ n: number | null; x: number; y: number }>({ n: null, x: 0, y: 0 });
  const [toast, setToast]         = useState<string | null>(null);
  const viewportRef               = useRef<HTMLDivElement>(null);

  // ── Fit to screen ──────────────────────────────────────────────────────────
  const fitToScreen = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const pad = 32;
    const z = Math.min(
      (el.clientWidth  - pad * 2) / CANVAS_W,
      (el.clientHeight - pad * 2) / CANVAS_H,
    );
    const clamped = Math.max(MIN_ZOOM, Math.min(z, 1.0));
    setZoom(clamped);
    setPan({
      x: Math.max(pad, (el.clientWidth  - CANVAS_W * clamped) / 2),
      y: Math.max(pad, (el.clientHeight - CANVAS_H * clamped) / 2),
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(fitToScreen, 30);
    window.addEventListener("resize", fitToScreen);
    return () => { clearTimeout(t); window.removeEventListener("resize", fitToScreen); };
  }, [fitToScreen, sidebarOpen]);

  const zoomStep = (delta: number) =>
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, parseFloat((z + delta).toFixed(2)))));

  // ── Pan drag ───────────────────────────────────────────────────────────────
  const onDown = (e: React.MouseEvent) => {
    const tgt = e.target as HTMLElement;
    if (tgt.closest("[data-node]") || tgt.closest("button")) return;
    setDragging({ sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y });
  };
  const onMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragging.px + (e.clientX - dragging.sx), y: dragging.py + (e.clientY - dragging.sy) });
  };
  const onUp = () => setDragging(false);

  // ── Footnote ───────────────────────────────────────────────────────────────
  const onFootnote = (n: number, e: React.MouseEvent) => {
    const tgt = e.currentTarget as HTMLElement;
    if (tgt?.getBoundingClientRect) {
      const r = tgt.getBoundingClientRect();
      setFn({ n, x: r.right, y: r.top });
    } else {
      const r = viewportRef.current?.getBoundingClientRect();
      setFn({ n, x: r ? r.left + r.width * 0.55 : 300, y: r ? r.top + 120 : 100 });
    }
  };

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <Box sx={(theme) => ({
      display: "flex", flexDirection: "column", height: "100%",
      bgcolor: theme.surface.subtle,
      ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
    })}>
      {/* Header */}
      <CpHeader onFeedback={() => showToast("Feedback form opened — thank you!")} />

      {/* Body */}
      <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Sidebar */}
        <CpSidebar open={sidebarOpen} onClose={() => setSidebar(false)} />

        {/* Viewport */}
        <Box
          ref={viewportRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          sx={(theme) => ({
            position: "relative", flex: 1, overflow: "hidden",
            bgcolor: theme.surface.subtle,
            cursor: dragging ? "grabbing" : "grab",
            ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
          })}
        >
          {/* Pannable + zoomable canvas */}
          <Box sx={{
            position: "absolute",
            left: pan.x, top: pan.y,
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}>
            <PathwayCanvas
              onFootnote={onFootnote}
              onOpenOrganisms={() => setSidebar(true)}
              showGrid={showGrid}
            />
          </Box>

          {/* Controls (rendered after canvas → naturally on top in stacking context) */}
          <Legend />
          <ZoomPanel zoom={zoom} onIn={() => zoomStep(0.1)} onOut={() => zoomStep(-0.1)} onFit={fitToScreen} />
          <CpToolbar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebar((v) => !v)}
            onShare={() => showToast("Share link copied!")}
            onPrint={() => { setShowGrid(false); setTimeout(() => { window.print(); setShowGrid(true); }, 100); }}
            onScreenshot={() => showToast("Screenshot saved to downloads")}
          />

          {/* Toast */}
          {toast && (
            <Box sx={(theme) => ({
              position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
              bgcolor: theme.palette.grey[900],
              color: theme.palette.common.white,
              px: "14px", py: theme.space.sm,
              borderRadius: `${theme.radius.pill}px`,
              fontSize: 13, boxShadow: theme.shadows[6],
              whiteSpace: "nowrap",
              ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[700] }),
            })}>
              {toast}
            </Box>
          )}

          {/* Footnote tooltip */}
          <FootnoteTooltip n={fn.n} anchor={fn} onClose={() => setFn({ n: null, x: 0, y: 0 })} />
        </Box>
      </Box>
    </Box>
  );
}
