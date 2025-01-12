import { useState, useEffect } from 'react';
import { FaAddressBook, FaPhone, FaEnvelope } from 'react-icons/fa';
import { SwipeableList, SwipeableListItem, TrailingActions, SwipeAction, Type } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import Header from "../../components/Header";
import SendRequest from "./components/SendRequest";
import RequestListModal from "./components/RequestList";
import { getAllTransports } from '../../services/userService';
import { getConnectionsWithProducer, createConnectionWithProducer, updateConnectionStatus, cancelConnectionRequest } from '../../services/connectionService';

const Transport = () => {
  const [transporters, setTransporters] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showRequest, setShowRequest] = useState(false);
  const [showList, setShowList] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Sent');
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    fetchTransporters();
    fetchConnections();
  }, []);

  const fetchTransporters = async () => {
    try {
      const data = await getAllTransports();
      setTransporters(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchConnections = async () => {
    try {
      const data = await getConnectionsWithProducer();
      setConnections(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleShowPhone = (transporter = null) => { window.location.href = `tel:${transporter.contactPhone}` };

  const handleShowRequest = (transporter) => {
    setSelectedTransport(transporter);
    setShowRequest(true);
  };

  const handleShowList = () => setShowList(true);

  const handleClose = () => {
    setShowRequest(false);
    setShowList(false);
  };

  const handleSendRequest = async () => {
    const existingRequest = connections.find((connection) => connection.transporterID?._id === selectedTransport._id && connection.status === 'Pending');
    if (existingRequest) {
      alert('Đã có yêu cầu hợp tác đang chờ.');
      return;
    }
    try {
      await createConnectionWithProducer({transporterID: selectedTransport._id, message});
      alert('Gửi yêu cầu thành công.');
      fetchConnections();
      handleClose();
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await updateConnectionStatus(id, { status: 'Accepted' });
      alert('Yêu cầu hợp tác đã được chấp nhận.');
      setConnections((prev) => prev.map((c) => (c._id === id ? { ...c, status: 'Accepted' } : c)));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await updateConnectionStatus(id, { status: 'Rejected' });
      alert('Yêu cầu hợp tác đã bị từ chối.');
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Lỗi khi từ chối yêu cầu:', error);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu hợp tác này?')) return;
    try {
      await cancelConnectionRequest(id);
      alert('Đã hủy hợp tác thành công.');
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa hợp tác này?')) return;
    try {
      await cancelConnectionRequest(id);
      alert('Đã xóa hợp tác thành công.');
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <div className="header-container d-flex px-4 align-items-center justify-content-between mb-3">
          <h2 className="fw-bold text-success mb-2 mt-2">Đơn Vị Vận Chuyển</h2>
          <button className="add-button" onClick={handleShowList}><FaAddressBook /></button>
        </div>
        <div className="px-4">
          {transporters.filter( (transporter) => !connections.some( (connection) => connection.status === 'Accepted' && connection.transporterID?._id === transporter._id ) ).length === 0 ? (
            <p className="mt-3 p-2 text-muted text-center">Không có đơn vị vận chuyển nào nào!</p>
          ) : (
            transporters
            .filter( (transporter) => !connections.some( (connection) => connection.status === 'Accepted' && connection.transporterID?._id === transporter._id ) )
            .map((transporter) => (
              <div key={transporter._id} className="card card shadow-sm border-0 rounded-3 mb-3 p-3">
                <SwipeableList type={Type.IOS} fullSwipe={false} threshold={0.25} style={{ padding: '20px' }}>
                  <SwipeableListItem
                    onSwipeStart={() => setIsSwiping(true)}
                    onSwipeEnd={() => setIsSwiping(false)}
                    trailingActions={
                      <TrailingActions>
                        <div style={{ padding: '0 6px' }}>
                          <SwipeAction onClick={() => handleShowRequest(transporter)}>
                            <FaEnvelope style={{ fontSize: '28px', color: 'green' }} />
                          </SwipeAction>
                        </div>
                        <div style={{ padding: '0 6px' }}>
                          <SwipeAction onClick={() => handleShowPhone(transporter)}>
                            <FaPhone style={{ fontSize: '28px', color: 'red' }} />
                          </SwipeAction>
                        </div>
                      </TrailingActions>
                    }
                  >
                    <div className="d-flex flex-column justify-content-between flex-grow-1" onClick={() => setSelectedTransport(transporter === selectedTransport ? null : transporter )}>
                      <h4 className="h4 fw-bold text-dark mb-2">{transporter.companyName}</h4>
                      <p className="small text-muted mb-0">{transporter.location}</p>
                    </div>
                  </SwipeableListItem>
                </SwipeableList>
                {!isSwiping && selectedTransport && selectedTransport._id === transporter._id && (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '18px', marginBottom: '-10px', fontSize: '16px', }}>
                    <img src={transporter.image || '/assets/admin.jpg'} alt={transporter.fullname} style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', marginRight: '16px', marginBottom: '10px' }}/>
                    <div className="mt-3 mb-3">
                      <p><strong>Người đại diện:</strong> {transporter.fullname}</p>
                      <p><strong>Email:</strong> {transporter.contactEmail}</p>
                      <p><strong>Số điện thoại:</strong> {transporter.contactPhone}</p>
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
        target={selectedTransport}
        targetLabel="Nhà Vận Chuyển"
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
        typeKey="typeProducer"
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onCancel={handleCancelRequest}
        onDelete={handleDeleteRequest}
      />
    </div>
  );
};

export default Transport;