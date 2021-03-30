import React from "react";
import { Menu } from "antd";
import {
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
      case "Administrador": //Administrador:
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
      case "Auxiliar": //Auxiliar
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
      case "Coordinador": //Coordinador:
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
      case "UAPA": //UAPA:
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
      case "Dependencia": //Dependencia
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
