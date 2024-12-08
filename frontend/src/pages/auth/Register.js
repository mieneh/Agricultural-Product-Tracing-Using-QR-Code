import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import { register } from '../../services/authService';

const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        role: '',
        farmName: '',
        farmLocation: '',
        registrationNumber: '',
        companyName: '',
        location: '',
        contactEmail: '',
        contactPhone: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const timer = setTimeout(() => setError(''), 3000);
        if (localStorage.getItem('token')) {
            alert('Bạn cần đăng xuất trước khi đăng ký người dùng mới.');
            navigate('/');
        }
        return () => clearTimeout(timer);
    }, [error, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            setError('Email không hợp lệ.');
            return;
        }
        if (['Producer', 'Transport', 'Distributor'].includes(form.role)) {
            if (!/^\d{10,11}$/.test(form.contactPhone)) {
                setError('Số điện thoại không hợp lệ (10-11 chữ số).');
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
                setError('Email liên hệ không hợp lệ.');
                return;
            }
            if (!/^\d{10}$/.test(form.registrationNumber)) {
                setError('Mã số thuế phải gồm 10 chữ số.');
                return;
            }
        }
        if (form.role === 'Producer') {
            if (!form.farmName || !form.farmLocation || !form.registrationNumber || !form.contactEmail || !form.contactPhone) {
            setError('Vui lòng điền đầy đủ thông tin cho nhà sản xuất');
            return;
            }
        }
        if (form.role === 'Transport' || form.role === 'Distributor') {
            if (!form.companyName || !form.location || !form.registrationNumber || !form.contactEmail || !form.contactPhone) {
            setError(`Vui lòng điền đầy đủ thông tin cho ${form.role === 'Transport' ? 'đơn vị vận chuyển' : 'đơn vị phân phối'}`);
            return;
            }
        }

        setLoading(true);
        try {
            await register({
                fullname: form.fullname,
                email: form.email,
                password: form.password,
                role: form.role,
                contactEmail: ['Producer', 'Transport', 'Distributor'].includes(form.role) ? form.contactEmail : undefined,
                contactPhone: ['Producer', 'Transport', 'Distributor'].includes(form.role) ? form.contactPhone : undefined,
                farmName: form.role === 'Producer' ? form.farmName : undefined,
                farmLocation: form.role === 'Producer' ? form.farmLocation : undefined,
                companyName: ['Transport', 'Distributor'].includes(form.role) ? form.companyName : undefined,
                location: ['Transport', 'Distributor'].includes(form.role) ? form.location : undefined,
                registrationNumber: ['Producer', 'Transport', 'Distributor'].includes(form.role) ? form.registrationNumber : undefined,
            });
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body">
            <div className="bg-white rounded shadow p-4 mx-auto" style={{ width: '100%', maxWidth: '750px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxHeight: '85vh', overflowY: 'auto', }} >
                <div className="text-center mb-3 p-3">
                    <a href="/"> <img src='/assets/logo.png' alt="Logo" style={{ width: '200px' }}/> </a>
                </div>
                <div className="my-4 text-center">
                    <h5 className="fw-bold fs-4 text-dark mb-2">Đăng Ký Tài Khoản</h5>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Điền thông tin để tạo tài khoản mới</p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-group">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            name="fullname"
                            type="text"
                            value={form.fullname}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <Form.Control
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label>Nhu cầu sử dụng</Form.Label>
                        <Form.Select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose...</option>
                            <option value="Producer">Sản xuất</option>
                            <option value="Transport">Vận chuyển</option>
                            <option value="Distributor">Phân phối</option>
                        </Form.Select>
                    </Form.Group>
                    {form.role === 'Producer' && (
                        <>
                        <Form.Group className="form-group">
                            <Form.Label>Tên trang trại</Form.Label>
                            <Form.Control
                                name="farmName"
                                value={form.farmName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Vị trí trang trại</Form.Label>
                            <Form.Control
                                name="farmLocation"
                                value={form.farmLocation}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        </>
                    )}
                    {(form.role === 'Transport' || form.role === 'Distributor') && (
                        <>
                        <Form.Group className="form-group">
                            <Form.Label>Tên công ty</Form.Label>
                            <Form.Control
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Vị trí công ty</Form.Label>
                            <Form.Control
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        </>
                    )}
                    {['Producer', 'Transport', 'Distributor'].includes(form.role) && (
                        <>
                            <Form.Group className="form-group">
                                <Form.Label>Mã số thuế</Form.Label>
                                <Form.Control
                                    name="registrationNumber"
                                    value={form.registrationNumber}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="form-group">
                                <Form.Label>Số điện thoại liên hệ</Form.Label>
                                <Form.Control
                                    name="contactPhone"
                                    value={form.contactPhone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="form-group">
                                <Form.Label>Email liên hệ</Form.Label>
                                <Form.Control
                                    name="contactEmail"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </>
                    )}
                    <Button type="submit" disabled={loading} className="w-100 mt-3 p-2">{loading ? 'Đang xử lý...' : 'Đăng ký'}</Button>
                </Form>
                <p className="text-center mt-4" style={{ fontSize: '14px', color: '#666' }}>Đã có tài khoản? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Đăng nhập</a> </p>
            </div>
        </div>
    );
};

export default Register;