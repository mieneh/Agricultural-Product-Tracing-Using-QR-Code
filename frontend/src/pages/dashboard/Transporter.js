import { useState } from 'react';
import { FaHome, FaTruck, FaUserTie, FaRoute } from 'react-icons/fa';
import { Nav, Tab, Row, Col } from 'react-bootstrap';

import Header from "../../components/Header";
import Vehicle from '../transport/Vehicle';
import Driver from '../transport/Driver';
import Route from '../transport/Route';

const Transporter = () => {
  const [activeTab, setActiveTab] = useState('all');
  return (
    <div>
      <Header />
      <Tab.Container id="transporter-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col xs={12} lg={1}>
            <Nav className="nav-tab flex-row flex-lg-column justify-content-center text-center py-2" style={{ fontSize: '26px' }}>
              <Nav.Item>
                <Nav.Link eventKey="all"><FaHome /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="vehicles"><FaTruck/></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="drivers"><FaUserTie/></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="routes"><FaRoute/></Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} lg={11}>
            <Tab.Content className="p-3">
              <Tab.Pane eventKey="vehicles">
                <Vehicle/>
              </Tab.Pane>
              <Tab.Pane eventKey="drivers">
                <Driver/>
              </Tab.Pane>
                <Tab.Pane eventKey="routes">
              <Route/>
                </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Transporter;