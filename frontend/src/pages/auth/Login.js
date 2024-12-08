import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import { login } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => { setError(''); }, 3000);
    if (localStorage.getItem('token')) {
      alert("Bạn cần đăng xuất trước khi đăng nhập lại.");
      navigate('/');
      return;
    }
    return () => clearTimeout(timer);
  }, [error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="bg-white rounded shadow p-4 mx-auto" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', maxHeight: '85vh', overflowY: 'auto', }} >
        <div className="text-center mb-3 p-3">
          <a href="/"> <img src='/assets/logo.png' alt="Logo" style={{ width: '200px' }}/> </a>
        </div>
        <div className="my-4 text-center">
          <h5 className="fw-bold fs-4 text-dark mb-2">Đăng ký tài khoản</h5>
          <p className="text-muted" style={{ fontSize: '14px' }}> Nhập email và mật khẩu để đăng nhập</p>                  
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="form-group">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRememberMe">
            <Form.Check
              type="checkbox"
              label={
                <span className="ms-1" style={{ cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                  Ghi nhớ tài khoản
                </span>
              }
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </Form.Group>
          <Button type="submit" disabled={loading} className="w-100 mt-3 p-2">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
        </Form>
        <p className="text-center mt-4" style={{ fontSize: '14px', color: '#666' }}> Chưa có tài khoản? 
          <a href="https://zalo.me/0877896226" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}> Liên hệ</a> | <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default Login;