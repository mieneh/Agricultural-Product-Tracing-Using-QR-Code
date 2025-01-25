import { useState, useEffect } from 'react';
import { FaHome, FaBoxOpen, FaDolly, FaUsers } from 'react-icons/fa';
import { Nav, Tab, Row, Col } from 'react-bootstrap';

import Header from "../../components/Header";
import Inbound from '../distribution/Inbound';
import Outbound from '../distribution/Outbound';
import Retailer from '../distribution/Retailer';
import Order from '../tracking/Order';

const Distributor = () => {
  const [activeTab, setActiveTab] = useState('all');
  useEffect(() => {
    if (activeTab === "inbounds" && window.refreshInbounds) {
      window.refreshInbounds();
    }
  }, [activeTab]);

  return (
    <div>
      <Header />
      <Tab.Container id="distributor-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col xs={12} lg={1}>
            <Nav className="nav-tab flex-row flex-lg-column justify-content-center text-center py-2" style={{ fontSize: '26px' }}>
              <Nav.Item>
                <Nav.Link eventKey="all"><FaHome /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="inbounds"><FaBoxOpen/></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="outbounds"><FaDolly/></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="retailers"><FaUsers/></Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} lg={11}>
            <Tab.Content className="p-3">
              <Tab.Pane eventKey="all">
                <Order/>
              </Tab.Pane>
              <Tab.Pane eventKey="inbounds">
                <Inbound/>
              </Tab.Pane>
              <Tab.Pane eventKey="outbounds">
                <Outbound/>
              </Tab.Pane>
              <Tab.Pane eventKey="retailers">
                <Retailer/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Distributor;