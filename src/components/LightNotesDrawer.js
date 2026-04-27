import { useState, useEffect } from "react";

export default function LightNotesDrawer({ orbColor, onClose }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  // Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem("lightNotes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem("lightNotes", JSON.stringify(notes));
  }, [notes]);

  // ⭐ NEW: Add newest note at the TOP
  const addNote = () => {
    if (!text.trim()) return;
    const newNote = { id: Date.now(), text };
    setNotes([newNote, ...notes]);   // NEWEST FIRST
    setText("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

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

      <h3 className="panel-title">Light Notes</h3>

      {/* Input area */}
      <textarea
        className="journal-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Let your thoughts settle here…"
      />

      <button className="drawer-btn" onClick={addNote}>
        Add Note
      </button>

      {/* Notes list */}
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <p>{note.text}</p>
            <button className="remove-btn" onClick={() => deleteNote(note.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


