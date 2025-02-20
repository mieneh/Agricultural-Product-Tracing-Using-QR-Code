import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getVehicles } from '../../services/vehicleService';
import { getDrivers } from '../../services/driverService';
import { getHarvests } from '../../services/harvestService';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../../services/routeService';

const Route = () => {
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [batches, setBatches] = useState([]);
    const [routeData, setRouteData] = useState({ vehicleID: '', driverID: '', batchID: '', origin: '', destination: '', departureTime: '', estimatedArrival: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [error, success]);

    useEffect(() => {
        fetchRoutes();
        fetchVehicles();
        fetchDrivers();
        fetchBatches();
    }, []);

    useEffect(() => {
        if (routeData.batchID) {
          const selectedHarvest = batches.find((h) => h._id === routeData.batchID);
          if (selectedHarvest) {
            setRouteData({
              ...routeData,
              origin: selectedHarvest.userID.farmLocation || '',
              destination: selectedHarvest.distributorID.location || '',
            });
          }
        }
    }, [routeData.batchID, batches, routeData]);
      
    const fetchRoutes = async () => {
        try {
            const data = await getRoutes();
            setRoutes(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchDrivers = async () => {
        try {
            const data = await getDrivers();
            setDrivers(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchBatches = async () => {
        try {
            const data = await getHarvests();
            setBatches(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!routeData.vehicleID || !routeData.driverID || !routeData.batchID || !routeData.origin || !routeData.destination || !routeData.departureTime || !routeData.estimatedArrival) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        try {
            if (isEdit) {
                await updateRoute(selectedRoute._id, routeData);
            } else {
                await createRoute(routeData);
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchRoutes();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lộ trình này?')) {
            try {
                await deleteRoute(id);
                setRoutes(prev => prev.filter(r => r._id !== id));
                setSuccess('Đã xóa lộ trình thành công.');
                fetchRoutes();
            } catch (err) {
                alert(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const openModal  = async () => {
        await fetchVehicles();
        await fetchDrivers();
        await fetchBatches();
        setRouteData({ vehicleID: '', driverID: '', batchID: '', origin: '', destination: '', departureTime: '', estimatedArrival: '' });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = async (route) => {
        await fetchVehicles();
        await fetchDrivers();
        await fetchBatches();
        setRouteData({
            vehicleID: route.vehicleID?._id || '',
            driverID: route.driverID?._id || '',
            batchID: route.batchID?._id || '',
            origin: route.origin || '',
            destination: route.destination || '',
            departureTime: route.departureTime ? route.departureTime.slice(0, 16) : '',
            estimatedArrival: route.estimatedArrival ? route.estimatedArrival.slice(0, 16) : '',
        });
        setSelectedRoute(route);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div style={{ padding: '15px 2px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-success mb-0">Quản Lý Lộ Trình</h2>
                <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            
            <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                        <th style={{padding: '12px', width:'2%'}}>STT</th>
                        <th style={{padding: '12px', width:'10%'}}>Phương Tiện</th>
                        <th style={{padding: '12px', width:'10%'}}>Tài Xế</th>
                        <th style={{padding: '12px', width:'10%'}}>Lô Hàng</th>
                        <th style={{padding: '12px', width:'14%'}}>Xuất Phát</th>
                        <th style={{padding: '12px', width:'14%'}}>Đích Đến</th>
                        <th style={{padding: '12px', width:'10%'}}>Khởi Hành</th>
                        <th style={{padding: '12px', width:'10%'}}>Dự Kiến Đến</th>
                        <th style={{padding: '12px', width:'10%'}}>Trạng Thái</th>
                        <th style={{padding: '12px', width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(!Array.isArray(routes) || routes.length === 0) ? (
                        <tr>
                            <td colSpan="10" className="text-center text-muted p-3">Không có thông tin lộ trình nào!</td>
                        </tr>
                    ) : (
                    routes
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((route, index) => {
                            const statusLabel = route.status === 'Pending' ? 'Đang chờ vận chuyển' : route.status === 'Processing' ? 'Đang vận chuyển' : route.status === 'Completed' ? 'Đã giao hàng thành công' : 'Đơn hàng chưa có lên đơn';
                            return (
                                <tr key={route._id}>
                                    <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                                    <td style={{ padding: '15px'}}>{route.vehicleID?.type}</td>
                                    <td style={{ padding: '15px'}}>{route.driverID?.name}</td>
                                    <td style={{ padding: '15px'}}>{route.batchID?.batch}</td>
                                    <td style={{ padding: '15px'}}>{route.origin}</td>
                                    <td style={{ padding: '15px'}}>{route.destination}</td>
                                    <td style={{ padding: '15px'}}>{new Date(route.departureTime).toLocaleString()}</td>
                                    <td style={{ padding: '15px'}}>{new Date(route.estimatedArrival).toLocaleString()}</td>
                                    <td style={{ padding: '15px'}}>
                                        <span className={`badge ${ route.status === 'Pending' ? 'bg-info' : route.status === 'Processing' ? 'bg-danger' : route.status === 'Completed' ? 'bg-success' :  'bg-secondary' }`} 
                                            style={{ fontSize: '0.9rem', padding: '6px 10px', color: 'white'}}
                                        >
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Button className="me-2" onClick={() => openEditModal(route)}><FaEdit/></Button>
                                        <Button className="me-2" onClick={() => handleDelete(route._id)}><FaTrash/></Button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </Table>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Chỉnh Sửa Lộ Trình' : 'Thêm Lộ Trình'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="form-group">
                            <Form.Label>Phương Tiện</Form.Label>
                            <Form.Select
                                value={routeData.vehicleID}
                                onChange={(e) => setRouteData({ ...routeData, vehicleID: e.target.value })}
                                required
                            >
                                <option value="">Chọn Phương Tiện</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle._id} value={vehicle._id}>
                                        {vehicle.type} - {vehicle.plateNumber}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Tài Xế</Form.Label>
                            <Form.Select
                                value={routeData.driverID}
                                onChange={(e) => setRouteData({ ...routeData, driverID: e.target.value })}
                                required
                            >
                                <option value="">Chọn Tài Xế</option>
                                {drivers.map((driver) => (
                                    <option key={driver._id} value={driver._id}>
                                        {driver.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {!isEdit && (
                            <Form.Group className="form-group">
                                <Form.Label>Lô Hàng</Form.Label>
                                <Form.Select
                                value={routeData.batchID}
                                onChange={(e) => setRouteData({ ...routeData, batchID: e.target.value })}
                                required
                                >
                                <option value="">Chọn Lô Hàng</option>
                                {batches.map((harvest) => (
                                    <option key={harvest._id} value={harvest._id}>
                                    {harvest.batch}
                                    </option>
                                ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Form.Group className="form-group">
                            <Form.Label>Xuất Phát</Form.Label>
                            <Form.Control type="text" value={routeData.origin} readOnly />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Đích Đến</Form.Label>
                            <Form.Control type="text" value={routeData.destination} readOnly />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Thời Gian Khởi Hành</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={routeData.departureTime}
                                onChange={(e) => setRouteData({ ...routeData, departureTime: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Dự Kiến Đến</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={routeData.estimatedArrival}
                                onChange={(e) => setRouteData({ ...routeData, estimatedArrival: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-100 mt-1 p-2" variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
                        {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }}/>}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Route;