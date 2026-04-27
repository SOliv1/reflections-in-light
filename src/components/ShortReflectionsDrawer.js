import ReflectionsPanel from "./ReflectionsPanel";
import "./Drawer.css";


export default function ShortReflectionsDrawer({
  orbColor,
  weatherMood,
  season,
  onOpenActions,
  onOpenNotes,
  onClose
}) {

  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  return (
    <div
      className="short-reflections-drawer"
      style={{
        "--orbColor": orbColor,
        "--orbColorRGB": orbRGB
      }}
    >
      <button className="drawer-close-btn" onClick={onClose}>×</button>
      <button className="drawer-close-text" onClick={onClose}>Close</button>

      <h3 className="panel-title">Short Reflections</h3>
      <ReflectionsPanel weatherMood={weatherMood} season={season} />


      <div className="drawer-inner-buttons">
        <button className="drawer-btn" onClick={onOpenActions}>
          Quiet Actions
        </button>

        <button className="drawer-btn" onClick={onOpenNotes}>
          Light Notes
        </button>
      </div>


      {/* Your reflections content here */}
    </div>
  );
}

