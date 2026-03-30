import { useState } from "react";

export default function DuaDisplay({ dua, color }) {
  const [expanded, setExpanded] = useState(false);
  if (!dua) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}08, ${color}03)`,
      border: `1px solid ${color}18`,
      borderRadius: 10, padding: "16px 18px", marginBottom: 16,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: `${color}aa`, textTransform: "uppercase", marginBottom: 10, fontFamily: "var(--mono)" }}>
        {dua.title}
      </div>

      {/* Arabic */}
      <div style={{
        direction: "rtl", textAlign: "right",
        fontSize: 20, lineHeight: 2, color: "#fff",
        fontFamily: "var(--arabic, 'Amiri', 'Noto Naskh Arabic', serif)",
        marginBottom: 10, padding: "8px 0",
      }}>
        {dua.arabic}
      </div>

      {/* Transliteration */}
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic",
        lineHeight: 1.6, marginBottom: 6,
      }}>
        {dua.trans}
      </div>

      {/* Meaning */}
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.65,
        borderLeft: `2px solid ${color}33`, paddingLeft: 10, marginBottom: 8,
      }}>
        {dua.meaning}
      </div>

      {/* Source */}
      <div style={{
        fontSize: 10, color: `${color}88`, fontFamily: "var(--mono)",
        letterSpacing: 0.5,
      }}>
        {dua.source}
      </div>

      {/* Annotations (expandable) */}
      {dua.annotations && dua.annotations.length > 0 && (
        <>
          <button onClick={() => setExpanded(!expanded)} style={{
            background: "none", border: "none", color: `${color}99`,
            fontSize: 10, fontWeight: 600, letterSpacing: 1, cursor: "pointer",
            fontFamily: "var(--mono)", marginTop: 10, padding: 0,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: 8 }}>{"\u25bc"}</span>
            {expanded ? "HIDE" : "VIEW"} ATTRIBUTE ANNOTATIONS
          </button>
          {expanded && dua.annotations.map((ann, i) => (
            <div key={i} style={{
              marginTop: 10, padding: "10px 12px",
              background: "rgba(255,255,255,0.02)",
              borderLeft: `2px solid ${color}33`,
              borderRadius: "0 6px 6px 0",
              animation: "fadeIn 0.25s ease",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: `${color}cc`, marginBottom: 4, fontFamily: "var(--mono)", letterSpacing: 0.5 }}>
                {ann.attr}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                {ann.text}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
