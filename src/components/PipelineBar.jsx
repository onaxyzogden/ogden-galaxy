import { PHASES, LAYERS, LAYER_META } from "../data/bbos-stages";

export default function PipelineBar({ stages, currentStage, onNavigate }) {
  const currentNum = currentStage.num;
  const layer = LAYERS[currentStage.code];
  const phase = PHASES[currentStage.code];
  const layerMeta = LAYER_META[layer];
  const isExecutionValley = currentNum >= 5 && currentNum <= 8;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: "rgba(255,255,255,0.25)", fontFamily: "var(--mono)" }}>PIPELINE POSITION</span>
        {isExecutionValley && (
          <span style={{
            fontSize: 7, fontWeight: 700, letterSpacing: 1.5, padding: "2px 6px",
            background: "rgba(212,117,96,0.12)", color: "#d47560",
            border: "1px solid rgba(212,117,96,0.25)", borderRadius: 3,
            fontFamily: "var(--mono)",
          }}>EXECUTION VALLEY</span>
        )}
      </div>

      {/* Stage pills */}
      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
        {stages.map((s, i) => {
          const isCurrent = s.code === currentStage.code;
          const isPast = i < currentNum - 1;
          return (
            <div key={s.code} onClick={() => onNavigate(stages[i])} title={`${s.num}. ${s.fullName}`} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", padding: "4px 0",
              opacity: isCurrent ? 1 : isPast ? 0.6 : 0.25,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: "100%", height: isCurrent ? 6 : 3, borderRadius: 3,
                background: isCurrent || isPast
                  ? `linear-gradient(90deg, ${s.gradient[0]}, ${s.gradient[1]})`
                  : "rgba(255,255,255,0.08)",
                transition: "all 0.25s",
              }} />
              <span style={{
                fontSize: 7, fontWeight: 700, color: isCurrent ? "#fff" : "rgba(255,255,255,0.3)",
                fontFamily: "var(--mono)", letterSpacing: 0.5,
              }}>{s.code}</span>
            </div>
          );
        })}
      </div>

      {/* Phase and Layer badges */}
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: 1.5, padding: "3px 8px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 3, color: "rgba(255,255,255,0.4)", fontFamily: "var(--mono)",
        }}>
          {phase.toUpperCase()} PHASE
        </span>
        <span style={{
          fontSize: 8, fontWeight: 700, letterSpacing: 1.5, padding: "3px 8px",
          background: `${layerMeta.color}0a`, border: `1px solid ${layerMeta.color}22`,
          borderRadius: 3, color: `${layerMeta.color}cc`, fontFamily: "var(--mono)",
        }}>
          {layer.toUpperCase()} LAYER
        </span>
      </div>
    </div>
  );
}
