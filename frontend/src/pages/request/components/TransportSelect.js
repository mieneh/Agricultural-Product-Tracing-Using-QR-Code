import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { assignTransporter } from '../../../services/requestService';

const TransportSelectModal = ({ show, onHide, requestID, transporters, fetchRequests }) => {
  const [selectedTransporter, setSelectedTransporter] = useState('');

  const handleSubmitTransport = async () => {
    if (!selectedTransporter) {
      alert('Vui lòng chọn nhà vận chuyển!');
      return;
    }
    try {
      const res = await assignTransporter({ requestID, transporterID: selectedTransporter });
      alert(res?.data?.message || res?.message || "Cập nhật thành công!");
      fetchRequests();
      setSelectedTransporter('');
      onHide();
    } catch (err) {
      console.error("Error:", err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chọn Nhà Vận Chuyển</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="form-group">
            <Form.Select value={selectedTransporter} onChange={(e) => setSelectedTransporter(e.target.value)}>
              <option value="">-- Chọn nhà vận chuyển --</option>
              {transporters
                .filter((t) => t.status === 'Accepted')
                .map((t) => (
                  <option key={t.transporterID._id} value={t.transporterID._id}>
                    {t.transporterID.companyName} - {t.transporterID.location}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="w-100 mt-3 p-2" onClick={handleSubmitTransport}><FaSave style={{ color: 'white' }} /></Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransportSelectModal;