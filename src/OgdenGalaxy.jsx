import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DUAS, THRESHOLD_META, STAGE_ARABIC, PHASES, LAYERS, LAYER_META } from "./data/bbos-stages";
import DuaDisplay from "./components/DuaDisplay";
import AttributeCard from "./components/AttributeCard";
import ReadinessCheck from "./components/ReadinessCheck";
import PipelineBar from "./components/PipelineBar";

const STARS = {
  bbos: {
    id: "bbos", name: "Barakah Business\nOperating System", shortName: "BBOS",
    color: "#F5A623", glow: "#F5A62366",
    desc: "A nine-stage ethical business pipeline built on Islamic theological foundations. Each stage carries a divine attribute \u2014 not for inspiration, but because it names what is most needed and most likely absent at that operational moment.",
  },
  moontrance: {
    id: "moontrance", name: "The Moontrance\nCollective", shortName: "Moontrance",
    color: "#A855F7", glow: "#A855F766",
    desc: "Creative collective and artistic expression arm within the OGDEN ecosystem. Where vision meets craft.",
  },
  atlas: {
    id: "atlas", name: "Atlas Land\nDesign Tool", shortName: "Atlas",
    color: "#34D399", glow: "#34D39966",
    desc: "Spatial design and land architecture tooling. Mapping physical space with intentional design principles.",
  },
};

