import { useState } from 'react';

export default function EditTicketModal({ ticket, onClose, onSave }) {
const [form, setForm] = useState({
    status: ticket.status,
    resolution: ticket.resolution || '',
    assignedTo: ticket.assignedTo || '',
});
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');

const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
    await onSave(ticket._id, form);
    } catch (err) {
    setError('Failed to save. Please try again.');
    setSaving(false);
    }
};

return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card modal-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
        <div>
            <h2 className="modal-title">{ticket.title}</h2>
            <p className="modal-meta">
            {ticket.category?.replace(/_/g, ' ')} — Created By {ticket.createdBy}
            </p>
        </div>
        <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        <div className="modal-body">
        {error && <div className="modal-error">{error}</div>}

        <div className="ticket-description">
            <p className="form-label">Description</p>
            <p className="ticket-desc-text">{ticket.description}</p>
        </div>

        <div className="form-row">
            <div className="form-group">
            <label className="form-label">Status</label>
            <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
            </select>
            </div>

            <div className="form-group">
            <label className="form-label">Assigned To</label>
            <input
                className="form-input"
                placeholder="Agent name"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            />
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Resolution Notes</label>
            <textarea
            className="form-textarea"
            placeholder="Describe how this issue was resolved..."
            value={form.resolution}
            onChange={(e) => setForm({ ...form, resolution: e.target.value })}
            rows={5}
            />
        </div>
        </div>

        <div className="modal-actions">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save and Close'}
        </button>
        </div>
    </div>
    </div>
);
}