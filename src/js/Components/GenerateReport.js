import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

class GenerateReport extends React.Component {
  onFinish = (values) => {
    console.log(values);
  };

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  render() {
    return (
      <div>
        <div className="generate-report-div">
          <h2>Generador de reportes</h2>
        </div>
        <Form onFinish={this.onFinish} layout="vertical">
          <Form.Item label="Nivel" className="generate-report-formitem">
            <Select
              placeholder="Seleccione el nivel"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Reporte" className="generate-report-formitem">
            <Select
              placeholder="Seleccione el reporte"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Periodo" className="generate-report-formitem">
            <Select
              placeholder="Seleccione el periodo"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Programa" className="generate-report-formitem">
            <Select
              placeholder="Seleccione el programa"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item className="generate-report-formitem-button">
            <Button block type="primary" htmlType="submit">
              <DownloadOutlined /> Descargar
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(GenerateReport);
