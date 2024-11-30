import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import './css/index.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toggleProfile, setToggleProfile] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleProfileMenu = () => setToggleProfile(!toggleProfile);

    return (
            <>
            <header className="header">
                <div className="header-logo">
                <img src="/assets/logo.png" alt="Logo" />
                </div>
            </header>

            <nav className="navbar">
                <div className="navbar-section">
                    <div className="navbar-logo">
                        <h1>F a r m T r a c k</h1>
                        <div className="menu-icon" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    </div>
                    <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                        <Link to="/">Trang Chủ</Link>
                        <Link to="/about">Giới Thiệu</Link>
                        <Link to="/contact">Liên Hệ</Link>
                        <Link to="/qr">Truy Suất</Link>
                    </div>
                    
                    <div className="navbar-menu">
                        <div className="navbar-search">
                            <input type="search" placeholder="Search..." />
                        </div>
                        <div className="icon-circle">
                            <Link to="/login"><FaUser className="icon" onClick={toggleProfileMenu} /></Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;