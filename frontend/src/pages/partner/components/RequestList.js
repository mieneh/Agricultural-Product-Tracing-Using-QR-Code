import { Modal, Nav, Tab, Row, Col } from "react-bootstrap";
import Connection from './Connection';

const RequestList = ({ show, onHide, activeTab, setActiveTab, connections, typeKey, onAccept, onReject, onCancel, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Danh Sách</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <Tab.Container id="requests-tabs" activeKey={activeTab} onSelect={setActiveTab}>
                    <Row>
                        <Col sm={12}>
                            <Nav variant="pills" className="nav-tab flex-row justify-content-center mb-2">
                                <Nav.Item>
                                    <Nav.Link eventKey="Sent">Đã Gửi</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Received">Đã Nhận</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Accepted">Đối Tác</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <Tab.Content style={{ boxShadow: "none", padding: 0 }}>
                                <Tab.Pane eventKey="Sent">
                                    {connections.filter(c => c.status === "Pending" && c[typeKey] === "Sent").length === 0 ? (
                                        <p className="mt-3 p-2 text-muted text-center">Chưa có yêu cầu đã gửi.</p>
                                    ) : (
                                        connections
                                        .filter(c => c.status === "Pending" && c[typeKey] === "Sent")
                                        .map(c => (
                                            <Connection
                                                key={c._id}
                                                connection={c}
                                                onCancel={() => onCancel?.(c._id)}
                                            />
                                        ))
                                    )}
                                </Tab.Pane>
                                <Tab.Pane eventKey="Received">
                                    {connections.filter(c => c.status === "Pending" && c[typeKey] === "Received").length === 0 ? (
                                        <p className="mt-3 p-2 text-muted text-center">Chưa có yêu cầu đã nhận.</p>
                                    ) : (
                                        connections
                                        .filter(c => c.status === "Pending" && c[typeKey] === "Received")
                                        .map(c => (
                                            <Connection
                                                key={c._id}
                                                connection={c}
                                                onAccept={() => onAccept?.(c._id)}
                                                onReject={() => onReject?.(c._id)}
                                            />
                                        ))
                                    )}
                                </Tab.Pane>
                                <Tab.Pane eventKey="Accepted">
                                    {connections.filter(c => c.status === "Accepted").length === 0 ? (
                                        <p className="mt-3 p-2 text-muted text-center">Chưa có đối tác nào.</p>
                                    ) : (
                                        connections
                                        .filter(c => c.status === "Accepted")
                                        .map(c => (
                                            <Connection
                                                key={c._id}
                                                connection={c}
                                                onDelete={() => onDelete?.(c._id)}
                                            />
                                        ))
                                    )}
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    );
};

export default RequestList;