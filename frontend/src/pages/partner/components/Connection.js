import { FaUserCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const Connection = ({ connection, onAccept, onReject, onCancel, onDelete }) => {
    const user = typeof connection.producerID === "object" && connection.producerID !== null ? connection.producerID  : connection.transporterID;
    return (
        <div className="card shadow-sm mb-3 border-0 rounded-3">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                            {user?.image ? (
                                <img src={user.image} alt={user.farmName || user.companyName} className="img-fluid rounded-circle" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                            ) : (
                                <FaUserCircle size={40} className="text-success" />
                            )}
                        </div>
                        <div>
                            <h6 className="mb-1 fw-bold text-dark">{user?.farmName || user?.companyName || 'Không xác định'}</h6>
                            <p className="mb-0 text-muted small">{user?.farmLocation || user?.location || 'Địa chỉ không xác định'}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-1">
                        {onAccept && (<Button className="btn-sm" onClick={onAccept}><FaCheck style={{ color: 'white' }}/></Button>)}
                        {onReject && (<Button className="btn-sm" onClick={onReject}><FaTimes style={{ color: 'white' }}/></Button>)}
                        {onCancel && (<Button className="btn-sm" onClick={onCancel}><FaTimes style={{ color: 'white' }}/></Button>)}
                        {onDelete && (<Button className="btn-sm" onClick={onDelete}><FaTimes style={{ color: 'white' }}/></Button>)}
                    </div>
                </div>
                {connection.message && !onDelete && (
                    <div className="bg-light p-3 rounded mt-3">
                        <p className="mb-1 fw-semibold text-success small">Lời nhắn:</p>
                        <p className="mb-0 text-secondary small" style={{ lineHeight: 1.4 }}>{connection.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connection;