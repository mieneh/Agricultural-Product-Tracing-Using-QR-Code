import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Header from '../../components/Header';
import '../../components/css/default.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: ''});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ với chúng tôi!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div>
            <Header />
            <div className="contact-container">
                <h1 className="title-contact text-success">Liên hệ với FarmTrack</h1>
                <div className="contact-layout">
                    <div className="contact-map">
                        <h2>Thông tin liên hệ</h2>
                        <p><strong>Địa chỉ:</strong> 123 Đường Số 5, Phường Tân Phú, Quận 7, TP.HCM, Việt Nam</p>
                        <p><strong>Điện thoại:</strong> 0877896226</p>
                        <p><strong>Email:</strong> farmtrack@gmail.com</p>
                        <p><strong>Website:</strong> www.farmtrack.com.vn</p>
                        <iframe title="Google Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.671522033415!2d105.93686881537524!3d21.014506993477134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3ac283c8e5%3A0x4bcb4baf5cd7de4f!2zVGFuaCBIaWV1!5e0!3m2!1sen!2s!4v1645391959931!5m2!1sen!2s" width="100%" height="315" style={{ border: 0, marginTop: '7px' }} allowFullScreen="" loading="lazy"></iframe> 
                    </div>
                    <div className="contact-form">
                        <h2>Gửi yêu cầu của bạn</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className='label-contact'>Họ và tên</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className='label-contact'>Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message"  className='label-contact'>Lời nhắn</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                            </div>
                        <Button type="submit" className="submit-btn">Gửi</Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Contact;