import { useState, useEffect } from 'react';
import { FaAddressBook, FaPhone, FaEnvelope } from 'react-icons/fa';
import { SwipeableList, SwipeableListItem, TrailingActions, SwipeAction, Type } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import Header from "../../components/Header";
import SendRequest from "./components/SendRequest";
import RequestListModal from "./components/RequestList";
import { getAllProducers } from '../../services/userService';
import { getConnectionsWithTransporter, createConnectionWithTransporter, updateConnectionStatus, cancelConnectionRequest } from '../../services/connectionService';

const Produce = () => {
    const [producers, setProducers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedProduce, setSelectedProduce] = useState(null);
    const [showRequest, setShowRequest] = useState(false);
    const [showList, setShowList] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Sent');
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        fetchProducers();
        fetchConnections();
    }, []);

    const fetchProducers = async () => {
        try {
            const data = await getAllProducers();
            setProducers(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchConnections = async () => {
        try {
            const data = await getConnectionsWithTransporter();
            setConnections(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleShowPhone = (producer = null) => { window.location.href = `tel:${producer.contactPhone}` };

    const handleShowRequest = async (producer) => {
        setSelectedProduce(producer);
        setShowRequest(true);
    };

    const handleShowList = async () => setShowList(true);

    const handleClose = () => {
        setShowRequest(false);
        setShowList(false);
    };

    const handleSendRequest = async () => {
        const existingRequest = connections.find((connection) => connection.producerID?._id === selectedProduce._id && connection.status === 'Pending');
        if (existingRequest) {
            alert("Đã có yêu cầu hợp tác đang chờ.");
            return;
        }
        try {
            await createConnectionWithTransporter({ producerID: selectedProduce._id, message });
            alert('Yêu cầu gửi thành công');
            fetchConnections();
            handleClose();
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleAcceptRequest = async (id) => {
        try {
            await updateConnectionStatus(id, { status: 'Accepted' });
            alert("Yêu cầu hợp tác đã được chấp nhận.");
            setConnections((prev) => prev.map((c) => (c._id === id ? { ...c, status: 'Accepted' } : c)));
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await updateConnectionStatus(id, { status: 'Rejected' });
            alert("Yêu cầu hợp tác đã bị từ chối.");
            setConnections((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleCancelRequest = async (id) => {
        if (!window.confirm('Bạn có chắc muốn hủy yêu cầu hợp tác này?')) return;
        try {
            await cancelConnectionRequest(id);
            alert('Đã hủy yêu cầu hợp tác!');
            setConnections((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa hợp tác này?')) return;
        try {
            await cancelConnectionRequest(id);
            alert('Đã xóa yêu cầu hợp tác!');
            setConnections((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <div className="d-flex px-4 align-items-center justify-content-between mb-3">
                    <h2 className="fw-bold text-success mb-2 mt-2">Đơn Vị Sản Xuất</h2>
                    <button className="add-button" onClick={handleShowList}><FaAddressBook /></button>
                </div>
                <div className="px-4">
                    {producers.filter( (producer) => !connections.some( (connection) => connection.status === 'Accepted' && connection.producerID?._id === producer._id ) ).length === 0 ? (
                        <p className="mt-3 p-2 text-muted text-center">Không có đơn vị sản xuất nào!</p>
                    ) : (
                        producers
                        .filter( (producer) => !connections.some( (connection) => connection.status === 'Accepted' && connection.producerID?._id === producer._id ) )
                        .map((producer) => (
                            <div key={producer._id} className="card shadow-sm border-0 rounded-3 mb-3 p-3">
                                <SwipeableList type={Type.IOS} fullSwipe={false} threshold={0.25} >
                                    <SwipeableListItem
                                        onSwipeStart={() => setIsSwiping(true)}
                                        onSwipeEnd={() => setIsSwiping(false)}
                                        trailingActions={
                                            <TrailingActions>
                                            <div style={{ padding: '0 6px' }}>
                                                <SwipeAction onClick={() => handleShowRequest(producer)}>
                                                    <FaEnvelope style={{ fontSize: '28px', color: 'green' }} />
                                                </SwipeAction>
                                            </div>
                                            <div style={{ padding: '0 6px' }}>
                                                <SwipeAction onClick={() => handleShowPhone(producer)}>
                                                    <FaPhone style={{ fontSize: '28px', color: 'red' }} />
                                                </SwipeAction>
                                            </div>
                                            </TrailingActions>
                                        }
                                    >
                                        <div className="d-flex flex-column justify-content-between flex-grow-1" onClick={() => setSelectedProduce(producer === selectedProduce ? null : producer )}>
                                            <h4 className="h4 fw-bold text-dark mb-2">{producer.farmName}</h4>
                                            <p className="small text-muted mb-0">{producer.farmLocation}</p>
                                        </div>
                                    </SwipeableListItem>
                                </SwipeableList>
                                {!isSwiping && selectedProduce && selectedProduce._id === producer._id && (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '18px', marginBottom: '-10px', fontSize: '16px', }}>
                                        <img src={producer.image || '../../frontend/public/img/admin.jpg'} alt={producer.fullname} style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', marginRight: '16px', marginBottom: '10px' }}/>
                                        <div className="mt-3 mb-3">
                                            <p><strong>Người đại diện:</strong> {producer.fullname}</p>
                                            <p><strong>Email:</strong> {producer.contactEmail}</p>
                                            <p><strong>Số điện thoại:</strong> {producer.contactPhone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <SendRequest
                show={showRequest}
                onHide={handleClose}
                target={selectedProduce}
                targetLabel="Nhà Phân Phối"
                message={message}
                setMessage={setMessage}
                onSend={handleSendRequest}
            />

            <RequestListModal
                show={showList}
                onHide={handleClose}
                connections={connections}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                typeKey="typeTransporter"
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onCancel={handleCancelRequest}
                onDelete={handleDeleteRequest}
            />
        </div>
    );
};

export default Produce;