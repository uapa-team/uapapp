import React from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  Select,
  Button,
  Radio,
  Typography,
  Col,
  Row,
  TreeSelect,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";
import ReactPlayer from "react-player";

const { Option } = Select;
const { Title } = Typography;

class RecFormat extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      recievedLevels: null,
      recievedFormats: null,
      recievedSubformats: null,
      recievedPeriods: null,
      recievedPrograms: null,
      selectedLevel: undefined,
      selectedFormat: undefined,
      selectedSubformat: undefined,
      selectedPeriods: undefined,
      selectedPrograms: undefined,
      formatName: undefined,
      whichVideo: "Descripción",
      youtubeURLDes: undefined,
      youtubeURLCar: undefined,
    };
  }

  componentDidMount() {
    Backend.sendRequest("POST", "FR_levels", {
      username: localStorage.getItem("username"),
    }).then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      for (let i = 0; i < res.length; i++) {
        loadedOptions.push(<Option key={res[i]}>{res[i]}</Option>);
      }
      this.setState({
        recievedLevels: loadedOptions,
      });
    });
  }

  handleChangeLevel = (value) => {
    Backend.sendRequest("POST", "FR_formats", {
      username: localStorage.getItem("username"),
      level: value,
    }).then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      for (let i = 0; i < res.length; i++) {
        loadedOptions.push(<Option key={res[i]}>{res[i]}</Option>);
      }
      this.setState({
        recievedFormats: loadedOptions,
        selectedLevel: value,
      });
    });

    Backend.sendRequest("POST", "app_user_programs_levels", {
      username: localStorage.getItem("username"),
      level: value,
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
        recievedPrograms: loadedPrograms,
      });
    });

    this.formRef.current.setFieldsValue({
      format: undefined,
      subformat: undefined,
      periods: undefined,
      programs: undefined,
    });
  };

  handleChangeFormat = (value) => {
    Backend.sendRequest("POST", "FR_sub_formats", {
      username: localStorage.getItem("username"),
      level: this.state.selectedLevel,
      format: value,
    }).then(async (response) => {
      let res = await response.json();
      let loadedOptions = [];
      for (let i = 0; i < res.length; i++) {
        loadedOptions.push(<Option key={res[i]}>{res[i]}</Option>);
      }
      this.setState({
        recievedSubformats: loadedOptions,
        selectedFormat: value,
      });
    });

    this.formRef.current.setFieldsValue({
      subformat: undefined,
      periods: undefined,
    });
  };

  handleChangeSubformat = (value) => {
    Backend.sendRequest("POST", "FR_periods", {
      username: localStorage.getItem("username"),
      level: this.state.selectedLevel,
      format: this.state.selectedFormat,
      sub_format: value,
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
          title: res[i],
          value: res[i],
          key: res[i],
        };
        loadedPeriods[0].children.push(period);
      }

      this.setState({
        recievedPeriods: loadedPeriods,
        selectedSubformat: value,
      });

      this.formRef.current.setFieldsValue({
        periods: undefined,
      });
    });

    Backend.sendRequest("POST", "FR_names", {
      username: localStorage.getItem("username"),
      format: this.state.selectedFormat,
      sub_format: value,
    }).then(async (response) => {
      let res = await response.json();
      this.setState({
        formatName: res,
      });

      Backend.sendRequest("POST", "get_video_url", {
        recname: res[0],
      }).then(async (response) => {
        let res = await response.json();
        if (res.length !== 0) {
          this.setState({
            youtubeURLCar: res[0].data.url_video_cargue,
            youtubeURLDes: res[0].data.url_video_descripcion,
          });
        } else {
          this.setState({
            youtubeURLCar: "XhyjiFEB5TY",
            youtubeURLDes: "XhyjiFEB5TY",
          });
        }
      });
    });
  };

  handleChangePeriod = (value) => {
    this.setState({ selectedPeriods: value });
  };

  handleChangeProgram = (value) => {
    this.setState({ selectedPrograms: value });
  };

  handleChangeVideo = (value) => {
    this.setState({ whichVideo: value.target.value });
  };

  onFinish = (values) => {
    const key = "updatable";
    message.loading({ content: "Obteniendo formato...", key });

    let periods = [];

    if (values["periods"].includes("all")) {
      this.state.recievedPeriods[0].children.forEach((element) => {
        periods = periods.concat(element["key"]);
      });
      periods = Array.from(new Set(periods));
    } else {
      periods = values["periods"];
    }

    let programs = [];

    if (values["programs"].includes("all")) {
      this.state.recievedPrograms[0].children.forEach((element) => {
        programs = programs.concat(element["key"]);
      });
      programs = Array.from(new Set(programs));
    } else {
      programs = values["programs"];
    }

    Backend.sendRequest("POST", this.state.formatName, {
      periodos: periods,
      programas: programs,
    })
      .then(async (response) => {
        if (response.status === 200) {
          message.success({ content: "Formato obtenido correctamente.", key });
          return response.blob();
        } else {
          message.error({
            content:
              "Ha ocurrido un error obteniendo el formato. Por favor contáctenos.",
            key,
          });
          return null;
        }
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const a = this.linkRef.current;
        a.download =
          "Formato " +
          this.state.selectedSubformat +
          " " +
          this.state.selectedLevel +
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

  renderForm = () => {
    let form = (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
        layout="vertical"
      >
        <Form.Item name="level" label="Nivel" className="rec-format-formitem">
          <Select
            className="select-props"
            placeholder="Seleccione el nivel"
            onChange={this.handleChangeLevel}
          >
            {this.state.recievedLevels}
          </Select>
        </Form.Item>
        <Form.Item
          name="format"
          label="Formato"
          className="rec-format-formitem"
        >
          <Select
            className="select-props"
            placeholder="Seleccione el formato"
            onChange={this.handleChangeFormat}
            disabled={this.state.selectedLevel === undefined}
          >
            {this.state.recievedFormats}
          </Select>
        </Form.Item>
        <Form.Item
          name="subformat"
          label="Sub-formato"
          className="rec-format-formitem"
        >
          <Select
            className="select-props"
            placeholder="Seleccione el sub-formato"
            onChange={this.handleChangeSubformat}
            disabled={this.state.selectedFormat === undefined}
          >
            {this.state.recievedSubformats}
          </Select>
        </Form.Item>
        <Form.Item
          name="periods"
          label="Periodo"
          className="rec-format-formitem"
        >
          <TreeSelect
            treeData={this.state.recievedPeriods}
            value={this.state.selectedPeriods}
            placeholder="Seleccione el periodo"
            treeCheckable={true}
            treeDefaultExpandAll={true}
            showCheckedStrategy={"SHOW_PARENT"}
            onChange={this.handleChangePeriod}
            disabled={this.state.selectedSubformat === undefined}
          ></TreeSelect>
        </Form.Item>
        <Form.Item
          name="programs"
          label="Programa"
          className="rec-format-formitem"
        >
          <TreeSelect
            treeData={this.state.recievedPrograms}
            value={this.state.selectedPrograms}
            placeholder="Seleccione el programa"
            treeCheckable={true}
            treeDefaultExpandAll={true}
            showCheckedStrategy={"SHOW_PARENT"}
            onChange={this.handleChangeProgram}
            disabled={this.state.selectedPeriods === undefined}
          ></TreeSelect>
        </Form.Item>
        <Form.Item className="rec-format-formitem-button">
          <Button block type="primary" htmlType="submit">
            <DownloadOutlined />
            Descargar
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
        <div className="rec-format-div">
          <Title level={2}>Formatos de recolección</Title>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            {this.renderForm()}
            <a href="null" ref={this.linkRef} style={{ visibility: "hidden" }}>
              .
            </a>
          </Col>
          <Col span={12}>
            <Form layout="vertical">
              <Form.Item label="Tutoriales">
                <Radio.Group
                  onChange={this.handleChangeVideo}
                  className="rec-format-radiogroup"
                  defaultValue="Descripción"
                  value={this.state.whichVideo}
                >
                  <Radio.Button
                    value="Descripción"
                    className="rec-format-radio"
                  >
                    Descripción
                  </Radio.Button>
                  <Radio.Button value="Carga" className="rec-format-radio">
                    Carga
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              {this.state.youtubeURLDes !== undefined ? (
                <div className="rec-format-video">
                  <div className="player-wrapper">
                    {this.state.whichVideo === "Descripción" ? (
                      <ReactPlayer
                        url={
                          "https://www.youtube.com/watch?v=" +
                          this.state.youtubeURLDes
                        }
                        controls
                        width="100%"
                        height="100%"
                        className="react-player"
                      />
                    ) : (
                      <ReactPlayer
                        url={
                          "https://www.youtube.com/watch?v=" +
                          this.state.youtubeURLCar
                        }
                        controls
                        width="100%"
                        height="100%"
                        className="react-player"
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(RecFormat);
