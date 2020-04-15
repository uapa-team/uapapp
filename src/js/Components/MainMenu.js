import React from "react";
import { Menu } from 'antd';
import {
  ScheduleOutlined,
  AppstoreOutlined,
  BookOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { withRouter } from "react-router-dom";

class MainMenu extends React.Component {
    state = {
        current: 'admin',
      };
    
      handleClick = e => {
        console.log('click ', e);
        this.setState({
          current: e.key,
        });
      }
    
    render() {
        return (
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="admin">
          <ScheduleOutlined />
            Administración
          </Menu.Item>
          <Menu.Item key="adminpro">
            <AppstoreOutlined />
            Administración - Programas
          </Menu.Item>
            <Menu.Item key="generate">
            <AuditOutlined />          
            Generar Reporte
          </Menu.Item>
          <Menu.Item key="format">
            <BookOutlined />
            Formato Recolección
          </Menu.Item>
        </Menu>
        );
    }
}

export default withRouter(MainMenu);