const STAGES = [
  { code:"FND",num:1,name:"Foundation",fullName:"Foundation / Intake",attr:"Al-Awwal \u00b7 Ash-Shah\u012bd",color:"#b8a96a",gradient:["#b8a96a","#d4974a"],orientation:"Honest self-declaration as the first act of stewardship.",tools:[
    {id:"intake_packet",name:"Standing Declarations Packet",desc:"The operator\u2019s six-field honest self-declaration: Capital (FSH), Skills, Proof Links, Work Aversions, Geography, and Regulatory Pre-Check."},
    {id:"fsh",name:"Financial Stewardship Horizon",desc:"The actual documented runway figure \u2014 not a best-case projection."},
    {id:"gap_check",name:"Gap Check",desc:"Review of each intake field for completeness, ambiguity, and verifiability."},
    {id:"routing_decision",name:"Routing Decision Record",desc:"The documented basis for routing: Stage 2 TRU or Stage 1.1 Rejection."},
    {id:"ifb",name:"IFB \u2014 Standing Form Build",desc:"The Google Form instrument built 1:1 from the BBOS questionnaire template."},
  ]},
  { code:"TRU",num:2,name:"Truth",fullName:"Truth / Qualification & Alignment",attr:"Al-\u1e24aqq \u00b7 Al-Khab\u012br",color:"#d4974a",gradient:["#d4974a","#EC4899"],orientation:"The Go/No-Go on what is verifiably true now, including what lies beneath stated capacity.",tools:[
    {id:"core_competency",name:"Core Competency",desc:"The operator\u2019s highest-leverage skill defined with precision and backed by verifiable evidence."},
    {id:"advantage_reg",name:"Advantage Register",desc:"The operator\u2019s sustainable, principle-driven competitive position."},
    {id:"proof_audit_tru",name:"Proof Audit",desc:"Objective assessment of every proof link from intake, categorised by evidence strength (E1\u2013E4)."},
    {id:"energy_profile",name:"Energy Profile",desc:"Map of which activities generate operational energy and which deplete it."},
    {id:"constraint_map_tru",name:"Constraint Map",desc:"All significant limitations documented: financial runway, proof gaps, capacity, regulatory hurdles."},
    {id:"reg_baseline",name:"Regulatory Baseline",desc:"Required permits, licences, zoning approvals, and compliance standards for the target geography."},
    {id:"viability_gate",name:"Viability Gate Results",desc:"Gates A\u2013D pass/fail table for each niche candidate."},
    {id:"removed_niche_log",name:"Removed Niche Log",desc:"Every niche candidate removed at the Viability Gate, with the specific basis for each removal."},
    {id:"cleared_handoff",name:"Cleared Candidate Handoff",desc:"The final qualified niche candidates with scoring and the basis for the Amanah Gate decision."},
    {id:"validation",name:"Expert Validation Score",desc:"Screen the operator\u2019s core competency, market viability, and capacity to build with integrity."},
  ]},
  { code:"STR",num:3,name:"Strategy",fullName:"Strategy",attr:"Al-Ba\u1e63\u012br",color:"#5b9bd5",gradient:["#5b9bd5","#8B5CF6"],orientation:"Genuine seeing as the basis for strategy; verbatim VoC as an act of looking clearly.",tools:[
    {id:"market",name:"Find Your Market",desc:"Define the target buyer\u2019s current situation and operating context."},
    {id:"pains",name:"Find Bleeding-Neck Pains",desc:"Extract verbatim fears and desires. Name the Enemy as a convergent system of forces."},
    {id:"avatar",name:"Avatar Intake",desc:"Build the avatar from 15+ verbatim phrases extracted from source material."},
    {id:"competitor",name:"Competitor Search",desc:"Identify the specific gap no existing offer is filling."},
    {id:"adspy",name:"Ad Spy",desc:"Gather competitive ad intelligence to feed the Advantage Register."},
    {id:"contentspy",name:"Content Spy",desc:"Map competitive content to identify the 6 Amanah Content Engine angles."},
    {id:"truth_gate",name:"Truth-Gate Advisory",desc:"The 3 phrases from the VoC Buying Language Bank cleared for headline use."},
  ]},
  { code:"OFR",num:4,name:"Offer",fullName:"Offer",attr:"Al-\u02bfAdl \u00b7 Al-Muqsi\u1e6d",color:"#9b7dd4",gradient:["#9b7dd4","#6366F1"],orientation:"The offer as a just and equitable covenant \u2014 bilateral balance of risk and obligation.",tools:[
    {id:"solution",name:"Build Your Solution",desc:"Define the specific ethical process that reliably produces the promised result."},
    {id:"icp",name:"ICP Segmentation",desc:"Build the ICP specific enough to qualify or disqualify a prospect at the Sales stage."},
    {id:"offer",name:"Offer Creation",desc:"Design the offer as a covenant: Promise, Mechanism, Scope Map, Value Stack, Guarantee, Pricing."},
    {id:"pricing",name:"Pricing",desc:"Reflect honest valuation against the Value Stack \u2014 not what the market might bear."},
  ]},
  { code:"OUT",num:5,name:"Outreach",fullName:"Outreach",attr:"Ar-Razz\u0101q \u00b7 As-Sitt\u012br",color:"#5ab87a",gradient:["#5ab87a","#3B82F6"],orientation:"Outreach from tawakkul; disqualification with dignity.",tools:[
    {id:"gtm",name:"Proven GTM",desc:"Build the GTM downstream of the STR Positioning Statement and Truth-Gate Advisory."},
    {id:"attention",name:"Attention",desc:"Build attention hooks from the 3 Truth-Gate Advisory phrases cleared for headline use."},
    {id:"creative",name:"Creative & Ads",desc:"Produce ad creative within G-label boundaries from the Hook Library."},
    {id:"generateads",name:"Generate Ads",desc:"Produce live ad copy with G-label confirmation on every claim."},
    {id:"logo",name:"Generate Logo",desc:"Produce brand identity assets grounded in the offer covenant."},
    {id:"landing",name:"Landing Page",desc:"Build the landing page with every claim mapped to the Proof Plan."},
    {id:"salesletter",name:"Sales Letter",desc:"Build long-form persuasion anchored in verbatim VoC language and the Enemy Narrative."},
    {id:"social",name:"Social Assets",desc:"Produce social content from the 6 Amanah Content Engine angles."},
    {id:"meta",name:"Connect Meta",desc:"Configure Meta as the distribution infrastructure for Outreach stage assets."},
    {id:"pixel",name:"Install Pixel",desc:"Install tracking to capture the evidence base for the next cycle\u2019s G-label claims."},
    {id:"launchads",name:"Launch Ads",desc:"Deploy the final Outreach campaign with all G-label checks complete."},
    {id:"socials",name:"Connect Socials",desc:"Connect social channels as distribution infrastructure."},
    {id:"website",name:"Deploy Website",desc:"Deploy the live website with all claims mapped to the Proof Plan."},
    {id:"objection_matrix",name:"Objection Matrix",desc:"Structured matrix of prospect objections mapped to resolution responses."},
  ]},
  { code:"SAL",num:6,name:"Sales",fullName:"Sales",attr:"Ar-Razz\u0101q \u00b7 Al-La\u1e6d\u012bf \u00b7 As-Sitt\u012br",color:"#d47560",gradient:["#d47560","#0EA5E9"],orientation:"Discernment over closing; presence over pressure.",tools:[
    {id:"salespreso",name:"Sales Presentation",desc:"Carry the Offer Promise, Mechanism, and Scope Map forward verbatim into the presentation."},
    {id:"nurture",name:"Nurture Sequences",desc:"Build sequences from the 6 Amanah Content Engine angles within G-label boundaries."},
    {id:"vsl",name:"Pre-Call VSL",desc:"Frame the problem in VoC language and introduce the Mechanism before the call."},
    {id:"salesscript",name:"Sales Script",desc:"Walk the prospect through the Offer Promise, Scope Map, and Guarantee on the call."},
    {id:"settingscript",name:"Setting Script",desc:"Qualify the prospect against the ICP before the sales call."},
    {id:"form",name:"Add Form & Test",desc:"Deploy the intake form as the first ICP filter in the Sales stage."},
  ]},
  { code:"DLR",num:7,name:"Delivery",fullName:"Delivery",attr:"Al-Mu\u1e25sin \u00b7 Al-Wal\u012b \u00b7 Ash-Shak\u016br",color:"#4ab8a8",gradient:["#4ab8a8","#14B8A6"],orientation:"Delivery as an act of worship \u2014 excellence beyond obligation.",tools:[
    {id:"onboarding",name:"Onboarding Checklist",desc:"Payment-to-work-start steps with communication triggers, timeline, and client success framing."},
    {id:"clientintake",name:"Client Intake Form",desc:"Capture client constraints, access requirements, communication preferences, and their definition of success."},
    {id:"executionsop",name:"Execution SOP",desc:"Step-by-step delivery process mapped directly to the OFR Scope Map."},
    {id:"qcchecklist",name:"Quality Control Checklist",desc:"QC checks aligned to OFR outcome and guarantee trigger conditions."},
    {id:"milestones",name:"Client Success Milestones",desc:"3\u20135 delivery checkpoints with message templates framed in Promise language."},
    {id:"proofcapture",name:"Proof Capture Protocol",desc:"What to capture, at which milestone, in what format, and with what consent language."},
    {id:"offboarding",name:"Offboarding Sequence",desc:"Close, retention seed, and Stage 8 RET handoff."},
    {id:"ghl",name:"Connect GHL",desc:"Configure the CRM to carry Scope Map terms, Guarantee conditions, and milestone triggers into delivery."},
  ]},
  { code:"RET",num:8,name:"Retention",fullName:"Retention",attr:"Ash-Shak\u016br \u00b7 Al-Wad\u016bd",color:"#d4a55a",gradient:["#d4a55a","#22C55E"],orientation:"Gratitude and love as the ground of retention.",tools:[
    {id:"nurture_past",name:"Past-Client Nurture Sequence",desc:"Re-engagement messaging for past clients \u2014 warming rather than pushing."},
    {id:"reengage_cold",name:"Cold-Lead Re-engagement",desc:"Re-engagement framework for leads who did not proceed."},
    {id:"reactivation",name:"Re-Activation Campaign",desc:"Two-week re-engagement plan for leads and clients who have gone silent for 60+ days."},
    {id:"upsell_framework",name:"Upsell Framework",desc:"The documented path to an expanded engagement for clients who have completed delivery."},
    {id:"referral_script",name:"Referral Request Script",desc:"A referral invitation timed to a moment of natural client satisfaction."},
    {id:"testimonial_proto",name:"Testimonial Collection Protocol",desc:"The process for collecting client stories and proof assets."},
    {id:"proof_deploy",name:"Proof Asset Deployment Map",desc:"Catalogue of every proof asset with its consent status and deployment contexts."},
  ]},
  { code:"OPT",num:9,name:"Optimization",fullName:"Optimization",attr:"Al-\u1e24as\u012bb \u00b7 As-Subb\u016b\u1e25 \u00b7 Al-Qudd\u016bs",color:"#22C55E",gradient:["#22C55E","#84CC16"],orientation:"Honest reckoning; purification as the condition for Barakah.",tools:[
    {id:"perf_reckoning",name:"Performance Reckoning",desc:"Planned vs actual outcomes for every stage with variance analysis."},
    {id:"covenant_audit",name:"Covenant Integrity Audit",desc:"Each stage\u2019s governing quality assessed against actual operator behaviour."},
    {id:"glabel_accuracy",name:"G-Label Accuracy Report",desc:"Every G1/G2 claim from the cycle assessed against actual outcomes."},
    {id:"proof_refresh",name:"Proof Plan Refresh",desc:"Asset 8 updated. PROOF PENDING items resolved or carried forward."},
    {id:"constraint_map",name:"Constraint Evolution Map",desc:"How each Stage 1 FND constraint evolved through the cycle."},
    {id:"restoration",name:"Restoration Mandate (G7.2)",desc:"Every structural weakness identified in the reckoning with its repair requirement."},
    {id:"scaling_readiness",name:"Capacity Readiness Assessment",desc:"Honest evaluation of the volume the system can sustain without degrading covenant integrity."},
    {id:"next_cycle_recs",name:"Next-Cycle Recommendations",desc:"Specific, actionable improvements for each stage based on the reckoning findings."},
    {id:"proof_architecture",name:"Proof Architecture",desc:"Self-referential proof that BBOS was built using BBOS."},
    {id:"stewardship_score",name:"Stewardship Score (MG-01)",desc:"The composite stewardship metric for the full cycle."},
    {id:"barakah_health_index",name:"Barakah Health Index (MG-03)",desc:"Five-dimension health assessment: Decision Clarity, Asset Integrity, Right-Fit Client Ratio, Operator Capacity, Covenant Fidelity."},
  ]},
];

