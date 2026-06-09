    import { useState } from 'react';

    export default function CreateTicketModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'other',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(form);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
            <h2 className="modal-title">Create New Ticket</h2>
            <button className="modal-close" onClick={onClose}>Close</button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Title</label>
                <input
                className="form-input"
                placeholder="Brief description of the issue"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                className="form-textarea"
                placeholder="Full details of the issue..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                    className="form-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                </div>

                <div className="form-group">
                <label className="form-label">Category</label>
                <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="delivery_missed">Delivery Missed</option>
                    <option value="truck_breakdown">Truck Breakdown</option>
                    <option value="double_billing">Double Billing</option>
                    <option value="wrong_address">Wrong Address</option>
                    <option value="other">Other</option>
                </select>
                </div>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">Create Ticket</button>
            </div>
            </form>
        </div>
        </div>
    );
    }