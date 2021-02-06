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
      infoReports: {},
    };
  }

  componentDidMount() {
    let levels = [
      <Option key={"Pregrado"}>Pregrado</Option>,
      <Option key={"Posgrado"}>Posgrado</Option>,
    ];

    this.setState({
      levelsOptions: levels,
    });

    Backend.sendRequest("GET", "reports").then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      let info = {};
      for (var report in res) {
        info[report] = res[report];
        loadedOptions.push(<Option key={report}>{report}</Option>);
      }

      this.setState({
        reportOptions: loadedOptions,
        infoReports: info,
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

    Backend.sendRequest(
      "POST",
      "report/".concat(this.state.infoReports[values["report"]].code),
      {
        periods: periods,
        programs: programs,
      }
    )
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
          ".xlsx";
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
    let extension = value === "Pregrado" ? "PRE" : "POS";
    Backend.sendRequest("GET", "programs?level=".concat(extension)).then(
      async (response) => {
        let res = await response.json();
        let loadedPrograms = [
          {
            title: "Todos los disponibles",
            value: "all",
            key: "all",
            children: [],
          },
        ];

        for (let i = 0; i < res["Programs"].length; i++) {
          let r_program = res["Programs"][i];
          let program = {
            title: r_program[1],
            value: r_program[0],
            key: r_program[0],
          };
          loadedPrograms[0].children.push(program);
        }

        this.setState({
          selectedLevel: value,
          programsAvailable: loadedPrograms,
        });
      }
    );

    this.formRef.current.setFieldsValue({
      report: undefined,
      periods: undefined,
      programs: undefined,
    });
  };

  handleChangeReport = (value) => {
    let loadedPeriods = [
      {
        title: "Todos los disponibles",
        value: "all",
        key: "all",
        children: [],
      },
    ];

    if (this.state.infoReports[value].periods.length > 1) {
      for (let i = 0; i < this.state.infoReports[value].periods.length; i++) {
        let r_period = this.state.infoReports[value].periods[i];
        let period = {
          title: r_period[1],
          value: r_period[0],
          key: r_period[0],
        };
        loadedPeriods[0].children.push(period);
      }
    }

    this.setState({
      selectedReport: value,
      periodsAvailable: loadedPeriods,
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
