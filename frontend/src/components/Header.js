import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser, FaPen, FaSignOutAlt, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getNotifications, markAllAsRead} from "../services/notificationService"
import { useAuth } from "../hooks/useAuth";
import './css/index.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toggleProfile, setToggleProfile] = useState(false);
    const { user } = useAuth();

    const [toggleNotification, setToggleNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();

        const handleUpdate = () => {
            fetchNotifications();
        };

        window.addEventListener("notifications-updated", handleUpdate);
        return () => window.removeEventListener("notifications-updated", handleUpdate);
    }, []);


    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            const normalized = data
            .map((n) => ({...n, read: n.read === true || n.read === "true"}))
            .sort((a, b) => {
                if (a.read === b.read) {
                return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return a.read ? 1 : -1;
            });
            setNotifications(normalized);
            const unread = normalized.filter((n) => !n.read).length;
            setUnreadCount(unread);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setNotifications([]);
                setUnreadCount(0);
            } else {
                console.error(err.response ? err.response.data.message : err.message);
            }
        }
    };
    
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            const updated = notifications.map((n) => ({ ...n, read: true }));
            setNotifications(updated);
            setUnreadCount(0);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

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
    const toggleNotificationMenu = () => setToggleNotification(!toggleNotification);

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
                        {user?.role ? (
                            <>
                                {(user?.role in roleLinks) && roleLinks[user?.role].map((link) => (
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
                        {user?.role ? (
                            <>
                                <div className="icon-circle">
                                    <FaBell className="icon" onClick={toggleNotificationMenu}/>
                                    {unreadCount > 0 && <span className="notify-badge">{unreadCount}</span>}
                                </div>
                                <div className={`notify-menu ${toggleNotification ? "open" : ""}`}>
                                    <div className="d-flex justify-content-between align-items-center border-bottom py-2 px-1">
                                        <h5 className="mb-0 fw-bold text-success">Thông báo</h5>
                                        <button onClick={handleMarkAllAsRead} className="align-middle text-success fw-semibold" style={{ background: "none", border: "none", cursor: "pointer"}}>Đánh dấu đọc tất cả</button>
                                    </div>
                                    <div className="list-group list-group-flush mt-2">
                                        {notifications.length > 0 ? (
                                            notifications.slice(0, 6).map((n) => (
                                               <div key={n._id} className={`mb-1 notify-item ${n.read ? "read" : "unread"}`}>
                                                    <p className="mb-1">{n.content}</p>
                                                    <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="mt-3 text-muted text-center">Không có thông báo nào.</p>
                                        )}
                                    </div>
                                    <div className="border-top d-flex justify-content-center py-2 mt-2">
                                        <Link to="/notification" className="text-decoration-none text-success fw-semibold" style={{ marginTop: "5px" }}>Xem tất cả</Link>
                                    </div>
                                </div>
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