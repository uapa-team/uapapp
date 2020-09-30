import React from "react";
import { Menu } from "antd";
import {
  ScheduleOutlined,
  AppstoreOutlined,
  BookOutlined,
  AuditOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props.callbackFromParent("we");
    this.state = {
      current: "we",
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    this.props.callbackFromParent(e.key);
  };

  handlePermissions = () => {
    switch (localStorage.getItem("type")) {
      case "1": //Administrador:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
            </Menu.Item>
            <Menu.Item key="au">
              <ScheduleOutlined />
              Admin. Usuarios
            </Menu.Item>
            <Menu.Item key="ap">
              <AppstoreOutlined />
              Admin. Programas
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
        );
      case "2": //Auxiliar
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
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
        );
      case "3": //Coordinador:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
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
        );
      case "4": //UAPA:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
            </Menu.Item>
            <Menu.Item key="au">
              <ScheduleOutlined />
              Admin. Usuarios
            </Menu.Item>
            <Menu.Item key="ap">
              <AppstoreOutlined />
              Admin. Programas
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
        );
      case "5": //Dependencia
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
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
        );
      default:
        return (
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="we">
              <HomeOutlined />
              Home
            </Menu.Item>
          </Menu>
        );
    }
  };

  render() {
    return this.handlePermissions();
  }
}

export default withRouter(MainMenu);
