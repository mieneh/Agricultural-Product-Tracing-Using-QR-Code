import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/home.css';

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ['/assets/green-and-orange/1.png', '/assets/green-and-orange/2.png', '/assets/green-and-orange/3.png'];
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleGetStarted = () => {
        if (token) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };
    return (
        <div className="container-home">
            <main className="content-home">
                <div className="section-home">
                    <header className="navbar-home">
                        <div className="logo-home">
                            <img src='/assets/logo.png' alt="Logo Green Trust" />
                        </div>
                        <nav className="menu-home">
                            <a href="/about">Giới thiệu</a>
                            <a href="/contact">Liên hệ</a>
                            <a href="/qr">Truy suất</a>
                        </nav>
                        <button className="get-started" onClick={handleGetStarted}> Bắt đầu ngay </button>
                    </header>
                    <div className="text-section-home">
                         <h1>Đăng ký với <span className="highlight">Farm <strong>Track</strong></span> ngay hôm nay!</h1>
                        <p> Đảm bảo chứng nhận 
                            <span className="highlight-red"> liền mạch</span>, 
                            <span className="highlight-red"> không rắc rối</span> và 
                            <span className="highlight"> đáng tin cậy</span> cho sản phẩm 
                            <span className="highlight-green"> hữu cơ</span> của bạn.
                        </p>
                    </div>
                    <div className="button-home">
                        <button className="get-started" onClick={handleGetStarted}> Bắt đầu ngay </button>
                    </div>
                </div>
                <div className="image-section-home">
                    <img src={images[currentIndex]} alt="Nông trại" />
                </div>
            </main>
        </div>
    );
};

export default Home;