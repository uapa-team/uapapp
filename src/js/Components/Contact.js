import React from "react";
import { Form, Icon, Input, Button, Radio } from "antd";
import { Row, Col } from "antd";

import { withRouter } from "react-router-dom";

const { TextArea } = Input;

class Contact extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  state = {
    value: ""
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { value } = this.state;
    return (
      <Row className="contact-general">
        <Col xs={4} sm={4} md={6} lg={6} xl={6}></Col>
        <Col xs={16} sm={16} md={12} lg={12} xl={12}>
          <div className="contact-welcome">
            <h1>Contáctenos</h1>
          </div>

          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Nombre completo">
              {getFieldDecorator("nombre", {
                rules: [
                  { required: true, message: "Por favor ingrese su nombre." }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="smile" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Escriba su nombre completo"
                />
              )}
            </Form.Item>

            <Form.Item label="Correo electrónico">
              {getFieldDecorator("correo", {
                rules: [
                  {
                    required: true,
                    message: "Por favor ingrese su correo electrónico."
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Escriba su dirección de correo electrónico"
                />
              )}
            </Form.Item>

            <Form.Item label="Tipo de mensaje">
              <Radio.Group
                defaultValue="Duda"
                onChange={this.handleFormLayoutChange}
              >
                <Radio.Button value="Duda">Duda</Radio.Button>
                <Radio.Button value="Sugerencia">Sugerencia</Radio.Button>
                <Radio.Button value="Petición">Petición</Radio.Button>
                <Radio.Button value="Queja">Queja</Radio.Button>
                <Radio.Button value="Reclamo">Reclamo</Radio.Button>
                <Radio.Button value="Otro">Otro</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("mensaje", {
                rules: [
                  { required: true, message: "Por favor ingrese su mensaje." }
                ]
              })(
                <TextArea
                  value={value}
                  onChange={this.onChange}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  placeholder="Escriba aquí su mensaje"
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={4} sm={4} md={6} lg={6} xl={6}></Col>
      </Row>
    );
  }
}

const WrappedContact = Form.create({ name: "contact" })(Contact);

export default withRouter(Form.create()(WrappedContact));
