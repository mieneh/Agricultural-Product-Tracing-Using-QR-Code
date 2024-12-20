import { useState } from 'react';
import { FaHome, FaTags, FaTasks, FaMapMarkerAlt, FaBoxes } from 'react-icons/fa';
import { Nav, Tab, Row, Col } from 'react-bootstrap';

import Header from "../../components/Header";
import Category from '../produce/Category';
import Product from '../produce/Product';
import Process from '../produce/Process';
import Region from '../produce/Region';

const Producer = () => {
  const [activeTab, setActiveTab] = useState('all');
  return (
    <div>
      <Header />
      <Tab.Container id="producer-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col xs={12} lg={1}>
            <Nav className="nav-tab flex-row flex-lg-column justify-content-center text-center py-2" style={{ fontSize: '26px' }}>
              <Nav.Item>
                <Nav.Link eventKey="all"><FaHome /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="categories"><FaTags /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="products"><FaBoxes /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="processes"><FaTasks /></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="regions"><FaMapMarkerAlt /></Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col xs={12} lg={11}>
            <Tab.Content className="p-3">
              <Tab.Pane eventKey="categories">
                <Category />
              </Tab.Pane>
              <Tab.Pane eventKey="products">
                <Product />
              </Tab.Pane>
              <Tab.Pane eventKey="processes">
                <Process />
              </Tab.Pane>
              <Tab.Pane eventKey="regions">
                <Region />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Producer;