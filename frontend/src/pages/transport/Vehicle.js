import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleData, setVehicleData] = useState({ type: '', plateNumber: '', capacity: '', maintenanceStatus: '', });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
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
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!vehicleData.type || !vehicleData.plateNumber || !vehicleData.capacity || !vehicleData.maintenanceStatus) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
        if (isEdit) {
          await updateVehicle(selectedVehicle._id, vehicleData);
        } else {
          await createVehicle(vehicleData);
        }
        setModalOpen(false);
        setSuccess('Lưu thông tin thành công!');
        fetchVehicles();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      try {
        await deleteVehicle(id);
        setVehicles(prev => prev.filter(v => v._id !== id));
        setSuccess('Đã xóa phương tiện thành công.');
        fetchVehicles();
      } catch (err) {
        alert(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setVehicleData({ type: '', plateNumber: '', capacity: '', maintenanceStatus: '', });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setVehicleData(vehicle);
    setSelectedVehicle(vehicle);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Phương Tiện</h2>
        <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontSize: '18px' }} >
            <th style={{padding: '12px', width:'10%'}}>STT</th>
            <th style={{padding: '12px', width:'25%'}}>Loại Phương Tiện</th>
            <th style={{padding: '12px', width:'15%'}}>Biển Số</th>
            <th style={{padding: '12px', width:'15%'}}>Sức Chứa</th>
            <th style={{padding: '12px', width:'15%'}}>Trạng Thái Bảo Trì</th>
            <th style={{padding: '12px', width:'20%'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(vehicles) || vehicles.length === 0) ? (
            <tr>
              <td colSpan="6" className="text-center text-muted p-3">Không có thông tin phương tiện nào!</td>
            </tr>
          ) : (
          vehicles
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))        
            .map((vehicle, index) => (
              <tr key={vehicle._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.type}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.plateNumber}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.capacity} kg</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.maintenanceStatus}</td>
                <td className="text-center">
                  <Button className="me-2" onClick={() => openEditModal(vehicle)}><FaEdit/></Button>
                  <Button className="me-2" onClick={() => handleDelete(vehicle._id)}><FaTrash/></Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Phương Tiện' : 'Thêm Phương Tiện'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Loại Phương Tiện</Form.Label>
              <Form.Select
                value={vehicleData.type}
                onChange={(e) => setVehicleData({ ...vehicleData, type: e.target.value })}
                required
              >
                <option value="">Chọn loại phương tiện</option>
                <option value="Xe tải nhỏ">Xe tải nhỏ</option>
                <option value="Xe tải lớn">Xe tải lớn</option>
                <option value="Xe container">Xe container</option>
                <option value="Xe bồn">Xe bồn</option>
                <option value="Xe đông lạnh">Xe đông lạnh</option>
                <option value="Xe bán tải">Xe bán tải</option>
                <option value="Xe ba gác">Xe ba gác</option>
                <option value="Xe máy giao hàng">Xe máy giao hàng</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Biển Số</Form.Label>
              <Form.Control
                type="text"
                value={vehicleData.plateNumber}
                onChange={(e) => setVehicleData({ ...vehicleData, plateNumber: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Sức Chứa (kg)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={vehicleData.capacity}
                onChange={(e) => setVehicleData({ ...vehicleData, capacity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Trạng Thái Bảo Trì</Form.Label>
              <Form.Check
                type="radio"
                label="Có"
                name="maintenanceStatus"
                value="Có"
                checked={vehicleData.maintenanceStatus === 'Có'}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, maintenanceStatus: e.target.value })
                }
              />
              <Form.Check
                type="radio"
                label="Không"
                name="maintenanceStatus"
                value="Không"
                checked={vehicleData.maintenanceStatus === 'Không'}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, maintenanceStatus: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100 mt-1 p-2" variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }} />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vehicle;