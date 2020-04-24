import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Form, Typography } from "antd";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";

const { Title, Text } = Typography;

class NormalLoginForm extends React.Component {
  onFinish = (values) => {
    this.performLogin();
  };

  performLogin = () => {
    localStorage.setItem("jwt", "un_token_cualquiera");
    this.props.history.push("/home");
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
              <Form onFinish={this.onFinish} className="login-form">
                <Form.Item
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
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese su contraseña.",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="Contraseña"
                  />
                </Form.Item>
                <Form.Item>
                  <Checkbox defaultChecked={true}>Recuérdame</Checkbox>
                  <a
                    className="login-form-forgot"
                    href="https://cuenta.unal.edu.co/index.php?p=recoverPassword"
                  >
                    Olvidé mi contraseña
                  </a>
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
