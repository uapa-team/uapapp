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
    this.props.callbackFromParent("fr");
    this.state = {
      current: "fr",
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    this.props.callbackFromParent(e.key);
  };

  handlePermissions = () => {
    switch(localStorage.getItem("type")) {
      case "1":
        return(
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
            Formatos Recolección
          </Menu.Item>
        </Menu>
        )
      case "2":
        return(
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="fr">
              <BookOutlined />
              Formatos Recolección
            </Menu.Item>
          </Menu>
          )
      case "3":
        return(
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
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
              Formatos Recolección
            </Menu.Item>
          </Menu>
          )
      case "4":
        return(
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="gr">
              <AuditOutlined />
              Generar Reporte
            </Menu.Item>
            <Menu.Item key="fr">
              <BookOutlined />
              Formatos Recolección
            </Menu.Item>
          </Menu>
          )
      default:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          ></Menu>
        )
    }
  }

  render() {
    return this.handlePermissions();
  }
}

export default withRouter(MainMenu);
