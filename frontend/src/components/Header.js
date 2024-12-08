import { useState } from "react";
import { FaBars, FaTimes, FaUser, FaPen, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import './css/index.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toggleProfile, setToggleProfile] = useState(false);
    const { user } = useAuth();

    const roleLinks = {
        Admin: [{ to: "/admin", text: "Quản Lý" }],
        Producer: [
            { to: "/producer", text: "Quản Lý" },
            { to: "/product", text: "Nông Sản" },
            { to: "/transport", text: "Vận Chuyển" },
        ],
        Transport: [
            { to: "/transporter", text: "Quản Lý" },
            { to: "/produce", text: "Sản Xuất" },
        ],
        Distributor: [
            { to: "/distributor", text: "Quản Lý" },
            { to: "/product", text: "Nông Sản" },
        ],
    };
    
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
                        {user.role ? (
                        <>
                            {(user.role in roleLinks) && roleLinks[user.role].map((link) => (
                            <Link key={link.to} to={link.to}> {link.text} </Link>
                            ))}
                        </>
                        ) : (
                        <>
                            <Link to="/">Trang Chủ</Link>
                            <Link to="/about">Giới Thiệu</Link>
                            <Link to="/contact">Liên Hệ</Link>
                        </>
                        )}
                        <Link to="/qr">Truy Suất</Link>
                    </div>
                
                    <div className="navbar-menu">
                        <div className="navbar-search">
                            <input type="search" placeholder="Search..." />
                        </div>
                        {user.role ? (
                        <>
                            <div className="icon-circle">
                                <FaUser className="icon" onClick={toggleProfileMenu} />
                            </div>
                            <div className={`profile-menu ${toggleProfile ? "open" : ""}`}>
                                <Link to="/profile"><FaPen /> Hồ Sơ</Link>
                                <Link to="/logout"><FaSignOutAlt /> Đăng Xuất</Link>
                            </div>
                        </>
                        ) : (
                        <>
                            <div className="icon-circle">
                                <Link to="/login"><FaUser className="icon" onClick={toggleProfileMenu} /></Link>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;