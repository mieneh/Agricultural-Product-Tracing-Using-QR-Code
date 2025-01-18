import { useState } from 'react';
import { Modal, Button, Tab, Nav, Row, Col, Card } from 'react-bootstrap';
import { FaCheck, FaTimes, FaTruck } from 'react-icons/fa';
import { acceptRequest, rejectRequest, cancelRequest } from '../../../services/requestService';

const RequestListModal = ({ show, onHide, requests, userRole, onShowTransport, setRequests }) => {
  const [activeTabList, setActiveTabList] = useState('Unprocessed');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);     
      alert('Yêu cầu đã được chấp nhận.');
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'Accepted' } : r));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id, 'Yêu cầu bị từ chối bởi Nhà sản xuất.');
      alert('Yêu cầu đã bị từ chối.');
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'Rejected' , message: 'Yêu cầu đã bị từ chối bởi Nhà sản xuất.' } : r));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id, 'Yêu cầu đã bị hủy bởi Nhà phân phối.');
      alert('Yêu cầu đã bị hủy thành công!');
      setRequests(requests.map(r => r._id === id ? { ...r, status: 'Rejected' , message: 'Yêu cầu đã bị hủy bởi Nhà phân phối.'} : r));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Danh Sách</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Tab.Container id="requests-tabs" activeKey={activeTabList} onSelect={(k) => setActiveTabList(k)}>
          <Row>
            <Col sm={12}>
              <Nav variant="pills" className="nav-tab flex-row justify-content-center mb-2">
                {userRole === 'Producer' ? (
                  <>
                    <Nav.Item>
                      <Nav.Link eventKey="Unprocessed">Chưa xử lý</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Processed">Đã xử lý</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Cancel">Đã hủy</Nav.Link>
                    </Nav.Item>
                  </>
                ) : (
                  <>
                    <Nav.Item>
                      <Nav.Link eventKey="Unprocessed">Yêu cầu</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Processed">Đơn hàng</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Cancel">Đã hủy</Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Col>
          </Row>
          <Tab.Content style={{ boxShadow: 'none', padding: '0px' }}>
            <Tab.Pane eventKey="Unprocessed">
              {requests.filter((r) => r.status === 'Pending').length === 0 ? (
                <p className="mt-3 p-2 text-muted text-center">Không có yêu cầu nào.</p>
              ) : (
                requests
                  .filter((r) => r.status === 'Pending')
                  .map((request) => (
                    <Card key={request._id} className="mb-2 shadow-sm">
                      <Row className="g-0">
                        <Col md={3} className="d-flex align-items-center justify-content-center">
                          <img
                            src={request.harvestID?.product.image ? request.harvestID.product.image : "/assets/admin.jpg"}
                            alt={request.harvestID?.product.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }}
                          />
                        </Col>
                        <Col md={9}>
                          <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                            <div style={{ marginTop: '10px' }}>
                              <h5>Lô Hàng: {request.harvestID?.batch}</h5> 
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {userRole === 'Producer' ? (
                              <>
                                <p><strong>Nhà phân phối:</strong> {request.distributorID?.companyName}</p>
                                <p><strong>Địa chỉ:</strong> {request.distributorID?.location}</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Nhà sản xuất:</strong> {request.harvestID?.userID?.farmName}</p>
                                <p><strong>Địa chỉ:</strong> {request.harvestID?.userID?.farmLocation}</p>
                              </>
                            )}
                            {userRole === 'Producer' ? (
                              <div className="d-flex">
                                <Button className="w-100 p-2" onClick={() => handleAccept(request._id)}><FaCheck /></Button>
                                <Button className="w-100 p-2" onClick={() => handleReject(request._id)}>
                                  <FaTimes />
                                </Button>
                              </div>
                            ) : (
                              <Button className="w-100 p-2" onClick={() => handleCancel(request._id)}><FaTimes /></Button>
                            )}
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="Processed">
              {requests.filter((r) => r.status === 'Accepted').length === 0 ? (
                <p className="mt-3 p-2 text-muted text-center">Không có yêu cầu đã nhận.</p>
              ) : (
                requests
                  .filter((r) => r.status === 'Accepted')
                  .map((request) => (
                    <Card key={request._id} className="mb-2 shadow-sm">
                      <Row className="g-0">
                        <Col md={3} className="d-flex align-items-center justify-content-center">
                          <img
                            src={request.harvestID?.product.image ? request.harvestID.product.image : "/assets/admin.jpg"}
                            alt={request.harvestID?.product.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }}
                          />
                        </Col>
                        <Col md={9}>
                          <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                            <div style={{ marginTop: '10px' }}>
                              <h5>Lô Hàng: {request.harvestID?.batch}</h5> 
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {userRole === 'Producer' ? (
                              <>
                                <p><strong>Nhà phân phối:</strong> {request.distributorID?.companyName}</p>
                                <p><strong>Địa chỉ:</strong> {request.distributorID?.location}</p>
                                {request.harvestID?.transporterID ? (
                                  <>
                                    <p><strong>Nhà Vận Chuyển:</strong> {request.harvestID.transporterID?.companyName}</p>
                                    <p><strong>Địa Chỉ: </strong> {request.harvestID.transporterID?.location}</p>
                                  </>
                                ) : (
                                  <Button className="w-100 p-2" onClick={() => onShowTransport(request._id)}><FaTruck /></Button>
                                )}
                              </>
                            ) : (
                              <>
                                <p><strong>Nhà sản xuất:</strong> {request.harvestID?.userID?.farmName}</p>
                                <p><strong>Địa chỉ:</strong> {request.harvestID?.userID?.farmLocation}</p>
                                {request.harvestID?.transporterID && (
                                  <>
                                    <p><strong>Nhà vận chuyển:</strong> {request.harvestID.transporterID?.companyName || "Chưa có thông tin"}</p>
                                    <p><strong>Địa chỉ:</strong> {request.harvestID.transporterID?.location || "Chưa có thông tin"}</p>
                                  </>
                                )}
                              </>
                            )}
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="Cancel">
              {requests.filter((r) => r.status === 'Rejected').length === 0 ? (
                <p className="mt-3 p-2 text-muted text-center">Không có yêu cầu bị hủy.</p>
              ) : (
                requests
                .filter((r) => r.status === 'Rejected')
                .map((request) => (
                  <Card key={request._id} className="mb-3 shadow-sm">
                    <Row className="g-0">
                      <Col md={3} className="d-flex align-items-center justify-content-center">
                        <img
                            src={request.harvestID?.product.image ? request.harvestID.product.image : "/assets/admin.jpg"}
                            alt={request.harvestID?.product.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }}
                          />
                        </Col>
                        <Col md={9}>
                          <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                            <div style={{ marginTop: '10px' }}>
                              <h5>Lô Hàng: {request.harvestID?.batch}</h5> 
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {userRole === 'Producer' ? (
                              <>
                                <p><strong>Nhà Phân Phối:</strong> {request.distributorID?.companyName}</p>
                                <p><strong>Địa Chỉ: </strong> {request.distributorID?.location}</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Nhà Sản Xuất:</strong> {request.harvestID.userID?.farmName}</p>
                                <p><strong>Địa Chỉ:</strong> {request.harvestID.userID?.farmLocation}</p>
                              </>
                            )}
                            <p style={{ fontStyle: 'italic', color: '#888' }}>
                              <strong>Cập nhật:</strong> {formatDate(request.updatedAt) || 'Không có cập nhật mới'}
                            </p>
                          </Card.Body> 
                            <div style={{ position: 'absolute', top: '-10px', right: '5px' }}>
                              <span className="badge bg-danger">{request.message}</span>
                            </div>
                        </Col>
                      </Row>
                    </Card>
                  ))
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default RequestListModal;