export default function BeeSpinner({ size = 40, text }) {
  const s = typeof size === "number" ? size : 40;
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px", gap: "16px",
    }}>
      <style>{`
        @keyframes beeSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.15); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes beePulse {
          0% { transform: scale(0.85); opacity: 0.25; }
          50% { transform: scale(1.3); opacity: 0.1; }
          100% { transform: scale(0.85); opacity: 0.25; }
        }
        .bee-spin {
          animation: beeSpin 1.5s ease-in-out infinite;
          display: inline-block;
        }
        .bee-pulse {
          animation: beePulse 2s ease-in-out infinite;
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, #d97706, #b45309);
        }
      `}</style>
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        justifyContent: "center", width: s * 2.2, height: s * 2.2,
      }}>
        <div className="bee-pulse" style={{ width: s * 1.8, height: s * 1.8 }} />
        <span className="bee-spin" style={{ fontSize: s, lineHeight: 1, position: "relative", zIndex: 1 }}>🐝</span>
      </div>
      {text && (
        <p style={{ margin: 0, fontSize: "15px", color: "#b45309", fontWeight: "600" }}>
          {text}
        </p>
      )}
    </div>
  );
}
