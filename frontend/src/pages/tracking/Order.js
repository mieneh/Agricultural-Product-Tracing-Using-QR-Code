import { useState, useEffect } from 'react';
import { Card, Row, Col, Modal } from 'react-bootstrap';
import { useAuth } from "../../hooks/useAuth";
import { getOrders } from '../../services/harvestService'
import TemperatureHumidityChart from './components/ChartTemperatureHumidityLight';
import TemperatureMapChart from './components/ChartMap';

const Order = () => {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    
    const getStatusDescription = (status) => {
        switch (status) {
          case 'Pending':
            return 'Đang chờ vận chuyển';
          case 'Processing':
            return 'Đang vận chuyển';
          case 'Completed':
            return 'Đã giao hàng thành công';
          default:
            return 'Đơn hàng chưa có lên đơn';
        }
    };

    return (
        <div style={{ padding: '15px 2px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-success mb-0">Theo Dõi Lô Hàng</h2>
            </div>
            <div className="mb-4">
                {orders.length === 0 ? (
                    <p className="text-muted text-center">Chưa có yêu cầu đã nhận.</p>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id} className="mb-2 shadow-sm" onClick={() => handleClick(order)}>
                            <Row className="g-0">
                                <Col md={3} className="d-flex align-items-center justify-content-center">
                                    <img src={order.product?.image || "/assets/admin.jpg"}
                                        alt={order.product?.name || "Hình ảnh mặt hàng"}
                                        className="img-fluid rounded" 
                                        style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }}
                                    />
                                </Col>
                                <Col md={9}>
                                    <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                                        <div style={{ marginTop: '10px' }}>
                                            <h5>Lô Hàng: {order?.batch}</h5>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {user.role === 'Producer' ? (
                                            <>
                                                <p><strong>Nhà phân phối:</strong> {order.distributorID?.companyName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.distributorID?.location}</p>
                                                <p><strong>Nhà vận chuyển:</strong> {order.transporterID?.companyName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.transporterID?.location}</p>
                                                <p><strong>Tình trạng đơn hàng:</strong> 
                                                    <span className={`ms-2 badge ${ order.routeStatus === 'Pending' ? 'bg-info' : order.routeStatus === 'Processing' ? 'bg-danger' : order.routeStatus === 'Completed' ? 'bg-success' : 'bg-secondary' }`} style={{ fontSize: '0.9rem', padding: '6px 10px', color: 'white' }}>
                                                        {getStatusDescription(order.routeStatus)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : user.role === 'Transport' ? (
                                            <>
                                                <p><strong>Nhà phân phối:</strong> {order.distributorID?.companyName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.distributorID?.location}</p>
                                                <p><strong>Nhà sản xuất:</strong> {order.userID?.farmName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.userID?.farmLocation}</p>
                                                <p><strong>Tình trạng đơn hàng:</strong> 
                                                    <span className={`ms-2 badge ${ order.routeStatus === 'Pending' ? 'bg-info' : order.routeStatus === 'Processing' ? 'bg-danger' : order.routeStatus === 'Completed' ? 'bg-success' : 'bg-secondary' }`} style={{ fontSize: '0.9rem', padding: '6px 10px', color: 'white' }}>
                                                        {getStatusDescription(order.routeStatus)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>Nhà sản xuất:</strong> {order.userID?.farmName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.userID?.farmLocation}</p>
                                                <p><strong>Nhà vận chuyển:</strong> {order.transporterID?.companyName}</p>
                                                <p><strong>Địa chỉ:</strong> {order.transporterID?.location}</p>
                                                <p><strong>Tình trạng đơn hàng:</strong> 
                                                    <span className={`ms-2 badge ${ order.routeStatus === 'Pending' ? 'bg-info' : order.routeStatus === 'Processing' ? 'bg-danger' : order.routeStatus === 'Completed' ? 'bg-success' : 'bg-secondary' }`} style={{ fontSize: '0.9rem', padding: '6px 10px', color: 'white' }}>
                                                        {getStatusDescription(order.routeStatus)}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}
            </div>

            <Modal show={showModal} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Theo dõi đơn hàng</Modal.Title>
                </Modal.Header>
                <div className="px-4">
                    {selectedOrder && selectedOrder.sensors && selectedOrder.sensors.length > 0 ? (
                        <>
                            <TemperatureHumidityChart data={selectedOrder.sensors} /> 
                            <TemperatureMapChart data={selectedOrder.sensors} />
                        </>
                    ) : (
                        <p className="mt-3 p-2 text-muted text-center">Không có dữ liệu cảm biến nào có sẵn.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Order;