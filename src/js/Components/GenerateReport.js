import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button, Typography, TreeSelect, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Option } = Select;
const { Title } = Typography;

const periods = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
  },
];

const programs = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-0",
        key: "0-0-0",
      },
    ],
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        key: "0-1-0",
      },
    ],
  },
];

class GenerateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programsSelected: [],
      periodsSelected: [],
    };
  }

  onFinish = (values) => {
    const key = "updatable";
    message.loading({ content: "Descargando reporte...", key });
    Backend.sendRequest("POST", values.report, {
      periodos: values["periods"],
      programas: values["programs"],
    }).then(async (response) => {
      let res = await response.json();
      if (res.status === 200) {
        message.success({ content: "Reporte creado correctamente.", key });
      } else {
        message.error({
          content:
            "Ha ocurrido un error creando el reporte. Por favor contáctenos.",
          key,
        });
      }
    });
  };

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  onChangePrograms = (value) => {
    console.log("onChangePre ", value);
    this.setState({ programsSelected: value });
  };

  onChangePeriod = (value) => {
    console.log("onChangePos ", value);
    this.setState({ periodsSelected: value });
  };

  render() {
    return (
      <div>
        <div className="generate-report-div">
          <Title level={2}>Generador de reportes</Title>
        </div>
        <Form onFinish={this.onFinish} layout="vertical">
          <Form.Item
            name="level"
            label="Nivel"
            className="generate-report-formitem"
          >
            <Select
              placeholder="Seleccione el nivel"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="report"
            label="Reporte"
            className="generate-report-formitem"
          >
            <Select
              placeholder="Seleccione el reporte"
              onChange={this.handleChange}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="periods"
            label="Periodo"
            className="generate-report-formitem"
          >
            <TreeSelect
              treeData={periods}
              value={this.state.periodsSelected}
              placeholder="Seleccione el periodo"
              treeCheckable={true}
              onChange={this.onChangePeriod}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </TreeSelect>
          </Form.Item>
          <Form.Item
            name="program"
            label="Programa"
            className="generate-report-formitem"
          >
            <TreeSelect
              treeData={programs}
              value={this.state.programsSelected}
              placeholder="Seleccione el programa"
              treeCheckable={true}
              onChange={this.onChangePrograms}
              showCheckedStrategy={"SHOW_PARENT"}
            >
              <Option value="pregrado">Pregrado</Option>
              <Option value="posgrado">Posgrado</Option>
            </TreeSelect>
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
