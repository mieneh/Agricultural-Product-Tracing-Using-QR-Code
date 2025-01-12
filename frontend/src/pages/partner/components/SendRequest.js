import { Modal, Button, Form } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";

const SendRequest = ({ show, onHide, target, targetLabel, message, setMessage, onSend, }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Yêu Cầu Hợp Tác</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {target && (
                    <Form>
                        <Form.Group className="form-group">
                            <Form.Label>{targetLabel}</Form.Label>
                            <Form.Control value={target.companyName || target.farmName} readOnly />
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label>Nội dung:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Nhập nội dung yêu cầu..."
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="w-100 mt-1 p-2" onClick={onSend}><FaPaperPlane style={{ color: "white" }} /></Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SendRequest;