// ── STARFIELD CANVAS ─────────────────────────────────────────
function StarfieldCanvas({ depth = 1 }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    if (starsRef.current.length === 0) {
      const isMobileCanvas = w < 768;
      const count = Math.floor((w * h) / (isMobileCanvas ? 1400 : 700));
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * w * 1.2 - w * 0.1, y: Math.random() * h * 1.2 - h * 0.1,
          size: Math.random() * 1.6 + 0.2, twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          hue: Math.random() > 0.85 ? Math.random() * 60 + 200 : 0,
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      starsRef.current.forEach(s => {
        s.twinkle += s.twinkleSpeed;
        const a = 0.2 + Math.sin(s.twinkle) * 0.35 + 0.35;
        const r = s.size * (0.85 + Math.sin(s.twinkle * 0.7) * 0.15);
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue > 0 ? `hsla(${s.hue},60%,80%,${a * depth})` : `rgba(255,255,255,${a * depth})`;
        ctx.fill();
        if (r > 1.1) { ctx.beginPath(); ctx.arc(s.x, s.y, r * 2.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,200,255,${a * 0.06 * depth})`; ctx.fill(); }
      });
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(frameRef.current); };
  }, [depth]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ── GLOW ORB ─────────────────────────────────────────────────
function GlowOrb({ size, color, glow, onClick, style, children, pulse = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88 50%, ${color}44 75%, transparent)`,
        boxShadow: `0 0 ${size * 0.4}px ${glow || color + "55"}, 0 0 ${size * 0.8}px ${glow || color + "22"}, inset 0 0 ${size * 0.15}px rgba(255,255,255,0.12)`,
        cursor: onClick ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center",
        transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease",
        animation: pulse ? "orbPulse 5s ease-in-out infinite" : "none",
        position: "relative", zIndex: 2,
        transform: hov && onClick ? "scale(1.08)" : "scale(1)",
        ...style,
      }}
    >{children}</div>
  );
}

// ── BREADCRUMB ───────────────────────────────────────────────
function Breadcrumb({ path, onNavigate }) {
  return (
    <div style={{ position: "fixed", top: 18, left: 20, zIndex: 90, display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 11 }}>
      {path.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>{"\u203A"}</span>}
          <button onClick={() => onNavigate(i)} style={{
            background: i === path.length - 1 ? "rgba(255,255,255,0.07)" : "transparent",
            border: i === path.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
            color: i === path.length - 1 ? "#fff" : "rgba(255,255,255,0.35)",
            padding: "5px 10px", borderRadius: 16, cursor: "pointer",
            fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600,
            transition: "all 0.2s", fontFamily: "var(--mono)",
          }}>{p.label}</button>
        </div>
      ))}
    </div>
  );
}

// ── GALAXY ENTRY ─────────────────────────────────────────────
function GalaxyEntry({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10, transition: "opacity 0.7s ease, transform 0.7s ease",
      opacity: exiting ? 0 : 1, transform: exiting ? "scale(1.3)" : "scale(1)",
      pointerEvents: exiting ? "none" : "all",
    }}>
      <div style={{ textAlign: "center", animation: "fadeInUp 1s ease" }}>
        <div onClick={() => { setExiting(true); setTimeout(onEnter, 600); }} style={{
          width: 300, height: 300, borderRadius: "50%", margin: "0 auto",
          background: "radial-gradient(circle at 38% 38%, rgba(55,55,65,0.9), rgba(28,28,33,0.95) 55%, rgba(8,8,12,1))",
          boxShadow: "0 0 100px rgba(90,90,110,0.12), 0 0 200px rgba(70,70,90,0.06), inset 0 0 50px rgba(255,255,255,0.02)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", animation: "galaxyFloat 7s ease-in-out infinite",
        }}>
          <h1 style={{ fontSize: 30, fontWeight: 300, color: "#fff", margin: "0 0 24px", letterSpacing: 10, fontFamily: "var(--serif)" }}>OGDEN GALAXY</h1>
          <div style={{ padding: "8px 22px", border: "1px solid #4ade80", borderRadius: 3, color: "#4ade80", fontSize: 9, fontWeight: 700, letterSpacing: 3.5, textTransform: "uppercase", fontFamily: "var(--mono)" }}>Click Here to Explore</div>
        </div>
      </div>
    </div>
  );
}

