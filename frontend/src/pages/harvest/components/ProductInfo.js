import { FaWarehouse, FaCalendarAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const ProductInfo = ({ harvest }) => {
    if (!harvest) {
        return <div className="text-center text-muted py-4">Đang tải dữ liệu sản phẩm...</div>;
    }

    return (
        <div className="row justify-content-center g-4">
            <div className="col-md-6 d-flex align-items-center justify-content-center">
                <img
                    src={harvest.product?.image}
                    alt="Product"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxWidth: "280px" }}
                />
            </div>
            <div className="col-md-6">
                <h3 className="fw-bold text-danger py-2"><strong>Sản phẩm:</strong> {harvest.product?.name}</h3>
                <p className="py-1"><strong><FaWarehouse className="me-2 mb-1 text-warning" /> Lô hàng:</strong> {harvest.batch}</p>
                <p className="py-1"><strong><FaCalendarAlt className="me-2 mb-1 text-primary" /> Ngày thu hoạch:</strong> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
                <p className="py-1"><strong><FaCalendarAlt className="me-2 mb-1 text-primary" /> Ngày hết hạn:</strong> {new Date(harvest.expirationDate).toLocaleDateString()}</p>
                <p className="py-1"><strong><FaExclamationCircle className="me-2 mb-1 text-danger" /> Số lượng:</strong> {harvest.quantity} kg</p>
                <p className="py-1"><strong><FaCheckCircle className="me-2 mb-1 text-success" /> Chứng nhận:</strong> {harvest.certification}</p>
            </div>
        </div>
    )
};

export default ProductInfo;