export default function NotesPanel() {
  return (
    <div className="panel notes-panel">
      <button className="add-button">+ Add Note</button>

      <div className="tags-row">
        <span className="tag">Daily</span>
        <span className="tag">Dream</span>
        <span className="tag">Seasonal</span>
      </div>

      <p className="placeholder">Your light notes will appear here.</p>
    </div>
  );
}
