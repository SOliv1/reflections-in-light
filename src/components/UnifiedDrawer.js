import "./Drawer.css";
import "../styles/DrawerUnified.css";

export default function UnifiedDrawer({ isOpen, onClose, children }) {
  return (
    <div
      className={`drawer-overlay unified-drawer-overlay ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div
        className="drawer-panel unified-drawer-panel"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="unified-drawer-topbar">
          <div className="unified-drawer-scrollhint" aria-hidden="true">
            <span>Scroll inside this panel</span>
            <span className="unified-drawer-scrollhint-arrows">↑ ↓</span>
          </div>
          <button
            className="drawer-close unified-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
            type="button"
          >
            ×
          </button>
        </div>
        <p className="unified-drawer-closehint">Tap outside the panel or use × to close.</p>
        {children}
      </div>
    </div>
  );
}
