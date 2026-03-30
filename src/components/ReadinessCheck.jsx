import { useState } from "react";

export default function ReadinessCheck({ readiness, reflection, signHeaders, color }) {
  const [open, setOpen] = useState(false);
  if (!readiness && !reflection) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: open ? `${color}08` : "rgba(255,255,255,0.015)",
        border: `1px solid ${open ? color + "22" : "rgba(255,255,255,0.04)"}`,
        borderRadius: 8, padding: "10px 14px", cursor: "pointer",
        width: "100%", textAlign: "left", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: open ? `${color}cc` : "rgba(255,255,255,0.35)", fontFamily: "var(--mono)" }}>
          READINESS & REFLECTION
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25be"}</span>
      </button>

      {open && (
        <div style={{ padding: "12px 0", animation: "fadeIn 0.25s ease" }}>
          {/* Readiness */}
          {readiness && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: `${color}88`, fontFamily: "var(--mono)", marginBottom: 6 }}>
                READINESS CHECK
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 10, fontStyle: "italic" }}>
                {readiness.frame}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {/* Governing */}
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: "#5ab87a", marginBottom: 6, fontFamily: "var(--mono)" }}>
                    {signHeaders?.left ? signHeaders.left.split("when")[0] + "GOVERNING" : "GOVERNING"}
                  </div>
                  {readiness.governing.map((g, i) => (
                    <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #5ab87a33" }}>
                      {g}
                    </div>
                  ))}
                </div>
                {/* Not Yet */}
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: "#d47560", marginBottom: 6, fontFamily: "var(--mono)" }}>
                    NOT YET
                  </div>
                  {readiness.notYet.map((n, i) => (
                    <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #d4756033" }}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reflection */}
          {reflection && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: `${color}88`, fontFamily: "var(--mono)", marginBottom: 6 }}>
                REFLECTION
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 10, fontStyle: "italic" }}>
                {reflection.frame}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: "#5ab87a", marginBottom: 6, fontFamily: "var(--mono)" }}>GOVERNING</div>
                  {reflection.governing.map((g, i) => (
                    <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #5ab87a33" }}>{g}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: "#d47560", marginBottom: 6, fontFamily: "var(--mono)" }}>NOT YET</div>
                  {reflection.notYet.map((n, i) => (
                    <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 6, paddingLeft: 8, borderLeft: "2px solid #d4756033" }}>{n}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
