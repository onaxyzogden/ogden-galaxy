export default function AttributeCard({ attr, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.04)",
      borderLeft: `3px solid ${color}66`,
      borderRadius: "0 8px 8px 0",
      padding: "14px 16px", marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: `${color}dd`, fontFamily: "var(--serif)" }}>
          {attr.name}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
          {attr.title}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
        {attr.body}
      </div>
    </div>
  );
}
