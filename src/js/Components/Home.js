import React from "react";
import "antd/dist/antd.css";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import MainMenu from "./MainMenu";
import AdminUsers from "./AdminUsers";

class Home extends React.Component {
  render() {
    return (
      <Row className="main-row-container">
        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
        <Col xs={20} sm={20} md={16} lg={16} xl={16}>
          <MainMenu />
          <AdminUsers />
        </Col>
        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
      </Row>
    );
  }
}

export default withRouter(Home);
