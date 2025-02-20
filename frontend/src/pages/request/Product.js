import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import Header from "../../components/Header";

import { useAuth } from "../../hooks/useAuth";
import { getAllHarvests } from '../../services/harvestService';
import { getConnectionsWithProducer } from '../../services/connectionService';
import { getAllRequests } from '../../services/requestService';

import ProductDetailModal from './components/ProductDetail';
import RequestListModal from './components/RequestList';
import TransportSelectModal from './components/TransportSelect';

const Product = () => {
    const { user } = useAuth();

    const [produces, setProduces] = useState([]);
    const [requests, setRequests] = useState([]);
    const [transporters, setTransporters] = useState([]);

    const [selectedProduce, setSelectedProduce] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showTransport, setShowTransport] = useState(false);

    useEffect(() => {
        fetchProduces();
        fetchRequests();
        fetchTransporters();
    }, []);

    const fetchProduces = async () => {
        try {
            const data = await getAllHarvests();
            setProduces(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchRequests = async () => {
        try {
            const data = await getAllRequests();
            setRequests(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const fetchTransporters = async () => {
        try {
            const data = await getConnectionsWithProducer();
            setTransporters(data);
        } catch (err) {
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    const handleClick = (produce) => {
        setSelectedProduce(produce);
        setShowModal(true);
    };
    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <div className="d-flex px-4 align-items-center justify-content-between mb-3">
                    <h2 className="fw-bold text-success mb-2 mt-2">Nông Sản</h2>
                    <button className="add-button" onClick={() => setShowList(true)}><FaShoppingCart /></button>
                </div>
                <div className="px-4">
                    {produces.length === 0 ? (
                        <p className="mt-3 p-2 text-muted text-center">Không có sản phẩm nào!</p>
                    ) : (
                        <div className="row gy-6 gx-6">
                            {produces.map((produce) => (
                                <div key={produce._id} className="col-12 col-sm-6 col-md-4 col-lg-6" style={{ marginBottom: "20px" }}>
                                    <Card className="shadow-sm border-0" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}>
                                            <Card.Img
                                                variant="top"
                                                src={produce?.product?.image ? produce.product.image : "/assets/admin.jpg"}
                                                alt={produce.product.name}
                                                onClick={() => handleClick(produce)}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title>{produce.product?.name}</Card.Title>
                                            <Card.Text>{produce.userID?.farmName || "Chưa có loại cây trồng"}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <ProductDetailModal
                    show={showModal}
                    onHide={() => {setShowModal(false); setSelectedProduce(null); setShowList(false);}}
                    selectedProduce={selectedProduce}
                    requests={requests}
                    userRole={user?.role}
                    fetchRequests={fetchRequests}
                />
                <RequestListModal
                    show={showList}
                    onHide={() => setShowList(false)}
                    requests={requests}
                    userRole={user?.role}
                    onShowTransport={(reqId) => { 
                        setSelectedRequest(reqId); 
                        setShowList(false);
                        setShowTransport(true);
                    }}
                    setRequests={setRequests}
                    fetchRequests={fetchRequests}
                />
                <TransportSelectModal
                    show={showTransport}
                    onHide={() => {
                        setShowTransport(false);
                        setShowList(true);
                    }}
                    requestID={selectedRequest}
                    transporters={transporters}
                    fetchRequests={fetchRequests}
                />
            </div>
        </div>
    );
};

export default Product; 