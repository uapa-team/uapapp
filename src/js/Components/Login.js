import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Form, Typography } from "antd";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";

const { Title, Text } = Typography;

class NormalLoginForm extends React.Component {
  onFinish = (values) => {
    this.performLogin();
    console.log(values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  performLogin = () => {
    localStorage.setItem("jwt", "un_token_cualquiera");
    window.location.reload();
  };

  render() {
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
              <div className="login-welcome">
                <Title>Bienvenido a UAPApp</Title>
                <Text>
                  Para continuar, por favor ingrese su usuario y contraseña.
                </Text>
              </div>
              <Form
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                className="login-form"
                initialValues={{
                  remember: true,
                }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese su usuario.",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Usuario SIA"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese su contraseña.",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Contraseña"
                  />
                </Form.Item>
                <Form.Item name="remember" className="login-form-remember">
                  <Checkbox defaultChecked={true}>Recuérdame</Checkbox>
                </Form.Item>
                <a
                  className="login-form-forgot"
                  href="https://cuenta.unal.edu.co/index.php?p=recoverPassword"
                >
                  Olvidé mi contraseña
                </a>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Ingresar
                  </Button>
                  <div className="login-form-contact">
                    ¿No tiene un usuario? - <a href="/contact">Contáctenos</a>
                  </div>
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

export default withRouter(NormalLoginForm);
