import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button, Typography, TreeSelect, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Option } = Select;
const { Title } = Typography;

class GenerateReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelsOptions: [],
      reportOptions: [],
      selectedReport: undefined,
      selectedLevel: undefined,
      selectedPrograms: [],
      selectedPeriods: [],
      programsAvailable: [],
      periodsAvailable: [],
      rutasBack: {},
    };
  }

  componentDidMount() {
    Backend.sendRequest("GET", "reports_info").then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      let routesRecieved = {};
      for (let i = 0; i < res.length; i++) {
        routesRecieved[res[i].data["report_name"]] = res[i].data["ruta_back"];
        console.log(routesRecieved);
        loadedOptions.push(
          <Option key={res[i].data["report_name"]}>
            {res[i].data["report_name"]}
          </Option>
        );
      }
      this.setState({
        reportOptions: loadedOptions,
        rutasBack: routesRecieved,
      });
    });

    Backend.sendRequest("POST", "FR_levels", {
      username: localStorage.getItem("username"),
    }).then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      for (let i = 0; i < res.length; i++) {
        loadedOptions.push(<Option key={res[i]}>{res[i]}</Option>);
      }
      this.setState({
        levelsOptions: loadedOptions,
      });
    });
  }

  onFinish = (values) => {
    const key = "updatable";
    message.loading({ content: "Descargando reporte...", key });
    console.log("Post enviado con: " + this.state.rutasBack[values.report]);
    Backend.sendRequest("POST", this.state.rutasBack[values.report], {
      periodos: values["periods"],
      programas: values["programs"],
    }).then(async (response) => {
      await response.json();
      if (response.status === 200) {
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

  handleChangeLevel = (value) => {
    if (value !== undefined) {
      Backend.sendRequest("POST", "app_user_programs_levels", {
        level: value,
        username: localStorage.getItem("username"),
      }).then(async (response) => {
        let res = await response.json();
        let loadedPrograms = [];
        for (let i = 0; i < res.length; i++) {
          let program = {
            title: res[i].data["programa"],
            value: res[i].data["programa"],
            key: res[i].data["programa"],
          };
          loadedPrograms.push(program);
        }
        this.setState({
          selectedLevel: value,
          programsAvailable: loadedPrograms,
        });
      });
    }
  };

  handleChangeReport = (value) => {
    if (value !== undefined) {
      Backend.sendRequest("POST", "reports_periods", {
        report_name: value,
      }).then(async (response) => {
        let res = await response.json();
        let loadedPeriods = [];
        for (let i = 0; i < res.length; i++) {
          let period = {
            title: res[i].data["periodo"],
            value: res[i].data["periodo"],
            key: res[i].data["periodo"],
          };
          loadedPeriods.push(period);
        }
        this.setState({
          selectedReport: value,
          periodsAvailable: loadedPeriods,
        });
      });
    }
  };

  onChangePrograms = (value) => {
    this.setState({ selectedPrograms: value });
  };

  onChangePeriod = (value) => {
    this.setState({ selectedPeriods: value });
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
              onChange={this.handleChangeLevel}
            >
              {this.state.levelsOptions}
            </Select>
          </Form.Item>
          <Form.Item
            name="report"
            label="Reporte"
            className="generate-report-formitem"
          >
            <Select
              placeholder="Seleccione el reporte"
              onChange={this.handleChangeReport}
            >
              {this.state.reportOptions}
            </Select>
          </Form.Item>
          <Form.Item
            name="periods"
            label="Periodo"
            className="generate-report-formitem"
          >
            <TreeSelect
              treeData={this.state.periodsAvailable}
              value={this.state.periodsSelected}
              placeholder="Seleccione el periodo"
              treeCheckable={true}
              onChange={this.onChangePeriod}
              disabled={
                this.state.selectedLevel === undefined &&
                this.state.selectedReport === undefined
              }
            ></TreeSelect>
          </Form.Item>
          <Form.Item
            name="programs"
            label="Programa"
            className="generate-report-formitem"
          >
            <TreeSelect
              treeData={this.state.programsAvailable}
              value={this.state.programsSelected}
              placeholder="Seleccione el programa"
              treeCheckable={true}
              onChange={this.onChangePrograms}
              showCheckedStrategy={"SHOW_PARENT"}
              disabled={
                this.state.selectedLevel === undefined &&
                this.state.selectedReport === undefined
              }
            ></TreeSelect>
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
