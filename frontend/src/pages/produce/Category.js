import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({ name: '', description: '', expiry: '', maxday: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!categoryData.name) {
            setError('Vui lòng nhập tên danh mục.');
            return;
        }
        if (!categoryData.maxday) {
            setError('Vui lòng nhập ngày giới hạn sử dụng.');
            return;
        }
        try {
            if (isEdit) {
                await updateCategory(selectedCategory._id, categoryData);
            } else {
                await createCategory(categoryData);
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchCategories();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                await deleteCategory(id);
                setCategories(prev => prev.filter(c => c._id !== id));
                setSuccess('Đã xóa một loại sản phẩm thành công.');
                fetchCategories();
            } catch (err) {
                alert(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const openModal = () => {
        setCategoryData({ name: '', description: '', expiry: '', maxday: '' });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (category) => {
        setCategoryData(category);
        setSelectedCategory(category);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div style={{ padding: '15px 2px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-success mb-0">Quản Lý Phân Loại</h2>
                <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>
        
            {success && <Alert variant="success">{success}</Alert>}
            
            <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                        <th style={{padding: '12px', width:'5%'}}>STT</th>
                        <th style={{padding: '12px', width:'15%'}}>Tên Danh Mục</th>
                        <th style={{padding: '12px', width:'30%'}}>Mô Tả</th>
                        <th style={{padding: '12px', width:'30%'}}>Điều Kiện Sử Dụng</th>
                        <th style={{padding: '12px', width:'10%'}}>Giới Hạn</th>
                        <th style={{padding: '12px', width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(!Array.isArray(categories) || categories.length === 0) ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted p-3">Không có thông tin phân loại nào!</td>
                        </tr>
                    ) : (
                    categories
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((category, index) => (
                            <tr key={category._id}>
                                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                                <td style={{textAlign: 'center', padding: '15px'}}>{category.name}</td>
                                <td style={{padding: '15px'}}>{category.description}</td>
                                <td style={{padding: '15px'}}>{category.expiry}</td>
                                <td style={{textAlign: 'center', padding: '15px'}}>{category.maxday} ngày</td>
                                <td className="text-center">
                                    <Button className="me-2" onClick={() => openEditModal(category)}><FaEdit/></Button>
                                    <Button className="me-2" onClick={() => handleDelete(category._id)}><FaTrash/></Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Chỉnh Sửa Phân Loại' : 'Thêm Mới Phân Loại'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="form-group">
                            <Form.Label>Tên Loại</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryData.name}
                                onChange={(e) =>
                                    setCategoryData({ ...categoryData, name: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                        <Form.Label>Mô Tả</Form.Label>
                            <Form.Control
                                type="text"
                                rows={3}
                                value={categoryData.description}
                                onChange={(e) =>
                                    setCategoryData({
                                        ...categoryData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Điều Kiện Sử Dụng</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={categoryData.expiry}
                                onChange={(e) =>
                                    setCategoryData({
                                        ...categoryData,
                                        expiry: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Số Ngày Giới Hạn</Form.Label>
                            <Form.Control
                                type="number"
                                value={categoryData.maxday}
                                onChange={(e) =>
                                    setCategoryData({
                                        ...categoryData,
                                        maxday: e.target.value,
                                    })
                                }
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

export default Category;