import { useState, useEffect } from "react";
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from "react-bootstrap";
import { getInbounds } from '../../services/inboundService';
import { getRetailers } from '../../services/retailerService';
import { getOutbounds, createOutbound, updateOutbound, deleteOutbound } from '../../services/outboundService';

const Outbound = () => {
    const [outbounds, setOutbounds] = useState([]);
    const [inbounds, setInbounds] = useState([]);
    const [retailers, setRetailers] = useState([]);
    const [outboundData, setOutboundData] = useState({ exitDate: '', entryID: '', quantity: '', note: '', retailerID: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [error, success]);

    useEffect(() => {
        fetchOutbounds();
        fetchInbounds();
        fetchRetailers();
    }, []);

    const fetchOutbounds = async () => {
        try {
            const data = await getOutbounds();
            setOutbounds(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchInbounds = async () => {
        try {
            const data = await getInbounds();
            setInbounds(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

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
        if (!outboundData.exitDate || !outboundData.entryID || !outboundData.quantity || !outboundData.retailerID) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        try {
            if (isEdit) {
                await updateOutbound(selectedOutbound._id, outboundData);
            } else {
                await createOutbound(outboundData);
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchOutbounds();
            fetchInbounds();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục xuất này?')) {
            try {
                await deleteOutbound(id);
                setOutbounds(prev => prev.filter(i => i._id !== id));
                setSuccess('Đã xóa mục xuất thành công.');
                fetchOutbounds();
              } catch (err) {
                alert(err.response ? err.response.data.message : err.message);
            }
        }
            
    };

    const openModal = async () => {
        await fetchInbounds();
        await fetchRetailers();
        setOutboundData({ exitDate: new Date().toISOString().split('T')[0], entryID: '', quantity: '', note: '', retailerID: '' });
        setIsEdit(false);
        setModalOpen(true);
    };
    
    const openEditModal = async (outbound) => {
        await fetchInbounds();
        await fetchRetailers();
        setOutboundData({
            exitDate: outbound.exitDate ? outbound.exitDate.split('T')[0] : '',
            entryID: outbound.entryID?._id || '',
            quantity: outbound.quantity || '',
            note: outbound.note || '',
            retailerID: outbound.retailerID?._id || ''
        });
        setSelectedOutbound(outbound);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div style={{ padding: '15px 2px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-success mb-0">Quản Lý Xuất Kho</h2>
                <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>

            {success && <Alert variant="success">{success}</Alert>}

            <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                        <th style={{padding: '12px', width:'5%'}}>STT</th>
                        <th style={{padding: '12px', width:'10%'}}>Ngày Xuất</th>
                        <th style={{padding: '12px', width:'20%'}}>Sản Phẩm</th>
                        <th style={{padding: '12px', width:'20%'}}>Nhà Bán Lẻ</th>
                        <th style={{padding: '12px', width:'15%'}}>Số Lượng</th>
                        <th style={{padding: '12px', width:'20%'}}>Ghi chú</th>
                        <th style={{padding: '12px', width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(!Array.isArray(outbounds) || outbounds.length === 0) ? (
                        <tr>
                            <td colSpan="7" className="text-center text-muted p-3">Không có thông tin xuất kho nào!</td>
                        </tr>
                    ) : (
                    outbounds
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((outbound, index) => (
                            <tr key={outbound._id}>
                                <td style={{ textAlign: 'center', padding: '15px' }}>{index + 1}</td>
                                <td style={{ textAlign: 'center', padding: '15px' }}>{new Date(outbound.exitDate).toLocaleDateString()}</td>
                                <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.entryID.batchID.product.name || 'N/A'}</td>
                                <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.retailerID.fullname || 'N/A'}</td>
                                <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.quantity || 'N/A'} kg</td>
                                <td style={{ padding: '15px' }}>{outbound.note}</td>
                                <td className="text-center">
                                    <Button className="me-2" onClick={() => openEditModal(outbound)}><FaEdit/></Button>
                                    <Button className="me-2" onClick={() => handleDelete(outbound._id)}><FaTrash/></Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "Chỉnh Sửa Xuất Kho" : "Xuất Kho"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="form-group">
                            <Form.Label>Ngày Xuất Kho</Form.Label>
                            <Form.Control
                                type="date"
                                value={outboundData.exitDate}
                                onChange={(e) => setOutboundData({ ...outboundData, exitDate: e.target.value })}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Sản Phẩm</Form.Label>
                            <Form.Select
                                value={outboundData.entryID}
                                onChange={(e) => setOutboundData({ ...outboundData, entryID: e.target.value })}
                                required
                            >
                                <option value="">Lựa chọn...</option>
                                {inbounds.map((inbound) => (
                                <option key={inbound._id} value={inbound._id}>
                                    {inbound.batchID.batch}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Nhà Bán Lẻ</Form.Label>
                            <Form.Select
                                value={outboundData.retailerID}
                                onChange={(e) => setOutboundData({ ...outboundData, retailerID: e.target.value })}
                                required
                            >
                                <option value="">Lựa chọn...</option>
                                {retailers.map((retailer) => (
                                <option key={retailer._id} value={retailer._id}>
                                    {retailer.fullname}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Số Lượng</Form.Label>
                            <Form.Control
                                type="number"
                                value={outboundData.quantity}
                                onChange={(e) => setOutboundData({ ...outboundData, quantity: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Ghi Chú</Form.Label>
                            <Form.Control
                                type="text"
                                value={outboundData.note}
                                onChange={(e) => setOutboundData({ ...outboundData, note: e.target.value })}
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

export default Outbound;