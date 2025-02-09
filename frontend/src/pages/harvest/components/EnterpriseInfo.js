import { FaUserCircle } from "react-icons/fa";

const EnterpriseInfo = ({ harvest }) => {
  if (!harvest) {
    return <div className="text-center text-muted py-3">Đang tải thông tin doanh nghiệp...</div>;
  }

  return (
    <div>
      {["userID", "transporterID", "distributorID"].map((key, index) => (
        <div className="modal-detail" key={index}>
          <h5 className="fs-5 fw-bold mb-0 mt-4 px-4">{key === "userID" ? "Thông tin Nông trại" : key === "transporterID" ? "Thông tin Đơn vị vận chuyển" : "Thông tin Đơn vị phân phối"}</h5>
          <div className="d-flex align-items-center">
              <div className="px-2 mt-3 mb-4">
                  {harvest[key]?.image ? (
                      <img
                          src={harvest[key].image}
                          alt={harvest[key]?.fullname}
                          style={{ marginLeft: "25px", maxWidth: "180px" }}
                      />
                  ) : (
                      <FaUserCircle
                          size={20}
                          style={{ width: "auto", height: "180px", borderRadius: "8px", marginLeft: "25px", color: "#4caf50" }}
                      />
                  )}
              </div>
              <div className="px-1 mt-3 mb-2">
                  <p><strong>Người đại diện:</strong> {harvest[key]?.fullname || "Chưa có thông tin"}</p>
                  <p><strong>Tên:</strong> {harvest[key]?.farmName || harvest[key]?.companyName || "Chưa có thông tin"}</p>
                  <p><strong>Địa chỉ:</strong> {harvest[key]?.location || harvest[key]?.farmLocation || "Chưa có thông tin"}</p>
                  <p><strong>Liên hệ:</strong> {harvest[key]?.contactPhone || "Chưa có thông tin"}</p>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnterpriseInfo;