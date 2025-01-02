import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../../services/driverService';

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverData, setDriverData] = useState({ name: '', sdt: '', GPLX: '', });
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
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!driverData.name || !driverData.sdt || !driverData.GPLX) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      if (isEdit) {
        await updateDriver(selectedDriver._id, driverData);
      } else {
        await createDriver(driverData);
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchDrivers();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài xế này?')) {
      try {
        await deleteDriver(id);
        setDrivers(prev => prev.filter(d => d._id !== id));
        setSuccess('Đã xóa tài xế thành công.');
        fetchDrivers();
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };
  
  const openModal = () => {
    setDriverData({ name: '', sdt: '', GPLX: '', });
    setIsEdit(false);
    setModalOpen(true);
  };
  
  const openEditModal = (driver) => {
    setDriverData(driver);
    setSelectedDriver(driver);
    setIsEdit(true);
    setModalOpen(true);
  };
  
  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Tài Xế</h2>
        <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
  
      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{textAlign: 'center', fontSize: '18px'}} >
            <th style={{padding: '12px', width:'10%'}}>STT</th>
            <th style={{padding: '12px', width:'30%'}}>Họ Và Tên</th>
            <th style={{padding: '12px', width:'20%'}}>Số Điện Thoại</th>
            <th style={{padding: '12px', width:'20%'}}>GPLX</th>
            <th style={{padding: '12px', width:'20%'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((driver, index) => (
              <tr key={driver._id}>
              <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
              <td style={{textAlign: 'center', padding: '15px'}}>{driver.name}</td>
              <td style={{textAlign: 'center', padding: '15px'}}>{driver.sdt}</td>
              <td style={{textAlign: 'center', padding: '15px'}}>{driver.GPLX}</td>
              <td className="text-center">
                <Button className="me-2" onClick={() => openEditModal(driver)}><FaEdit/></Button>
                <Button className="me-2" onClick={() => handleDelete(driver._id)}><FaTrash/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Tài Xế' : 'Thêm Tài Xế'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Tên Tài Xế</Form.Label>
              <Form.Control
                type="text"
                value={driverData.name}
                onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                value={driverData.sdt}
                onChange={(e) => setDriverData({ ...driverData, sdt: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>GPLX</Form.Label>
              <Form.Control
                type="text"
                value={driverData.GPLX}
                onChange={(e) => setDriverData({ ...driverData, GPLX: e.target.value })}
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
    
export default Driver;