// ── STAR SELECTION ───────────────────────────────────────────
function StarField({ onSelectStar, transition }) {
  const [hovered, setHovered] = useState(null);
  // Two-phase exit: phase 0 = normal positions with transition enabled, phase 1 = exit positions
  const [exitPhase, setExitPhase] = useState(0);
  const layout = [
    { key: "bbos", x: 50, y: 24, size: 120 },
    { key: "moontrance", x: 20, y: 68, size: 86 },
    { key: "atlas", x: 80, y: 68, size: 90 },
  ];
  const isExiting = transition?.from === "stars";
  const selectedKey = transition?.starKey;

  // When transition starts, wait one frame then trigger exit positions
  useEffect(() => {
    if (isExiting) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setExitPhase(1));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setExitPhase(0);
    }
  }, [isExiting]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, animation: isExiting ? "none" : "fadeIn 0.7s ease" }}>
      {/* "What are you here for" — fades out during transition */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        textAlign: "center", zIndex: 5, pointerEvents: "none",
        transition: `opacity ${TRANSITION_MS * 0.4}ms ease`,
        opacity: isExiting ? 0 : 1,
      }}>
        <h2 style={{ fontSize: "clamp(20px,3.2vw,34px)", fontWeight: 300, color: "#fff", lineHeight: 1.45, fontFamily: "var(--serif)", textShadow: "0 0 60px rgba(0,0,0,0.9)" }}>
          What are you<br/>here for
        </h2>
      </div>
      {layout.map(pos => {
        const star = STARS[pos.key]; const isH = hovered === pos.key;
        const isSelected = isExiting && exitPhase === 1 && pos.key === selectedKey;
        const isUnselected = isExiting && exitPhase === 1 && pos.key !== selectedKey;

        // Calculate fly-to-center transform for the selected star
        let exitTransform = "translate(-50%,-50%)";
        let exitOpacity = 1;
        let exitScale = isH ? 1.08 : 1;

        if (isSelected) {
          const dx = 50 - pos.x;
          const dy = 50 - pos.y;
          exitTransform = `translate(calc(-50% + ${dx}vw), calc(-50% + ${dy}vh))`;
          exitScale = 2.5;
          exitOpacity = 0;
        } else if (isUnselected) {
          const dx = (pos.x - 50) * 3;
          const dy = (pos.y - 50) * 3;
          exitTransform = `translate(calc(-50% + ${dx}vw), calc(-50% + ${dy}vh))`;
          exitScale = 0.15;
          exitOpacity = 0;
        }

        return (
          <div key={pos.key} style={{
            position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`,
            transform: exitTransform,
            opacity: exitOpacity,
            zIndex: isSelected ? 30 : isH ? 20 : 10,
            cursor: isExiting ? "default" : "pointer",
            transition: isExiting ? `all ${TRANSITION_MS}ms ${SPRING}` : "none",
          }} onMouseEnter={() => !isExiting && setHovered(pos.key)} onMouseLeave={() => setHovered(null)}
             onClick={() => !isExiting && onSelectStar(pos.key)}>
            <div style={{
              transition: `transform ${isExiting ? TRANSITION_MS + "ms " + SPRING : "0.4s cubic-bezier(0.16,1,0.3,1)"}`,
              transform: `scale(${exitScale})`,
            }}>
              <CelestialStar size={pos.size} color={star.color}>
                <span style={{
                  fontSize: pos.size > 100 ? 11 : 9, fontWeight: 700, color: "#fff", letterSpacing: 1.8,
                  textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.4)",
                  lineHeight: 1.5, padding: "0 10px", fontFamily: "var(--mono)", whiteSpace: "pre-line",
                  position: "relative", zIndex: 10,
                }}>{star.name}</span>
              </CelestialStar>
            </div>
            {isH && !isExiting && (
              <div style={{
                position: "absolute", top: "115%", left: "50%", transform: "translateX(-50%)",
                background: "rgba(8,8,18,0.95)", border: `1px solid ${star.color}33`,
                borderRadius: 8, padding: "11px 15px", width: 210, animation: "fadeIn 0.25s ease",
                backdropFilter: "blur(10px)", pointerEvents: "none",
              }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{star.desc.length > 90 ? star.desc.slice(0, 90) + "\u2026" : star.desc}</div>
                <div style={{ fontSize: 9, color: star.color, marginTop: 8, fontWeight: 700, letterSpacing: 1.5, fontFamily: "var(--mono)" }}>CLICK TO EXPLORE {"\u2192"}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── CELESTIAL STAR (dark core + bright ring + lens flare spikes) ──
function CelestialStar({ size, color, children }) {
  const [hov, setHov] = useState(false);
  const w = (a) => `rgba(255,255,255,${a})`;
  const abs = { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" };
  const flareH = (len, thick, blur, zI) => ({
    ...abs, width: size * len, height: size * thick,
    background: `linear-gradient(90deg, transparent 0%, ${color}15 15%, ${w(0.5)} 35%, ${w(0.9)} 48%, ${w(1)} 50%, ${w(0.9)} 52%, ${w(0.5)} 65%, ${color}15 85%, transparent 100%)`,
    filter: `blur(${blur}px)`, zIndex: zI,
  });

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Outer ambient bloom */}
      <div style={{ ...abs, width: size * 3, height: size * 3, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, ${color}0c 35%, transparent 65%)`,
        animation: "flareBreath 12s ease-in-out infinite",
      }} />

      {/* Horizontal lens flare — sharp */}
      <div style={flareH(4, 0.08, 2, 6)} />
      {/* Horizontal lens flare — soft wide */}
      <div style={{ ...abs, width: size * 5, height: size * 0.25,
        background: `linear-gradient(90deg, transparent 0%, ${color}08 20%, ${color}20 40%, ${color}44 48%, ${color}55 50%, ${color}44 52%, ${color}20 60%, ${color}08 80%, transparent 100%)`,
        filter: "blur(6px)", zIndex: 5,
      }} />

      {/* Vertical lens flare — sharp */}
      <div style={{ ...abs, width: size * 0.08, height: size * 4,
        background: `linear-gradient(180deg, transparent 0%, ${color}15 15%, ${w(0.5)} 35%, ${w(0.9)} 48%, ${w(1)} 50%, ${w(0.9)} 52%, ${w(0.5)} 65%, ${color}15 85%, transparent 100%)`,
        filter: "blur(2px)", zIndex: 6,
      }} />
      {/* Vertical lens flare — soft wide */}
      <div style={{ ...abs, width: size * 0.25, height: size * 5,
        background: `linear-gradient(180deg, transparent 0%, ${color}08 20%, ${color}20 40%, ${color}44 48%, ${color}55 50%, ${color}44 52%, ${color}20 60%, ${color}08 80%, transparent 100%)`,
        filter: "blur(6px)", zIndex: 5,
      }} />

      {/* Diagonal flare spikes */}
      <div style={{ ...abs, transform: "translate(-50%,-50%) rotate(45deg)", width: size * 2.5, height: size * 0.04,
        background: `linear-gradient(90deg, transparent 5%, ${color}22 30%, ${w(0.6)} 48%, ${w(0.8)} 50%, ${w(0.6)} 52%, ${color}22 70%, transparent 95%)`,
        filter: "blur(1.5px)", zIndex: 6,
      }} />
      <div style={{ ...abs, transform: "translate(-50%,-50%) rotate(-45deg)", width: size * 2.5, height: size * 0.04,
        background: `linear-gradient(90deg, transparent 5%, ${color}22 30%, ${w(0.6)} 48%, ${w(0.8)} 50%, ${w(0.6)} 52%, ${color}22 70%, transparent 95%)`,
        filter: "blur(1.5px)", zIndex: 6,
      }} />

      {/* Bright ring — luminous border halo */}
      <div style={{ ...abs, width: size * 1.12, height: size * 1.12, borderRadius: "50%",
        background: "transparent",
        boxShadow: [
          `0 0 ${size*0.08}px ${w(0.9)}`, `0 0 ${size*0.2}px ${w(0.6)}`,
          `0 0 ${size*0.4}px ${color}88`, `0 0 ${size*0.7}px ${color}44`, `0 0 ${size*1.2}px ${color}22`,
          `inset 0 0 ${size*0.06}px ${w(0.8)}`, `inset 0 0 ${size*0.15}px ${color}aa`, `inset 0 0 ${size*0.3}px ${color}44`,
        ].join(", "),
        animation: "coronaPulse 5s ease-in-out infinite", zIndex: 7,
      }} />

      {/* Core — DARK center with bright edge */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(8,8,20,0.85) 0%, rgba(8,8,20,0.7) 40%, ${color}44 70%, ${color}aa 85%, ${w(0.7)} 95%, ${w(0.9)} 100%)`,
        boxShadow: `0 0 ${size*0.15}px ${color}cc, 0 0 ${size*0.4}px ${color}66, 0 0 ${size*0.8}px ${color}33, 0 0 ${size*1.5}px ${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        textAlign: "center", position: "relative", zIndex: 8,
        animation: "coreFlicker 4s ease-in-out infinite",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "scale(1.04)" : "scale(1)",
        cursor: "default",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── PLANETARY SYSTEM (BBOS) ──────────────────────────────────
function PlanetarySystem({ starId, onSelectPlanet, transition: exitTransition }) {
  const star = STARS[starId];
  const [hovered, setHovered] = useState(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const fn = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);

  if (starId !== "bbos") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.6s ease" }}>
        <div style={{ textAlign: "center", maxWidth: 440, padding: 20 }}>
          <GlowOrb size={110} color={star.color} glow={star.glow} style={{ margin: "0 auto 28px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1.5, fontFamily: "var(--mono)" }}>{star.shortName.toUpperCase()}</span>
          </GlowOrb>
          <h2 style={{ fontSize: 26, fontWeight: 300, color: "#fff", marginBottom: 14, fontFamily: "var(--serif)" }}>{star.name.replace("\n", " ")}</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 28 }}>{star.desc}</p>
          <div style={{ display: "inline-block", padding: "9px 22px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 5, color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 2.5, fontFamily: "var(--mono)" }}>COMING SOON</div>
        </div>
      </div>
    );
  }

  const cx = dims.w / 2, cy = dims.h / 2;
  const centerSize = Math.min(dims.w * 0.2, dims.h * 0.26, 180);
  const orbitR = Math.min(cx, cy) * 0.6;

  return (
    <div style={(() => {
      const base = { position: "fixed", inset: 0, zIndex: 10, overflow: "hidden" };
      if (exitTransition && exitTransition.from === "system") {
        return { ...base, animation: "none", opacity: 0, transform: "scale(0.5)", transition: `all ${TRANSITION_MS}ms ${SMOOTH}` };
      }
      return { ...base, animation: `zoomIn ${TRANSITION_MS}ms ${SMOOTH} both` };
    })()}>
      {/* Single orbital ring */}
      <div style={{
        position: "absolute", left: cx - orbitR, top: cy - orbitR,
        width: orbitR * 2, height: orbitR * 2, borderRadius: "50%",
        border: `1px solid rgba(255,255,255,${hovered !== null ? 0.1 : 0.05})`,
        transition: "border-color 0.3s", pointerEvents: "none",
      }} />

      {/* Central star — blazing sun */}
      <div style={{ position: "absolute", left: cx - centerSize / 2, top: cy - centerSize / 2, zIndex: 15 }}>
        <CelestialStar size={centerSize} color={star.color}>
          <div style={{ padding: 10, textAlign: "center", position: "relative", zIndex: 6 }}>
            <div style={{
              fontSize: Math.max(9, centerSize * 0.055), fontWeight: 700, color: "#fff", letterSpacing: 2.5,
              lineHeight: 1.6, fontFamily: "var(--mono)", textShadow: "0 1px 6px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.4)",
              whiteSpace: "pre-line", marginBottom: 6,
            }}>{"BARAKAH\nBUSINESS\nOPERATING\nSYSTEM"}</div>
            <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
              <span style={{
                padding: "3px 8px", fontSize: 7, fontWeight: 700, letterSpacing: 1.2,
                background: "rgba(255,255,255,0.85)", color: "#1a1000", borderRadius: 3, fontFamily: "var(--mono)",
                textShadow: "none",
              }}>FIRST TIME</span>
              <span style={{
                padding: "3px 8px", fontSize: 7, fontWeight: 700, letterSpacing: 1.2,
                background: "transparent", color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.5)", borderRadius: 3, fontFamily: "var(--mono)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}>RETURNING</span>
            </div>
          </div>
        </CelestialStar>
      </div>

      {/* Planets */}
      {STAGES.map((stage, i) => {
        const angleBase = -90 + i * (360 / 9);
        const angle = (angleBase * Math.PI) / 180;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR;
        const isH = hovered === i;
        const pSize = isH ? 52 : 38;
        return (
          <div key={stage.code} style={{
            position: "absolute", left: px - pSize / 2, top: py - pSize / 2, zIndex: isH ? 25 : 12,
          }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <GlowOrb size={pSize} color={stage.color} glow={stage.color + "44"} onClick={() => onSelectPlanet(stage)} pulse={false}
              style={{ background: `linear-gradient(135deg, ${stage.gradient[0]}, ${stage.gradient[1]})`, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
              <span style={{ fontSize: isH ? 9 : 11, fontWeight: 700, color: "#fff", fontFamily: "var(--mono)", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {isH ? stage.code : stage.num}
              </span>
            </GlowOrb>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: pSize + 5, whiteSpace: "nowrap", textAlign: "center", opacity: isH ? 1 : 0.5, transition: "opacity 0.25s" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: 1.2, fontFamily: "var(--mono)" }}>STAGE</div>
              <div style={{ fontSize: isH ? 15 : 12, fontWeight: 700, color: "#fff", fontFamily: "var(--serif)", transition: "font-size 0.25s" }}>{stage.name.toUpperCase()}</div>
            </div>
            {isH && stage.tools.map((_, ti) => {
              const mA = (ti / stage.tools.length) * Math.PI * 2 - Math.PI / 2;
              const mR = pSize / 2 + 14;
              return <div key={ti} style={{
                position: "absolute", left: pSize / 2 + Math.cos(mA) * mR - 3, top: pSize / 2 + Math.sin(mA) * mR - 3,
                width: 6, height: 6, borderRadius: "50%", background: `${stage.color}aa`, boxShadow: `0 0 5px ${stage.color}55`,
                animation: `moonPing 2s ease-in-out infinite ${ti * 0.4}s`,
              }} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── PLANET DETAIL ────────────────────────────────────────────
function PlanetDetail({ stage, onNavigate }) {
  const [selTool, setSelTool] = useState(null);
  const [hovMoon, setHovMoon] = useState(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const fn = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);

  const isMobile = dims.w < 768;
  const planetSize = isMobile ? Math.min(dims.w * 0.22, 100) : Math.min(dims.w * 0.16, dims.h * 0.22, 160);
  const moonOrbitR = planetSize * 0.85 + 25;

  // Enriched BBOS data lookups
  const stageDua = DUAS[stage.code];
  const stageMeta = THRESHOLD_META[stage.code];
  const stageArabic = STAGE_ARABIC[stage.code];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", flexDirection: isMobile ? "column" : "row", animation: `zoomIn ${TRANSITION_MS}ms ${SMOOTH} both` }}>
      {/* Left: orbital view */}
      <div style={{ flex: isMobile ? "none" : 1, height: isMobile ? "35vh" : "auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {/* Orbit ring */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: (moonOrbitR + planetSize / 2) * 2, height: (moonOrbitR + planetSize / 2) * 2,
          marginLeft: -(moonOrbitR + planetSize / 2), marginTop: -(moonOrbitR + planetSize / 2),
          borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.05)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <GlowOrb size={planetSize} color={stage.color} glow={stage.color + "33"} pulse={false}
            style={{ background: `linear-gradient(135deg, ${stage.gradient[0]}, ${stage.gradient[1]})`, boxShadow: `0 0 ${planetSize * 0.5}px ${stage.color}22, 0 0 ${planetSize}px ${stage.color}0d` }}>
            <div style={{ padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "rgba(255,255,255,0.65)", marginBottom: 3, fontFamily: "var(--mono)" }}>STAGE {stage.num}</div>
              <div style={{ fontSize: Math.max(15, planetSize * 0.1), fontWeight: 700, color: "#fff", marginBottom: 4, fontFamily: "var(--serif)" }}>{stage.fullName}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontFamily: "var(--arabic, 'Noto Naskh Arabic', serif)" }}>{stage.attr}</div>
            </div>
          </GlowOrb>

          {/* Moons */}
          {stage.tools.map((tool, i) => {
            const angle = (i / stage.tools.length) * Math.PI * 2 - Math.PI / 2;
            const r = moonOrbitR + planetSize / 2;
            const mx = Math.cos(angle) * r, my = Math.sin(angle) * r;
            const isH = hovMoon === i, isSel = selTool?.id === tool.id;
            const mSize = isH || isSel ? 52 : 40;
            return (
              <div key={tool.id} style={{
                position: "absolute", left: planetSize / 2 + mx - mSize / 2, top: planetSize / 2 + my - mSize / 2,
                zIndex: isH || isSel ? 20 : 10, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              }} onMouseEnter={() => setHovMoon(i)} onMouseLeave={() => setHovMoon(null)}>
                {/* Connection line */}
                <svg style={{ position: "absolute", left: mSize / 2, top: mSize / 2, width: 1, height: 1, overflow: "visible", pointerEvents: "none", zIndex: -1 }}>
                  <line x1={0} y1={0} x2={-mx} y2={-my} stroke={`${stage.color}${isH || isSel ? "22" : "0a"}`} strokeWidth={1} strokeDasharray={isH || isSel ? "none" : "3 5"} />
                </svg>
                <GlowOrb size={mSize} color={stage.color} glow={stage.color + "33"} onClick={() => setSelTool(isSel ? null : tool)} pulse={false}
                  style={{ background: `radial-gradient(circle at 35% 35%, ${stage.color}99, ${stage.color}33 80%, transparent)`, border: isSel ? `2px solid ${stage.color}` : "2px solid transparent" }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: "#fff", fontFamily: "var(--mono)", textAlign: "center", lineHeight: 1.15, padding: 3 }}>
                    {isH || isSel ? tool.name.split(" ")[0].slice(0, 8) : `T${i + 1}`}
                  </span>
                </GlowOrb>
                <div style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)", top: mSize + 5, whiteSpace: "nowrap",
                  fontSize: 9, fontWeight: 600, color: isH || isSel ? "#fff" : "rgba(255,255,255,0.4)",
                  fontFamily: "var(--mono)", textAlign: "center", transition: "color 0.2s",
                  maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis",
                }}>{tool.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: isMobile ? "100%" : "min(420px, 45vw)",
        flex: isMobile ? 1 : "none",
        padding: isMobile ? "16px 18px 24px" : "56px 24px 24px",
        background: "linear-gradient(180deg, rgba(8,8,16,0.5), rgba(8,8,16,0.92))",
        borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.04)",
        borderTop: isMobile ? "1px solid rgba(255,255,255,0.04)" : "none",
        overflowY: "auto",
      }}>
        {/* Stage header */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: stage.color, textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--mono)" }}>Stage {stage.num} {"\u00b7"} {stage.code}</div>
        <h2 style={{ fontSize: 26, fontWeight: 300, color: "#fff", margin: "0 0 6px", fontFamily: "var(--serif)" }}>{stage.fullName}</h2>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: `${stage.color}bb`, fontStyle: "italic" }}>{stage.attr}</span>
        </div>
        {stageArabic && (
          <div style={{ fontSize: 16, color: `${stage.color}88`, fontFamily: "var(--arabic, 'Amiri', serif)", direction: "rtl", textAlign: "right", marginBottom: 12 }}>
            {stageArabic}
          </div>
        )}
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 18, lineHeight: 1.7, borderLeft: `2px solid ${stage.color}33`, paddingLeft: 12 }}>{stage.orientation}</div>

        {/* Pipeline position */}
        <PipelineBar stages={STAGES} currentStage={stage} onNavigate={onNavigate} />

        {/* Opening Dua */}
        {stageDua && <DuaDisplay dua={stageDua} color={stage.color} />}

        {/* Governing Attributes */}
        {stageMeta?.attributesFull && stageMeta.attributesFull.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "rgba(255,255,255,0.25)", marginBottom: 8, fontFamily: "var(--mono)" }}>
              GOVERNING ATTRIBUTES {"\u00b7"} {stageMeta.attributesFull.length}
            </div>
            {stageMeta.attributesFull.map((attr, i) => (
              <AttributeCard key={i} attr={attr} color={stage.color} />
            ))}
          </div>
        )}

        {/* Readiness & Reflection */}
        {stageDua && (
          <ReadinessCheck
            readiness={stageDua.readiness}
            reflection={stageDua.reflection}
            signHeaders={stageMeta?.signHeaders}
            color={stage.color}
          />
        )}

        {/* Tools */}
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "rgba(255,255,255,0.25)", marginBottom: 10, fontFamily: "var(--mono)" }}>MOONS {"\u00b7"} {stage.tools.length} TOOLS</div>
        {stage.tools.map((tool, i) => {
          const isSel = selTool?.id === tool.id;
          return (
            <div key={tool.id} onClick={() => setSelTool(isSel ? null : tool)} style={{
              padding: "12px 14px", marginBottom: 6,
              background: isSel ? `${stage.color}0d` : "rgba(255,255,255,0.015)",
              border: `1px solid ${isSel ? stage.color + "33" : "rgba(255,255,255,0.04)"}`,
              borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: `radial-gradient(circle at 35% 35%, ${stage.color}77, ${stage.color}22)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 700, color: "#fff", fontFamily: "var(--mono)",
                }}>T{i + 1}</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#fff", flex: 1 }}>{tool.name}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", transform: isSel ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25be"}</span>
              </div>
              {isSel && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, paddingLeft: 31, paddingTop: 8, animation: "fadeIn 0.25s ease" }}>{tool.desc}</div>}
            </div>
          );
        })}

        {/* Closing Dua */}
        {stageMeta?.closingDua && (
          <div style={{ marginTop: 16, padding: "12px 14px", background: `${stage.color}06`, border: `1px solid ${stage.color}12`, borderRadius: 8 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: `${stage.color}77`, fontFamily: "var(--mono)", marginBottom: 6 }}>CLOSING DUA</div>
            <div style={{ direction: "rtl", textAlign: "right", fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.8)", fontFamily: "var(--arabic, 'Amiri', serif)", marginBottom: 4 }}>
              {stageMeta.closingDua.arabic}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginBottom: 2 }}>{stageMeta.closingDua.trans}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{stageMeta.closingDua.meaning}</div>
            <div style={{ fontSize: 9, color: `${stage.color}66`, fontFamily: "var(--mono)", marginTop: 4 }}>{stageMeta.closingDua.source}</div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {stage.num > 1 && <button onClick={() => onNavigate(STAGES[stage.num - 2])} style={{
            flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 6, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 10, fontFamily: "var(--mono)", letterSpacing: 1, transition: "all 0.2s",
          }}>{"\u2190"} {STAGES[stage.num - 2].code}</button>}
          {stage.num < 9 && <button onClick={() => onNavigate(STAGES[stage.num])} style={{
            flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 6, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 10, fontFamily: "var(--mono)", letterSpacing: 1, transition: "all 0.2s",
          }}>{STAGES[stage.num].code} {"\u2192"}</button>}
        </div>
      </div>
    </div>
  );
}

// ── Transition duration constant ─────────────────────────────
const TRANSITION_MS = 800;
const SPRING = "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
const SMOOTH = "cubic-bezier(0.16, 1, 0.3, 1)";

// ── Two-phase zoom-out wrapper ───────────────────────────────
function ZoomOutWrapper({ children }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase(1));
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      opacity: phase === 1 ? 0 : 1,
      transform: phase === 1 ? "scale(2.5)" : "scale(1)",
      transition: phase === 1 ? `all ${TRANSITION_MS}ms ${SMOOTH}` : "none",
      pointerEvents: "none",
    }}>
      {children}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function OgdenGalaxy() {
  const [view, setView] = useState("entry");
  const [selectedStar, setSelectedStar] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  // Transition state: { from, to, key?, stage?, progress: 'running'|null }
  const [transition, setTransition] = useState(null);
  // Parallax offset for starfield during transitions
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Transition helpers
  const startTransition = useCallback((from, to, meta = {}) => {
    setTransition({ from, to, ...meta, progress: "running" });
    // Parallax: push background in opposite direction
    if (meta.starKey) {
      const layout = { bbos: { x: 0, y: 20 }, moontrance: { x: 30, y: -15 }, atlas: { x: -30, y: -15 } };
      const off = layout[meta.starKey] || { x: 0, y: 0 };
      setParallax({ x: -off.x, y: -off.y });
    }
    // Set view and data immediately so both layers render during transition.
    // The transition state controls which layer is animating in/out.
    if (to === "system" && meta.reverse) {
      setSelectedStage(null);
      setView("system");
    } else if (to === "system" && meta.starKey) {
      setSelectedStar(meta.starKey);
      setView("system");
    } else if (to === "planet") {
      setSelectedStage(meta.stage);
      setView("planet");
    }
    setTimeout(() => {
      setTransition(null);
      setParallax({ x: 0, y: 0 });
    }, TRANSITION_MS);
  }, []);

  const breadcrumbPath = useMemo(() => {
    const p = [{ label: "Ogden", view: "entry" }];
    if (view !== "entry") p.push({ label: "Galaxy", view: "stars" });
    if ((view === "system" || view === "planet") && selectedStar) p.push({ label: STARS[selectedStar].shortName, view: "system" });
    if (view === "planet" && selectedStage) p.push({ label: selectedStage.code, view: "planet" });
    return p;
  }, [view, selectedStar, selectedStage]);

  // Store startTransition in a ref so nav doesn't depend on it
  const startTransitionRef = useRef(startTransition);
  startTransitionRef.current = startTransition;

  const nav = useCallback((i) => {
    const t = breadcrumbPath[i];
    if (t.view === "entry") { setView("entry"); setSelectedStar(null); setSelectedStage(null); }
    else if (t.view === "stars") { setView("stars"); setSelectedStar(null); setSelectedStage(null); }
    else if (t.view === "system" && view === "planet") {
      startTransitionRef.current("planet", "system", { reverse: true, exitingStage: selectedStage });
    } else if (t.view === "system") {
      setView("system"); setSelectedStage(null);
    }
  }, [breadcrumbPath, view]);

  // Handler: StarField → PlanetarySystem (with spatial transition)
  const handleSelectStar = useCallback((id) => {
    startTransition("stars", "system", { starKey: id });
  }, [startTransition]);

  // Handler: PlanetarySystem → PlanetDetail (with spatial transition)
  const handleSelectPlanet = useCallback((stage) => {
    startTransition("system", "planet", { stage });
  }, [startTransition]);

  const isTransitioning = transition?.progress === "running";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "radial-gradient(ellipse at center, #0a0a14 0%, #040406 100%)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden", color: "#fff",
    }}>
      <StarfieldCanvas depth={view === "entry" ? 0.5 : view === "planet" ? 1.1 : 0.8} />
      {/* Nebula background with parallax */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        transition: `transform ${TRANSITION_MS}ms ${SMOOTH}`,
        transform: `translate(${parallax.x}px, ${parallax.y}px)`,
      }}>
        <div style={{
          position: "absolute", width: "130%", height: "130%", top: "-15%", left: "-15%",
          background: "radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 55%, rgba(168,85,247,0.04) 0%, transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(245,158,35,0.03) 0%, transparent 40%)",
        }} />
      </div>

      {view !== "entry" && !isTransitioning && <Breadcrumb path={breadcrumbPath} onNavigate={nav} />}
      {view === "entry" && <GalaxyEntry onEnter={() => setView("stars")} />}

      {/* StarField — show during 'stars' view AND during stars→system transition */}
      {(view === "stars" || (isTransitioning && transition.from === "stars")) && (
        <StarField
          onSelectStar={handleSelectStar}
          transition={isTransitioning && transition.from === "stars" ? transition : null}
        />
      )}

      {/* PlanetarySystem — stays mounted during both forward and reverse transitions */}
      {(view === "system" || (view === "planet" && isTransitioning && transition.from === "system")) && selectedStar && (
        <PlanetarySystem
          starId={selectedStar}
          onSelectPlanet={isTransitioning ? () => {} : handleSelectPlanet}
        />
      )}

      {/* PlanetDetail — shows during forward transition (zooming in) and normal view */}
      {view === "planet" && selectedStage && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 15,
          animation: isTransitioning && transition?.from === "system"
            ? `zoomIn ${TRANSITION_MS}ms ${SMOOTH} both`
            : "none",
        }}>
          <PlanetDetail
            stage={selectedStage}
            onNavigate={isTransitioning ? () => {} : s => setSelectedStage(s)}
          />
        </div>
      )}
      {/* PlanetDetail exiting during reverse (planet→system) */}
      {isTransitioning && transition.from === "planet" && transition.exitingStage && (
        <ZoomOutWrapper>
          <PlanetDetail stage={transition.exitingStage} onNavigate={() => {}} />
        </ZoomOutWrapper>
      )}
    </div>
  );
}
