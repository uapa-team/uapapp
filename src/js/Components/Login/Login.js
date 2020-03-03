import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Row, Col } from 'antd';

import { withRouter } from "react-router-dom"
import auth from "../../../auth"

import "./Login.css";
import "antd/dist/antd.css";

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        
        auth.login(() => {
          console.log(this.props)
          this.props.history.push('/home');
        })

      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      <div className="breadcrumb-class">
      Está en:
      <a href="/" target="_self" title="Inicio">
        Inicio
      </a>
    </div>

      <Row>
      <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
      <Col xs={16} sm={16} md={12} lg={8} xl={8}>
      <div className="login-general">
      <div className="login-welcome"><h1>¡Bienvenido a UAPApp!</h1></div>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Por favor inserte su usuario.' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Usuario SIA"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Por favor inserte su contraseña.' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Contraseña"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {
          getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,           
          }, '')(<Checkbox>Recuérdame</Checkbox>)}
          <a className="login-form-forgot" href="https://cuenta.unal.edu.co/index.php?p=recoverPassword">
            Olvidé mi contraseña
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Ingresar
          </Button>
          ¿No tiene un usuario? - <a href='/contact'>Contáctenos</a>
        </Form.Item>
      </Form>
      </div>
      </Col>
      <Col xs={4} sm={4} md={6} lg={8} xl={8}></Col>
    </Row>
    </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default withRouter(Form.create()(WrappedNormalLoginForm));
