import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button, Radio, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

class RecFormat extends React.Component {
  render() {
    return (
      <div>
        <div className="rec-format-div">
          <Title level={2}>Formatos de recolección</Title>
        </div>
        <Form onFinish={this.onFinish} layout="vertical">
          <Form.Item className="rec-format-formitem">
            <Radio.Group
              defaultValue="Duda"
              onChange={this.handleFormLayoutChange}
              className="rec-format-radiogroup"
            >
              <Radio.Button value="Descripción" className="rec-format-radio">
                Descripción
              </Radio.Button>
              <Radio.Button value="Carga" className="rec-format-radio">
                Carga
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
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
