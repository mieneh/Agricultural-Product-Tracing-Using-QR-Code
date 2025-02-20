import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getRetailers, createRetailer, updateRetailer, deleteRetailer } from '../../services/retailerService';

const Retailer = () => {
  const [retailers, setRetailers] = useState([]);
  const [retailerData, setRetailerData] = useState({ type: 'Siêu thị', fullname: '', address: '', phone: '', email: '', });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
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
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    try {
      const data = await getRetailers();
      setRetailers(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!retailerData.type || !retailerData.fullname || !retailerData.address) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (!retailerData.phone || !/^\d{10,12}$/.test(retailerData.phone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập từ 10-12 chữ số.');
      return;
    }
    if (retailerData.email && !/^\S+@\S+\.\S+$/.test(retailerData.email)) {
      setError('Email không hợp lệ.');
      return;
    }
    try {
      if (isEdit) {
        await updateRetailer(selectedRetailer._id, retailerData);
      } else {
        await createRetailer(retailerData);
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchRetailers();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà bán lẻ này?')) {
      try {
        await deleteRetailer(id);
        setRetailers(prev => prev.filter(r => r._id !== id));
        setSuccess('Đã xóa nhà bán lẻ thành công.');
        fetchRetailers();
      } catch (err) {
        alert(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setRetailerData({ type: 'Siêu thị', fullname: '', address: '', phone: '', email: '', });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (retailer) => {
    setRetailerData(retailer);
    setSelectedRetailer(retailer);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Nhà Bán Lẻ</h2>
        <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontSize: '18px'}} >
            <th style={{padding: '12px', width:'5%'}}>STT</th>
            <th style={{padding: '12px', width:'20%'}}>Họ Và Tên</th>
            <th style={{padding: '12px', width:'10%'}}>Đối Tác</th>
            <th style={{padding: '12px', width:'25%'}}>Địa Chỉ</th>
            <th style={{padding: '12px', width:'10%'}}>Số Điện Thoại</th>
            <th style={{padding: '12px', width:'15%'}}>Email</th>
            <th style={{padding: '12px', width:'15%'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(retailers) || retailers.length === 0) ? (
            <tr>
              <td colSpan="7" className="text-center text-muted p-3">Không có thông tin nhà bán lẻ nào!</td>
            </tr>
          ) : (
          retailers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((retailer, index) => (
              <tr key={retailer._id}>
                <td style={{ textAlign: 'center', padding: '15px' }}>{index + 1}</td>
                <td style={{ padding: '15px' }}>{retailer.fullname}</td>
                <td style={{ padding: '15px' }}>{retailer.type}</td>
                <td style={{ padding: '15px' }}>{retailer.address}</td>
                <td style={{ padding: '15px' }}>{retailer.phone || 'N/A'}</td>
                <td style={{ padding: '15px' }}>{retailer.email || 'N/A'}</td>
                <td className="text-center">
                  <Button className="me-2" onClick={() => openEditModal(retailer)}><FaEdit /></Button>
                  <Button className="me-2" onClick={() => handleDelete(retailer._id)}><FaTrash /></Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Nhà Bán Lẻ' : 'Thêm Nhà Bán Lẻ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Đối Tác Kinh Doanh</Form.Label>
              <Form.Select
                value={retailerData.type}
                onChange={(e) => setRetailerData({ ...retailerData, type: e.target.value }) }
                required
              >
                <option value="Siêu thị">Siêu thị</option>
                <option value="Cửa hàng tiện lợi">Cửa hàng tiện lợi</option>
                <option value="Tạp hóa">Tạp hóa</option>
                <option value="Khách vãng lai">Khách vãng lai</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Hạ Và Tên</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.fullname}
                onChange={(e) => setRetailerData({ ...retailerData, fullname: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.address}
                onChange={(e) => setRetailerData({ ...retailerData, address: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.phone}
                onChange={(e) => setRetailerData({ ...retailerData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={retailerData.email}
                onChange={(e) => setRetailerData({ ...retailerData, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100 mt-1 p-2" variant="contained" onClick={handleSubmit}>
            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }}/>}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Retailer;