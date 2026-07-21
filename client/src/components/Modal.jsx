// A simple, reusable modal dialog.
// Renders its children centered over a dimmed backdrop. Clicking the backdrop
// or the × button calls onClose.
export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Stop clicks inside the dialog from bubbling up and closing it. */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
