import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getProcesses, createProcess, updateProcess, deleteProcess } from '../../services/processService';

const Process = () => {
    const [processes, setProcesses] = useState([]);
    const [processData, setProcessData] = useState({ name: '', steps: [{ name: '', content: '' }], });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
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
        fetchProcesses();
    }, []);
    
    const fetchProcesses = async () => {
        try {
            const data = await getProcesses();
            setProcesses(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!processData.name || processData.steps.some(step => !step.name.trim() || !step.content.trim())) {
            setError('Tên và tất cả các bước là bắt buộc.');
            return;            
        }
        try {
            if (isEdit) {
                await updateProcess(selectedProcess._id, processData);
            } else {
                await createProcess(processData);
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchProcesses();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này không?')) {
            try {
                await deleteProcess(id);
                setProcesses(prev => prev.filter(p => p._id !== id));
                setSuccess('Đã xóa một quy trình thành công.');
                fetchProcesses();
            } catch (err) {
                alert(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const openModal = () => {
        setProcessData({ name: '', steps: [{ name: '', content: '' }] });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (process) => {
        setProcessData(process);
        setSelectedProcess(process);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div style={{ padding: '15px 2px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-success mb-0">Quản Lý Quy Trình Sản Xuất</h2>
                <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>

            {success && <Alert variant="success">{success}</Alert>}

            <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                        <th style={{padding: '12px', width:'5%'}}>STT</th>
                        <th style={{padding: '12px', width:'15%'}}>Tên quy trình</th>
                        <th style={{padding: '12px'}}>Quy trình</th>
                        <th style={{padding: '12px', width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(!Array.isArray(processes) || processes.length === 0) ? (
                        <tr>
                            <td colSpan="4" className="text-center text-muted p-3">Không có thông tin quy trình sản xuất nào!</td>
                        </tr>
                    ) : (
                    processes
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((process, index) => (
                            <tr key={process._id}>
                                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                                <td style={{padding: '15px'}}>{process.name}</td>
                                <td>
                                    <ul style={{ listStyleType: 'square', paddingLeft: '20px', margin: '0' }}>
                                        {process.steps.map((step, index) => (
                                        <li key={index} style={{ padding: '8px 0px'}}>
                                            <strong>{step.name}: </strong> {step.content}
                                        </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="text-center">
                                    <Button className="me-2" onClick={() => openEditModal(process)}><FaEdit/></Button>
                                    <Button className="me-2" onClick={() => handleDelete(process._id)}><FaTrash/></Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Chỉnh Sửa Quy Trình' : 'Thêm Mới Quy Trình'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group controlId="formName" className="form-group">
                                <Form.Label>Tên quy trình</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={processData.name}
                                    onChange={(e) => setProcessData({ ...processData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <Form.Label className="mb-0">Quy trình thực hiện</Form.Label>
                                <button
                                    type="button"
                                    onClick={() => setProcessData({ ...processData, steps: [...processData.steps, { name: '', content: '' }] })}
                                    className="new-process"
                                >
                                <FaPlus />
                                </button>
                            </div>
                            {processData.steps.map((step, index) => (
                                <div key={index} className="mb-3 border p-3 rounded">
                                    <Form.Group controlId={`formStepName-${index}`} className="form-group">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <Form.Label>Bước {index + 1}</Form.Label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newSteps = processData.steps.filter((_, stepIndex) => stepIndex !== index);
                                                    setProcessData({ ...processData, steps: newSteps });
                                                }}
                                                className="delete-process"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Tên bước`}
                                            value={step.name}
                                            onChange={(e) => {
                                                const newSteps = [...processData.steps];
                                                newSteps[index].name = e.target.value;
                                                setProcessData({ ...processData, steps: newSteps });
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId={`formStepContent-${index}`} className="form-group">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder={`Nội dung`}
                                            value={step.content}
                                            onChange={(e) => {
                                                const newSteps = [...processData.steps];
                                                newSteps[index].content = e.target.value;
                                                setProcessData({ ...processData, steps: newSteps });
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            ))
                        }
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

export default Process;