import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

class RecFormat extends React.Component {
  render() {
    return (
      <div>
        <div className="rec-format-div">
          <h2>Formato de recolección</h2>
        </div>
        <Form onFinish={this.onFinish} layout="vertical">
          <Form.Item label="Nivel" className="rec-format-formitem">
            <Select
              placeholder="Seleccione el nivel"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Formato" className="rec-format-formitem">
            <Select
              placeholder="Seleccione el formato"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Sub-formato" className="rec-format-formitem">
            <Select
              placeholder="Seleccione el sub-formato"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Periodo" className="rec-format-formitem">
            <Select
              placeholder="Seleccione el periodo"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Programa" className="rec-format-formitem">
            <Select
              placeholder="Seleccione el programa"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item className="rec-format-formitem-button">
            <Button block type="primary" htmlType="submit">
              <DownloadOutlined />
              Descargar
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(RecFormat);
