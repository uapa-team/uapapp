import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, Form, Typography, message } from "antd";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import Backend from "../Basics/Backend";

const { Title, Text } = Typography;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  onFinish = (values) => {
    console.log(values);
    this.performLogin(values);
  };

  performLogin = (values) => {
    const key = "updatable";
    message.loading({ content: "Iniciando sesión...", key });
    Backend.sendLogin(values.username, values.password)
      .then(async (response) => {
        let res = await response.json();
        if (res.status === 403) {
          message.error({ content: "Acceso restringido.", key });
        } else if (res.status === 404) {
          message.error({ content: "Contraseña incorrecta.", key });
        } else if (res.status === 200) {
          message.success({ content: "Inicio de sesión exitoso.", key });
          localStorage.setItem("jwt", res.user.data["auth_token"]);
          localStorage.setItem("type", res.user.data["role"]);
          window.location.reload();
        } else {
          message.error({
            content: "Error realizando el login.",
            key,
          });
          console.log("Login Error: Backend HTTP code " + res.status);
        }
      })
      .catch((error) => {
        message.error({
          content: "Error realizando el login.",
          key,
        });
        console.log("Login Error: " + error);
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  checkChanged = () => {
    this.setState({ checked: !this.state.checked });
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
                  <Checkbox
                    checked={this.state.checked}
                    onClick={this.checkChanged}
                  >
                    Recuérdame
                  </Checkbox>
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
