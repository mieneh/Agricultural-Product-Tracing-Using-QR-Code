import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { getNotifications,deleteNotification, deleteAllNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import Header from "../../components/Header";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
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
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setOpenDropdown(null);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa thông báo này không?')) return;
    try {
      await deleteNotification(id);
      alert('Đã xóa thông báo thành công.');
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setOpenDropdown(null);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) return;
    try {
      await deleteAllNotifications();
      alert('Đã xóa tất cả thông báo thành công.');
      setNotifications([]);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = notifications.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {if (currentPage < totalPages) setCurrentPage(currentPage + 1)};
  const goToPrevPage = () => {if (currentPage > 1) setCurrentPage(currentPage - 1)};

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <div className="d-flex px-4 align-items-center justify-content-between mb-3">
          <h2 className="fw-bold text-success mb-0">Tất cả thông báo</h2>
          {notifications.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="align-middle text-success fw-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={handleMarkAllAsRead}>Đánh dấu tất cả đã đọc</button>
              <button className="align-middle text-success fw-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={handleClearAll}>Xóa tất cả</button>
            </div>
          )}
        </div>
        <div className="px-4">
          {notifications.length === 0 ? (
            <p className="mt-3 p-2 text-muted text-center">Không có thông báo nào.</p>
          ) : (
            currentItems.map((n) => (
              <div key={n._id} className={`card shadow-sm border-0 rounded-3 mb-2 p-3 ${n.read ? "opacity-75" : "bg-light"}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-semibold mb-1 flex-grow-1">{n.type || "Thông báo"}</h5>
                  <button className="border-0 bg-transparent p-1" style={{ color: "#000", cursor: "pointer" }} onClick={() => setOpenDropdown(openDropdown === n._id ? null : n._id) } >
                    <FaEllipsisV size={16} />
                  </button>
                  {openDropdown === n._id && (
                    <div className="position-relative">
                      <div className={`notify-button ${openDropdown === n._id ? "open" : ""}`}>
                        <button className="align-middle fw-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 500 }} disabled={n.read} onClick={() => handleMarkAsRead(n._id)}>Đánh dấu đã đọc</button>
                        <button className="align-middle fw-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 500 }} onClick={() => handleDelete(n._id)}> Xóa thông báo </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-muted mb-2">{n.content}</p>
                <p className="small text-muted mb-0">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}

          {notifications.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination gap-1">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={goToPrevPage}>←</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${ currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={goToNextPage}>→</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;