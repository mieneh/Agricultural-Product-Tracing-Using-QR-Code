import {FaPaperPlane } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { sendRequest } from '../../../services/requestService';

const ProductDetailModal = ({ show, onHide, selectedProduce, requests, userRole, fetchRequests }) => {
  if (!selectedProduce) return null;
  const handleSend = async () => {
    const existingRequest = requests.find((request) => request.harvestID?._id === selectedProduce._id && request.status === 'Pending');
    if (existingRequest) {
        alert("Bạn đã gửi yêu cầu với sản phẩm này trước đó.");
        return;
    }
    try {
        const res = await sendRequest({ harvestID: selectedProduce._id });
        alert(res.message)
        fetchRequests();
        onHide();
    } catch (err) {
        console.error(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProduce && (
          <div>
            <div className="product-container">
              <img src={selectedProduce?.product?.image ? selectedProduce.product.image : "/assets/admin.jpg"} alt={selectedProduce.product.name} className="product-image"/>
              <div className="product-details">
                <div className="product-header">
                  <h5>Sản phẩm: {selectedProduce.product?.name || "Chưa có thông tin"}</h5>
                </div>
                <div className="product-info">
                  <p><strong>Lô hàng</strong> {selectedProduce?.batch}</p>
                  <p><strong>Ngày sản xuất</strong> {new Date(selectedProduce?.harvestDate).toLocaleDateString()}</p>
                  <p><strong>Ngày hết hạn</strong> {new Date(selectedProduce?.expirationDate).toLocaleDateString()}</p>
                  <p><strong>Số lượng:</strong> {selectedProduce?.quantity} kg</p>
                </div>
              </div>
            </div>
            <div className="product">
              <div className="product-header">
                <h5>Thông tin Nông trại</h5>
              </div>
              <div className="product-info">
                <p><strong>Người đại diện:</strong> {selectedProduce.userID?.fullname || "Chưa có thông tin"}</p>
                <p><strong>Tên nông trại:</strong> {selectedProduce.userID?.farmName || "Chưa có thông tin"}</p>
                <p><strong>Địa chỉ:</strong> {selectedProduce.userID?.farmLocation || "Chưa có thông tin"}</p>
                <p><strong>Số đăng ký:</strong> {selectedProduce.userID?.registrationNumber || "Chưa có thông tin"}</p>
                <p><strong>Liên hệ:</strong> {selectedProduce.userID?.contactPhone || "Chưa có thông tin"}</p>
              </div>
            </div>
            <div className="product">
              <div className="product-header">
                <h5>Thông tin Sản xuất</h5>
              </div>
              <div className="product-info">
                <p><strong>Vùng sản xuất:</strong> {selectedProduce.location?.name || "Chưa có thông tin"} thuộc vùng {selectedProduce.location?.type}</p> 
                <p>{selectedProduce.location?.description || "Chưa có thông tin"}</p>
                <p><strong>Địa chỉ:</strong> {selectedProduce.location?.address?.province}, {selectedProduce.location?.address?.district}, {' '} {selectedProduce.location?.address?.commune}, {selectedProduce.location?.address?.street}</p>
                <p><strong>Diện tích:</strong> {selectedProduce.location?.area || "Chưa có thông tin"}</p>
                <p><strong>Quy trình:</strong>
                  <p style={{ listStyleType: 'square', paddingLeft: '20px', margin: '0' }}>
                    {selectedProduce.process?.steps.map((step, index) => (
                      <li key={index} style={{ padding: '8px 0px'}}><strong>{step.name}: </strong> {step.content}</li>
                    )) || "Chưa có thông tin"}
                  </p>
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      {userRole === 'Distributor' && (
        <Modal.Footer>
          <Button className="w-100 mt-1 py-2" onClick={handleSend}><FaPaperPlane style={{ color: 'white' }}/></Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ProductDetailModal;