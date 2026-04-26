import "./Drawer.css";
import "../styles/DrawerUnified.css";

export default function UnifiedDrawer({ isOpen, onClose, children }) {
  return (
    <div
      className={`drawer-overlay unified-drawer-overlay ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div className="drawer-panel unified-drawer-panel" role="dialog" aria-modal="true">
        <button className="drawer-close unified-drawer-close" onClick={onClose} aria-label="Close drawer">
          x
        </button>
        {children}
      </div>
    </div>
  );
}
