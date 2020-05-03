import React from "react";
import { Menu } from "antd";
import {
  ScheduleOutlined,
  AppstoreOutlined,
  BookOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "au",
    };
  }

  handleClick = (e) => {
    console.log("click ", e.key);
    this.setState({
      current: e.key,
    });
    this.props.callbackFromParent(e.key);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="au">
          <ScheduleOutlined />
          Administración
        </Menu.Item>
        <Menu.Item key="ap">
          <AppstoreOutlined />
          Administración - Programas
        </Menu.Item>
        <Menu.Item key="gr">
          <AuditOutlined />
          Generar Reporte
        </Menu.Item>
        <Menu.Item key="fr">
          <BookOutlined />
          Formato Recolección
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(MainMenu);
