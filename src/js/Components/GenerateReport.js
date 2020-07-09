import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Select, Button, Typography, TreeSelect, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Option } = Select;
const { Title } = Typography;

class GenerateReport extends React.Component {
  formRef = React.createRef();

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

    let periods = [];

    if (values["periods"].includes("all")) {
      this.state.periodsAvailable[0].children.forEach((element) => {
        periods = periods.concat(element["key"]);
      });
      periods = Array.from(new Set(periods));
    } else {
      periods = values["periods"];
    }

    let programs = [];

    if (values["programs"].includes("all")) {
      this.state.programsAvailable[0].children.forEach((element) => {
        programs = programs.concat(element["key"]);
      });
      programs = Array.from(new Set(programs));
    } else {
      programs = values["programs"];
    }

    Backend.sendRequest("POST", this.state.rutasBack[values.report], {
      periodos: periods,
      programas: programs,
    })
      .then(async (response) => {
        if (response.status === 200) {
          message.success({ content: "Reporte creado correctamente.", key });
          return response.blob();
        } else {
          message.error({
            content:
              "Ha ocurrido un error creando el reporte. Por favor contáctenos.",
            key,
          });
          return null;
        }
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const a = this.linkRef.current;
        a.download =
          "reporte" +
          this.state.selectedLevel +
          this.state.selectedReport +
          ".xls";
        a.href = href;
        a.click();
        a.href = "";
      })
      .catch((err) => console.error(err));
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleChangeLevel = (value) => {
    Backend.sendRequest("POST", "app_user_programs_levels", {
      level: value,
      username: localStorage.getItem("username"),
    }).then(async (response) => {
      let res = await response.json();
      let loadedPrograms = [
        {
          title: "Todos los disponibles",
          value: "all",
          key: "all",
          children: [],
        },
      ];

      for (let i = 0; i < res.length; i++) {
        let program = {
          title: res[i].data["programa"],
          value: res[i].data["programa"],
          key: res[i].data["programa"],
        };
        loadedPrograms[0].children.push(program);
      }

      this.setState({
        selectedLevel: value,
        programsAvailable: loadedPrograms,
      });
    });

    this.formRef.current.setFieldsValue({
      report: undefined,
      periods: undefined,
      programs: undefined,
    });
  };

  handleChangeReport = (value) => {
    Backend.sendRequest("POST", "reports_periods", {
      report_name: value,
    }).then(async (response) => {
      let res = await response.json();
      let loadedPeriods = [
        {
          title: "Todos los disponibles",
          value: "all",
          key: "all",
          children: [],
        },
      ];

      for (let i = 0; i < res.length; i++) {
        let period = {
          title: res[i].data["periodo"],
          value: res[i].data["periodo"],
          key: res[i].data["periodo"],
        };
        loadedPeriods[0].children.push(period);
      }

      this.setState({
        selectedReport: value,
        periodsAvailable: loadedPeriods,
      });
    });

    this.formRef.current.setFieldsValue({
      periods: undefined,
    });
  };

  onChangePrograms = (value) => {
    this.setState({ selectedPrograms: value });
  };

  onChangePeriod = (value) => {
    this.setState({ selectedPeriods: value });
  };

  renderForm = () => {
    let form = (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="level"
          label="Nivel"
          className="generate-report-formitem"
          rules={[
            {
              required: true,
              message: "Por favor seleccione un nivel.",
            },
          ]}
        >
          <Select
            className="select-props"
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
          rules={[
            {
              required: true,
              message: "Por favor seleccione un reporte.",
            },
          ]}
        >
          <Select
            className="select-props"
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
          rules={[
            {
              required: true,
              message: "Por favor seleccione uno o varios periodos.",
            },
          ]}
        >
          <TreeSelect
            treeData={this.state.periodsAvailable}
            value={this.state.selectedPeriods}
            placeholder="Seleccione el periodo"
            treeCheckable={true}
            treeDefaultExpandAll={true}
            showCheckedStrategy={"SHOW_PARENT"}
            onChange={this.onChangePeriod}
            disabled={
              this.state.selectedLevel === undefined ||
              this.state.selectedReport === undefined
            }
          ></TreeSelect>
        </Form.Item>
        <Form.Item
          name="programs"
          label="Programa"
          className="generate-report-formitem"
          rules={[
            {
              required: true,
              message: "Por favor seleccione uno o varios programas.",
            },
          ]}
        >
          <TreeSelect
            treeData={this.state.programsAvailable}
            value={this.state.selectedPrograms}
            placeholder="Seleccione el programa"
            treeCheckable={true}
            treeDefaultExpandAll={true}
            onChange={this.onChangePrograms}
            showCheckedStrategy={"SHOW_PARENT"}
            disabled={
              this.state.selectedLevel === undefined ||
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
    );
    return form;
  };

  linkRef = React.createRef();

  render() {
    return (
      <div>
        <div className="generate-report-div">
          <Title level={2}>Generador de reportes</Title>
        </div>
        {this.renderForm()}
        <a href="null" ref={this.linkRef} style={{ visibility: "hidden" }}>
          .
        </a>
      </div>
    );
  }
}

export default withRouter(GenerateReport);
