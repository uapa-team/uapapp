import React from "react";
import "antd/dist/antd.css";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";

import MainMenu from "./MainMenu";
import AdminPrograms from "./AdminPrograms";
import AdminUsers from "./AdminUsers";
import GenerateReport from "./GenerateReport";
import RecFormat from "./RecFormat";

const componentOf = {
  au: <AdminUsers />,
  ap: <AdminPrograms />,
  gr: <GenerateReport />,
  fr: <RecFormat />,
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: "au" };
  }

  myCallback = (current) => {
    this.setState({ tab: current });
  };

  renderContent = () => {
    return componentOf[this.state.tab];
  };

  render() {
    return (
      <Row className="main-row-container">
        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
        <Col xs={20} sm={20} md={16} lg={16} xl={16}>
          <MainMenu callbackFromParent={this.myCallback} />
          {this.renderContent()}
        </Col>
        <Col xs={2} sm={2} md={4} lg={4} xl={4}></Col>
      </Row>
    );
  }
}

export default withRouter(Home);
