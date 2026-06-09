import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';
import TicketRow from '../components/TicketRow';
import CreateTicketModal from '../components/CreateTicketModal';
import EditTicketModal from '../components/EditTicketModal';

export default function Dashboard({ agent, onLogout }) {
const [showCreate, setShowCreate] = useState(false);
const [editingTicket, setEditingTicket] = useState(null);
const [loading, setLoading] = useState(true);

const {
    connected,
    ticketLocks,
    tickets,
    setTickets,
    lockTicket,
    unlockTicket,
    socketId,
} = useSocket(agent);

useEffect(() => {
    const fetchTickets = async () => {
    try {
        const res = await api.get('/tickets');
        setTickets(res.data.tickets);
    } catch (err) {
        console.error('Failed to fetch tickets:', err.message);
    } finally {
        setLoading(false);
    }
    };
    fetchTickets();
}, [setTickets]);

const handleOpenTicket = (ticket) => {
    const lock = ticketLocks[ticket._id];
    if (lock && lock.socketId !== socketId) return;
    lockTicket(ticket._id);
    setEditingTicket(ticket);
};

const handleCloseTicket = () => {
    if (editingTicket) unlockTicket(editingTicket._id);
    setEditingTicket(null);
};

const handleSaveTicket = async (ticketId, updates) => {
    try {
        const res = await api.put(`/tickets/${ticketId}`, updates);
        setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? res.data.ticket : t))
        );
        unlockTicket(ticketId);
        setEditingTicket(null);
    } catch (err) {
        console.error('Failed to save ticket:', err.message);
    }
    };

const handleCreateTicket = async (data) => {
    try {
    await api.post('/tickets', data);
    setShowCreate(false);
    } catch (err) {
    console.error('Failed to create ticket:', err.message);
    }
};

return (
    <div className="dashboard">
    {!connected && (
        <div className="connection-lost-banner">
        Connection Lost — Reconnecting... Your changes may not save.
        </div>
    )}

    <nav className="dash-nav">
        <div className="dash-brand">
        <div className="brand-indicator" />
        <span className="brand-name">RapidDispatch</span>
        <span className="brand-sub">Live Ops</span>
        </div>
        <div className="dash-nav-right">
        <div className={`connection-status ${connected ? 'online' : 'offline'}`}>
            <div className="status-dot" />
            {connected ? 'Live' : 'Disconnected'}
        </div>
        <span className="agent-name">{agent.name}</span>
        <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
    </nav>

    <div className="dash-content">
        <div className="dash-header">
        <div>
            <h1 className="dash-title">Support Tickets</h1>
            <p className="dash-subtitle">
            {tickets.length} active tickets — real-time collaborative view
            </p>
        </div>
        <button className="btn-create" onClick={() => setShowCreate(true)}>
            New Ticket
        </button>
        </div>

        <div className="ticket-table-card">
        <div className="ticket-table-header">
            <span>Title</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Lock Status</span>
            <span>Action</span>
        </div>

        {loading ? (
            <div className="table-state">Loading tickets...</div>
        ) : tickets.length === 0 ? (
            <div className="table-state">No tickets yet. Create the first one.</div>
        ) : (
            tickets.map((ticket) => (
            <TicketRow
                key={ticket._id}
                ticket={ticket}
                lock={ticketLocks[ticket._id]}
                currentSocketId={socketId}
                onOpen={handleOpenTicket}
            />
            ))
        )}
        </div>
    </div>

    {showCreate && (
        <CreateTicketModal
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateTicket}
        />
    )}

    {editingTicket && (
        <EditTicketModal
        ticket={editingTicket}
        onClose={handleCloseTicket}
        onSave={handleSaveTicket}
        />
    )}
    </div>
);
}