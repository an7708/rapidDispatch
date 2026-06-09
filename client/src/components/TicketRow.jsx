    const PRIORITY_CLASS = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    critical: 'priority-critical',
    };

    const STATUS_CLASS = {
    open: 'status-open',
    in_progress: 'status-progress',
    resolved: 'status-resolved',
    closed: 'status-closed',
    };

    export default function TicketRow({ ticket, lock, currentSocketId, onOpen }) {
    const isLockedByOther = lock && lock.socketId !== currentSocketId;
    const isLockedByMe = lock && lock.socketId === currentSocketId;

    console.log(ticket._id, lock);
    
    return (
        <div className={`ticket-row ${isLockedByOther ? 'ticket-row-locked' : ''}`}>
        <div className="ticket-title-col">
            <span className="ticket-title">{ticket.title}</span>
            <span className="ticket-category">{ticket.category?.replace(/_/g, ' ')}</span>
        </div>
        <span className={`priority-badge ${PRIORITY_CLASS[ticket.priority]}`}>
            {ticket.priority}
        </span>
        <span className={`status-badge ${STATUS_CLASS[ticket.status]}`}>
            {ticket.status?.replace(/_/g, ' ')}
        </span>
        <span className="lock-status">
            {isLockedByOther && (
            <span className="lock-indicator">
                Locked by {lock.agentName}
            </span>
            )}
            {isLockedByMe && (
            <span className="lock-mine"> Editing</span>
            )}
            {!lock && <span className="lock-free">Available</span>}
        </span>
        <button
            className={`btn-open ${isLockedByOther ? 'btn-locked' : ''}`}
            onClick={() => onOpen(ticket)}
            disabled={isLockedByOther}>
            {isLockedByOther ? 'Locked' : 'Open'}
        </button>
        </div>
    );
    }