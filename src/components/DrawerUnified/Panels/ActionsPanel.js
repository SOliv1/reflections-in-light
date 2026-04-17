export default function ActionsPanel() {
  return (
    <div className="panel actions-panel">
      <button className="add-button">+ Add Action</button>

      <div className="actions-list">
        {/* Future actions will appear here */}
        <p className="placeholder">Your quiet actions will gather here.</p>
      </div>
    </div>
  );
}
