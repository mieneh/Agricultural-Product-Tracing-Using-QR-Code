import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getHarvests } from '../../services/harvestService';
import { getInbounds, createInbound, updateInbound, deleteInbound } from '../../services/inboundService';

const Inbound = () => {
  const [inbounds, setInbounds] = useState([]);
  const [batches, setBatches] = useState([]);
  const [inboundData, setInboundData] = useState({ batchID: '', entryDate: '', storageCondition: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedInbound, setSelectedInbound] = useState(null);
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
    const refresh = async () => await fetchInbounds();
    window.refreshInbounds = refresh;
    fetchInbounds();
    fetchBatches();
  }, []);

  const fetchInbounds = async () => {
    try {
      const data = await getInbounds();
      setInbounds(data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchBatches = async () => {
    try {
      const data = await getHarvests();
      setBatches(data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inboundData.batchID || !inboundData.entryDate || !inboundData.storageCondition) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      if (isEdit) {
        await updateInbound(selectedInbound._id, inboundData);
      } else {
        await createInbound(inboundData);
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchInbounds();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục nhập này?')) {
      try {
        await deleteInbound(id);
        setInbounds(prev => prev.filter(i => i._id !== id));
        setSuccess('Đã xóa mục nhập thành công.');
        fetchInbounds();
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = async () => {
    await fetchBatches();
    setInboundData({ batchID: '', entryDate: '', storageCondition: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = async (inbound) => {
    await fetchBatches();
    setInboundData(inbound);
    setSelectedInbound(inbound);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Nhập Kho</h2>
        <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontSize: '18px' }} >
            <th style={{padding: '12px', width:'15%'}}>STT</th>
            <th style={{padding: '12px', width:'30%'}}>Lô Hàng</th>
            <th style={{padding: '12px', width:'15%'}}>Ngày Nhập</th>
            <th style={{padding: '12px', width:'15%'}}>Điều Kiện Bảo Quản</th>
            <th style={{padding: '12px', width:'15%'}}>Số Lượng Nhập Kho</th>
            <th style={{padding: '12px', width:'15%'}}>Số Lượng Tồn Kho</th>
            <th style={{padding: '12px', width:'15%'}}>Trạng thái</th>
            <th style={{padding: '12px', width:'25%'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inbounds
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((inbound, index) => (
              <tr key={inbound._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{inbound.batchID?.batch || 'N/A'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(inbound.entryDate).toLocaleDateString()}</td>
                <td style={{padding: '15px'}}>{inbound.storageCondition}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{inbound.quantity}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{inbound.remainingQuantity}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{inbound.status}</td>
                <td className="text-center">
                  <Button className="me-2" onClick={() => openEditModal(inbound)}><FaEdit/></Button>
                  <Button className="me-2" onClick={() => handleDelete(inbound._id)}><FaTrash/></Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Kho' : 'Nhập Kho'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Lô Hàng</Form.Label>
              <Form.Select
                value={inboundData.batchID}
                onChange={(e) => setInboundData({ ...inboundData, batchID: e.target.value })}
                required
              >
                <option value="">Chọn Lô Hàng</option>
                  {batches
                  .filter((harvest) => !inbounds.some((inb) => inb.batchID?._id === harvest._id))
                  .map((harvest) => (
                    <option key={harvest._id} value={harvest._id}>
                      {harvest.batch}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Ngày Nhập</Form.Label>
              <Form.Control
                type="date"
                value={inboundData.entryDate}
                onChange={(e) => setInboundData({ ...inboundData, entryDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Điều Kiện Bảo Quản</Form.Label>
              <Form.Control
                type="text"
                value={inboundData.storageCondition}
                onChange={(e) =>
                  setInboundData({ ...inboundData, storageCondition: e.target.value })
                }
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

export default Inbound;