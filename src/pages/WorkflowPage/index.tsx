import { useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { focusRing } from "../../theme/recipes";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import {
  ChevronLeft, ChevronRight, RotateCcw,
  Workflow, ClipboardList, FileText,
  AlertTriangle, CheckCircle2, Info,
  StickyNote, FlaskConical,
} from "lucide-react";
import { CsSidebarItem } from "../../components/CsSidebarItem";

// ─── Types ────────────────────────────────────────────────────────────────────

type AnswerType    = "single" | "multi" | "scale";
type PaletteIntent = "primary" | "secondary" | "error" | "warning" | "info" | "success";

interface Answer { id: string; label: string; next?: string | null; flag?: "warn" | "ok" | "info" }
interface Step   { id: string; question: string; hint?: string; type: AnswerType; answers: Answer[] }
interface Result { heading: string; severityKey: PaletteIntent; summary: string; orders: string[] }

// ─── Workflow data ────────────────────────────────────────────────────────────

const STEPS: Record<string, Step> = {
  q1: {
    id: "q1",
    question: "Is the patient currently experiencing chest pain or pressure?",
    hint: "Include any discomfort, tightness, or heaviness in the chest.",
    type: "single",
    answers: [
      { id: "a1y", label: "Yes — active symptoms",                         next: "q2",          flag: "warn" },
      { id: "a1n", label: "No — symptoms resolved",                        next: "q3",          flag: "ok"   },
      { id: "a1u", label: "Unclear / patient unable to communicate",       next: "q3",          flag: "info" },
    ],
  },
  q2: {
    id: "q2",
    question: "How would you characterize the chest pain?",
    hint: "Select all that apply.",
    type: "multi",
    answers: [
      { id: "a2a", label: "Crushing / pressure-like",     next: "q3" },
      { id: "a2b", label: "Sharp / pleuritic",            next: "q3" },
      { id: "a2c", label: "Radiation to left arm or jaw", next: "q3", flag: "warn" },
      { id: "a2d", label: "Associated diaphoresis",       next: "q3", flag: "warn" },
      { id: "a2e", label: "Reproducible on palpation",    next: "q3", flag: "ok"   },
    ],
  },
  q3: {
    id: "q3",
    question: "Is the patient haemodynamically stable?",
    hint: "SBP ≥ 90 mmHg, HR 50–100 bpm, SpO₂ ≥ 94%.",
    type: "single",
    answers: [
      { id: "a3y", label: "Yes — stable",  next: "q4",          flag: "ok"   },
      { id: "a3n", label: "No — unstable", next: "result_high", flag: "warn" },
    ],
  },
  q4: {
    id: "q4",
    question: "Does the ECG show any of the following?",
    hint: "Order a 12-lead ECG immediately if not yet obtained.",
    type: "multi",
    answers: [
      { id: "a4a", label: "ST elevation ≥ 1 mm in ≥ 2 contiguous leads", next: "result_high", flag: "warn" },
      { id: "a4b", label: "New LBBB",                                     next: "result_high", flag: "warn" },
      { id: "a4c", label: "ST depression or T-wave inversions",           next: "result_mod",  flag: "info" },
      { id: "a4d", label: "No significant changes",                       next: "result_low",  flag: "ok"   },
    ],
  },
};

// severityKey maps directly to a palette intent — no hardcoded hex
const RESULTS: Record<string, Result> = {
  result_high: {
    heading:     "High-Risk ACS — Immediate Action Required",
    severityKey: "error",
    summary:     "Clinical presentation is consistent with high-risk acute coronary syndrome (STEMI or equivalent). Activate STEMI protocol immediately. Target door-to-balloon time < 90 min.",
    orders: [
      "Activate cardiac catheterisation lab (STEMI protocol)",
      "Aspirin 325 mg PO stat (if not contraindicated)",
      "Heparin IV per ACS weight-based protocol",
      "Ticagrelor 180 mg PO loading dose",
      "Continuous ECG monitoring",
      "Urgent cardiology consult",
      "Hold food and water — patient may require intervention",
    ],
  },
  result_mod: {
    heading:     "Moderate-Risk ACS — Expedited Evaluation",
    severityKey: "warning",
    summary:     "Presentation is consistent with non-ST-elevation ACS (NSTEMI / unstable angina). Serial troponins, ECG monitoring, and cardiology involvement required within 2 hours.",
    orders: [
      "Serial troponin I at 0, 3, and 6 hours",
      "Aspirin 325 mg PO (if not contraindicated)",
      "Continuous ECG monitoring",
      "Cardiology consult within 2 hours",
      "Nitroglycerin 0.4 mg SL PRN chest pain",
      "Establish IV access × 2",
    ],
  },
  result_low: {
    heading:     "Low-Risk — Further Evaluation Recommended",
    severityKey: "success",
    summary:     "No high-risk features identified on initial assessment. Low-risk chest pain pathway. Serial troponins recommended to rule out myocardial injury.",
    orders: [
      "Serial troponin I at 0 and 3 hours (HEART pathway)",
      "12-lead ECG in 1 hour",
      "Basic metabolic panel, CBC",
      "Consider stress testing or chest CT-A if troponins negative",
      "Patient education re: return precautions",
    ],
  },
};

const RESOURCES = [
  { id: "r1", title: "ACC/AHA STEMI Guidelines 2023",           type: "Guideline" },
  { id: "r2", title: "Chest Pain Triage Pathway",               type: "Pathway"   },
  { id: "r3", title: "Troponin Interpretation Quick Reference", type: "Document"  },
  { id: "r4", title: "ACS Anticoagulation Protocol",            type: "Protocol"  },
];

// ─── Flag colour + icon — palette key and icon component, not hex ─────────────

const FLAG_PALETTE: Record<string, PaletteIntent> = {
  warn: "warning",
  ok:   "success",
  info: "info",
};

const FLAG_ICON: Record<string, React.ElementType> = {
  warn: AlertTriangle,
  ok:   CheckCircle2,
  info: Info,
};

// ─── Step component ───────────────────────────────────────────────────────────

function QuestionStep({
  step, selected, onSelect,
}: {
  step: Step; selected: string[]; onSelect: (id: string) => void;
}) {
  return (
    <Box>
      <Typography variant="h6" sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemibold, mb: 0.75, lineHeight: 1.4 })}>
        {step.question}
      </Typography>
      {step.hint && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step.hint}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {step.answers.map((ans) => {
          const isSelected   = selected.includes(ans.id);
          const flagColorKey = ans.flag ? FLAG_PALETTE[ans.flag] : undefined;
          const FlagIcon     = ans.flag ? FLAG_ICON[ans.flag] : null;

          return (
            <Box
              key={ans.id}
              role={step.type === "single" ? "radio" : "checkbox"}
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(ans.id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === " " || e.key === "Enter") { e.preventDefault(); onSelect(ans.id); }
              }}
              sx={(theme) => ({
                display: "flex", alignItems: "center", gap: theme.space.md,
                px: theme.space.lg, py: theme.space.md,
                borderRadius: `${theme.radius.lg}px`,
                border: `1.5px solid ${isSelected ? theme.palette.primary.main : theme.border.default}`,
                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.06) : theme.surface.canvas,
                cursor: "pointer", transition: theme.motion.short,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
                "&:focus-visible": { ...focusRing(theme) },
                ...theme.applyStyles("dark", {
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : theme.palette.grey[900],
                  borderColor: isSelected ? theme.palette.primary.main : theme.palette.grey[700],
                }),
              })}
            >
              {/* Selection indicator ring */}
              <Box sx={(theme) => ({
                width: 18, height: 18,
                borderRadius: step.type === "multi" ? `${theme.radius.sm}px` : "50%",
                border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.text.disabled}`,
                bgcolor: isSelected ? theme.palette.primary.main : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: theme.motion.short,
              })}>
                {isSelected && (
                  <Box sx={(theme) => ({
                    width: 8, height: 8,
                    borderRadius: step.type === "multi" ? `${theme.radius.sm / 2}px` : "50%",
                    bgcolor: theme.palette.primary.contrastText,
                  })} />
                )}
              </Box>

              <Typography variant="body2" sx={(theme) => ({ flex: 1, fontWeight: isSelected ? theme.typography.fontWeightSemibold : theme.typography.fontWeightRegular })}>
                {ans.label}
              </Typography>

              {/* Flag icon — icon + palette color, never color-only */}
              {flagColorKey && FlagIcon && (
                <Box sx={(theme) => ({ color: theme.palette[flagColorKey].main, display: "flex", flexShrink: 0 })}>
                  <FlagIcon size={13} aria-hidden="true" />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Result component ─────────────────────────────────────────────────────────

function ResultView({ result }: { result: Result }) {
  const { severityKey } = result;

  const SeverityIcon =
    severityKey === "error"   ? AlertTriangle :
    severityKey === "warning" ? Info          : CheckCircle2;

  return (
    <Box>
      {/* Result banner — alpha() inside sx so theme is resolved correctly */}
      <Box sx={(theme) => ({
        display: "flex", alignItems: "flex-start", gap: theme.space.lg, mb: 3,
        p: 2, borderRadius: `${theme.radius.lg}px`,
        bgcolor: alpha(theme.palette[severityKey].main, 0.08),
        border: `1.5px solid ${alpha(theme.palette[severityKey].main, 0.25)}`,
      })}>
        <Box sx={(theme) => ({ color: theme.palette[severityKey].main, flexShrink: 0, mt: 0.5 })}>
          <SeverityIcon size={20} aria-hidden="true" />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, color: theme.palette[severityKey].main })}>
            {result.heading}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>{result.summary}</Typography>
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={(theme) => ({ mb: 1.5, fontWeight: theme.typography.fontWeightBold })}>Recommended Orders</Typography>
      <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.xs })}>
        {result.orders.map((order, idx) => (
          <Box key={idx} sx={(theme) => ({
            display: "flex", alignItems: "flex-start", gap: theme.space.sm,
            px: theme.space.md, py: theme.space.sm,
            borderRadius: `${theme.radius.md}px`,
            border: `1px solid ${theme.border.subtle}`,
            bgcolor: theme.surface.subtle,
            ...theme.applyStyles("dark", {
              bgcolor: theme.palette.grey[800],
              borderColor: theme.palette.grey[700],
            }),
          })}>
            <Box component="span" sx={{ display: "flex", flexShrink: 0, mt: 0.5, opacity: 0.55 }}>
              <ClipboardList size={13} aria-hidden="true" />
            </Box>
            <Typography variant="body2">{order}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type SideTab = "notes" | "resources";
const STEP_ORDER = ["q1", "q2", "q3", "q4"];

export function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState<string>("q1");
  const [history,     setHistory]     = useState<string[]>([]);
  const [selections,  setSelections]  = useState<Record<string, string[]>>({});
  const [resultKey,   setResultKey]   = useState<string | null>(null);
  const [sideTab,     setSideTab]     = useState<SideTab>("notes");
  const [notes,       setNotes]       = useState("");

  const isResult      = resultKey !== null;
  const step          = STEPS[currentStep];
  const answeredCount = STEP_ORDER.filter((s) => !!selections[s]?.length).length;
  const progress      = isResult ? 100 : Math.round((answeredCount / STEP_ORDER.length) * 100);

  function handleSelect(answerId: string) {
    if (step.type === "single") {
      setSelections((p) => ({ ...p, [step.id]: [answerId] }));
    } else {
      setSelections((p) => {
        const cur = p[step.id] ?? [];
        return { ...p, [step.id]: cur.includes(answerId) ? cur.filter((x) => x !== answerId) : [...cur, answerId] };
      });
    }
  }

  function handleNext() {
    const sel = selections[currentStep] ?? [];
    if (!sel.length) return;
    const navigate = (next: string | null | undefined) => {
      if (!next) return;
      if (next.startsWith("result_")) { setResultKey(next); }
      else { setHistory((h) => [...h, currentStep]); setCurrentStep(next); }
    };
    if (step.type === "single") {
      navigate(step.answers.find((a) => a.id === sel[0])?.next);
    } else {
      const chosen = step.answers.filter((a) => sel.includes(a.id));
      navigate(chosen.find((a) => a.next?.startsWith("result_"))?.next ?? chosen[0]?.next);
    }
  }

  function handleBack() {
    if (isResult) { setResultKey(null); return; }
    if (history.length) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentStep(prev);
    }
  }

  function handleReset() {
    setCurrentStep("q1");
    setHistory([]);
    setSelections({});
    setResultKey(null);
  }

  const canAdvance = (selections[currentStep] ?? []).length > 0;

  return (
    <Box sx={(theme) => ({
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
      bgcolor: theme.surface.canvas,
      ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[900] }),
    })}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={(theme) => ({
        px: theme.space["2xl"], py: theme.space.md,
        borderBottom: `1px solid ${theme.border.default}`,
        flexShrink: 0,
        ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
      })}>
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.lg, mb: 1 })}>
          {/* Workflow icon — uses palette intent, not hardcoded hex */}
          <Box sx={(theme) => ({
            width: 32, height: 32, borderRadius: `${theme.radius.md}px`,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.main,
            display: "flex", alignItems: "center", justifyContent: "center",
          })}>
            <Workflow size={16} aria-hidden="true" />
          </Box>
          <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}>
            Chest Pain Assessment Workflow
          </Typography>
          {/* Chip color prop auto-adapts to dark mode */}
          <Chip label="Cardiology" size="small" color="primary"  variant="soft" />
          <Chip label="ED"         size="small" variant="outlined" />
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Restart workflow">
            <IconButton size="small" onClick={handleReset} aria-label="Restart workflow">
              <RotateCcw size={14} aria-hidden="true" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Progress bar */}
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.lg })}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={(theme) => ({
              flex: 1, height: 4, borderRadius: 2,
              bgcolor: theme.border.subtle,
              "& .MuiLinearProgress-bar": { borderRadius: 2 },
              ...theme.applyStyles("dark", { bgcolor: theme.palette.grey[700] }),
            })}
          />
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {isResult ? "Complete" : `Step ${answeredCount + 1} of ${STEP_ORDER.length}`}
          </Typography>
        </Box>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Main workflow area */}
        <Box sx={(theme) => ({
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          px: { xs: theme.space["2xl"], md: theme.space["4xl"] },
          py: theme.space["2xl"],
        })}>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <Box sx={{ maxWidth: 680 }}>

              {/* Step breadcrumb */}
              {!isResult && (
                <Box sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs, mb: 2 })}>
                  {STEP_ORDER.map((s, idx) => {
                    const isDone    = !!selections[s]?.length;
                    const isCurrent = s === currentStep;
                    return (
                      <Box key={s} sx={(theme) => ({ display: "flex", alignItems: "center", gap: theme.space.xs })}>
                        <Box sx={(theme) => ({
                          width: 22, height: 22, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: theme.typography.caption.fontSize,
                          fontWeight: theme.typography.fontWeightBold,
                          bgcolor: isDone
                            ? theme.palette.primary.main
                            : isCurrent
                              ? alpha(theme.palette.primary.main, 0.12)
                              : theme.fill.default,
                          color: isDone
                            ? theme.palette.primary.contrastText
                            : isCurrent
                              ? theme.palette.primary.main
                              : theme.palette.text.disabled,
                          border: `2px solid ${isCurrent ? theme.palette.primary.main : "transparent"}`,
                          transition: theme.motion.short,
                        })}>
                          {idx + 1}
                        </Box>
                        {idx < STEP_ORDER.length - 1 && (
                          <Box sx={(theme) => ({
                            width: 20, height: 2, borderRadius: 1,
                            bgcolor: isDone ? theme.palette.primary.main : theme.fill.default,
                          })} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Question or result */}
              {isResult ? (
                <ResultView result={RESULTS[resultKey!]} />
              ) : (
                <QuestionStep
                  step={step}
                  selected={selections[currentStep] ?? []}
                  onSelect={handleSelect}
                />
              )}
            </Box>
          </Box>

          {/* Navigation buttons */}
          <Box sx={(theme) => ({
            display: "flex", alignItems: "center", justifyContent: "space-between",
            pt: theme.space.lg, mt: theme.space.lg,
            borderTop: `1px solid ${theme.border.subtle}`,
            flexShrink: 0,
            ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
          })}>
            <Button
              variant="ghost"
              startIcon={<ChevronLeft size={16} aria-hidden="true" />}
              onClick={handleBack}
              disabled={history.length === 0 && !isResult}
            >
              Back
            </Button>
            {!isResult && (
              <Button
                variant="contained"
                endIcon={<ChevronRight size={16} aria-hidden="true" />}
                onClick={handleNext}
                disabled={!canAdvance}
              >
                Next
              </Button>
            )}
            {isResult && (
              <Button variant="outlined" onClick={handleReset} startIcon={<RotateCcw size={14} aria-hidden="true" />}>
                Restart
              </Button>
            )}
          </Box>
        </Box>

        {/* ── Right sidebar ───────────────────────────────────────────────── */}
        <Box sx={(theme) => ({
          width: 268, flexShrink: 0, overflow: "hidden",
          borderLeft: `1px solid ${theme.border.default}`,
          bgcolor: theme.surface.subtle,
          display: "flex", flexDirection: "column",
          ...theme.applyStyles("dark", {
            bgcolor: theme.palette.grey[800],
            borderColor: theme.palette.grey[700],
          }),
        })}>
          <Tabs
            value={sideTab}
            onChange={(_, v: SideTab) => setSideTab(v)}
            sx={(theme) => ({
              px: theme.space.md,
              borderBottom: `1px solid ${theme.border.default}`,
              "& .MuiTab-root": { minHeight: 40, fontSize: theme.typography.caption.fontSize, py: 0 },
              flexShrink: 0,
              ...theme.applyStyles("dark", { borderColor: theme.palette.grey[700] }),
            })}
          >
            <Tab value="notes"     icon={<StickyNote size={13} aria-hidden="true" />}   iconPosition="start" label="Notes"     />
            <Tab value="resources" icon={<FlaskConical size={13} aria-hidden="true" />} iconPosition="start" label="Resources" />
          </Tabs>

          {sideTab === "notes" && (
            <Box sx={(theme) => ({
              flex: 1, p: theme.space.lg,
              display: "flex", flexDirection: "column", gap: theme.space.md,
            })}>
              <Typography variant="caption" color="text.secondary">
                Add clinical notes for this encounter
              </Typography>
              <Box
                component="textarea"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                placeholder="Type your notes here…"
                aria-label="Clinical notes for this encounter"
                sx={(theme) => ({
                  flex: 1, resize: "none",
                  border: `1px solid ${theme.border.default}`,
                  borderRadius: `${theme.radius.lg}px`,
                  p: theme.space.md,
                  bgcolor: theme.surface.canvas,
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.body2.fontSize,
                  lineHeight: 1.7,
                  outline: "none",
                  "&:focus": { ...focusRing(theme) },
                  transition: theme.motion.short,
                  ...theme.applyStyles("dark", {
                    bgcolor: theme.palette.grey[900],
                    borderColor: theme.palette.grey[700],
                  }),
                })}
              />
            </Box>
          )}

          {sideTab === "resources" && (
            <Box sx={(theme) => ({ flex: 1, overflow: "auto", p: theme.space.lg })}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                Relevant clinical resources
              </Typography>
              <Box sx={(theme) => ({ display: "flex", flexDirection: "column", gap: theme.space.xs })}>
                {RESOURCES.map((res) => (
                  <CsSidebarItem key={res.id} alignItems="flex-start">
                    <Box component="span" sx={{ display: "flex", opacity: 0.5, mt: 0.5, flexShrink: 0 }}>
                      <FileText size={13} aria-hidden="true" />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={(theme) => ({ display: "block", fontWeight: theme.typography.fontWeightMedium, lineHeight: 1.4 })}>
                        {res.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {res.type}
                      </Typography>
                    </Box>
                  </CsSidebarItem>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
