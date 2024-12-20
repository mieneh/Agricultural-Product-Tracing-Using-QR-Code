import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaRedoAlt } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getUsers, createUser, updateUser, deleteUser, resetPassword } from '../../services/userService';
import Header from "../../components/Header";

const User = () => {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({ fullname: '', email: '', password: '', role: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
        fetchUsers();
      }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userData.fullname || !userData.email || !userData.role) {
            setError('Vui lòng nhập đủ họ và tên.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
            setError('Email không hợp lệ.');
            return;
        }
        try {
            let newUserData = { ...userData };
            if (isEdit) {
                delete newUserData.password; 
                await updateUser(selectedUser._id, newUserData);
            } else {
                await createUser(newUserData);
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchUsers();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await deleteUser(id);
                setSuccess('Đã xóa một người dùng thành công.')
                fetchUsers();
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const handleResetPassword = async (fullname) => {
        try {
            await resetPassword(fullname);
            setSuccess(`Mật khẩu cho ${fullname} đã được reset.`);
        } catch (err) {
            setError(`Lỗi khi reset mật khẩu cho ${fullname}`);
        }
    };

    const openModal = () => {
        setUserData({ fullname: '', email: '', password: '', role: '' });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setUserData(user);
        setSelectedUser(user);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <div className="d-flex px-4 align-items-center justify-content-between mb-3">
                    <h2 className="fw-bold text-success mb-0">Quản Lý Người Dùng</h2>
                    <button className="add-button" onClick={openModal}><FaPlus /></button>
                </div>

                <div className='py-2 px-4'>
                    {success && <Alert variant="success">{success}</Alert>}

                    <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                                <th style={{padding: '12px', width:'5%'}}>STT</th>
                                <th>Họ Và tên</th>
                                <th>Email</th>
                                <th>Vai Trò</th>
                                <th style={{padding: '12px', width:'20%'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((user, index) => {
                                const roleLabel = user.role === 'Producer' ? 'Nhà sản xuất' : user.role === 'Transport' ? 'Nhà vận chuyển' : 'Nhà phân phối';
                                return (
                                <tr key={user._id} style={{ verticalAlign: 'middle' }}>
                                    <td className="text-center fw-semibold" style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px' }}>{user.fullname}</td>
                                    <td style={{ padding: '12px' }}>{user.email}</td>
                                    <td style={{ padding: '12px', textAlign: 'center'}}>
                                        <span className={`badge ${ user.role === 'Producer' ? 'bg-danger' : user.role === 'Transport' ? 'bg-success' : 'bg-info' }`}
                                            style={{ fontSize: '0.9rem', padding: '6px 10px' }}
                                        >
                                            {roleLabel}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Button className="me-2" onClick={() => openEditModal(user)}><FaEdit/></Button>
                                        <Button className="me-2" onClick={() => handleDelete(user._id)}><FaTrash/></Button>
                                        <Button className="me-2" onClick={() => handleResetPassword(user.fullname)}><FaRedoAlt/></Button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>

                <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEdit ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group className="form-group">
                                <Form.Label>Họ Và Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userData.fullname}
                                    onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="form-group">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value,})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="form-group">
                                <Form.Label>Vai Trò</Form.Label>
                                <Form.Select
                                    as="select"
                                    value={userData.role}
                                    onChange={(e) => setUserData({...userData, role: e.target.value,})}
                                >
                                    <option value="">Choose...</option>
                                    <option value="Producer">Nhà sản xuất</option>
                                    <option value="Transport">Nhà vận chuyển</option>
                                    <option value="Distributor">Nhà phân phối</option>
                                </Form.Select>
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
        </div>
    );
};

export default User;