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
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Option } = Select;
const { Title } = Typography;

class RecFormat extends React.Component {
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
        recievedPrograms: loadedPrograms,
      });
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
  };

  handleChangeSubformat = (value) => {
    Backend.sendRequest("POST", "FR_periods", {
      username: localStorage.getItem("username"),
      level: this.state.selectedLevel,
      format: this.state.selectedFormat,
      sub_format: value,
    }).then(async (response) => {
      let res = await response.json();
      console.log(res);
      let loadedPeriods = [];
      for (let i = 0; i < res.length; i++) {
        let period = {
          title: res[i],
          value: res[i],
          key: res[i],
        };
        loadedPeriods.push(period);
      }
      this.setState({
        recievedPeriods: loadedPeriods,
        selectedSubformat: value,
      });
    });
  };

  handleChangePeriod = (value) => {
    this.setState({ selectedPeriods: value });
  };

  handleChangeProgram = (value) => {
    this.setState({ selectedPrograms: value });
  };

  onFinish = (values) => {
    console.log(values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <div>
        <div className="rec-format-div">
          <Title level={2}>Formatos de recolección</Title>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Form
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              layout="vertical"
            >
              <Form.Item label="Nivel" className="rec-format-formitem">
                <Select
                  placeholder="Seleccione el nivel"
                  onChange={this.handleChangeLevel}
                >
                  {this.state.recievedLevels}
                </Select>
              </Form.Item>
              <Form.Item label="Formato" className="rec-format-formitem">
                <Select
                  placeholder="Seleccione el formato"
                  onChange={this.handleChangeFormat}
                  disabled={this.state.selectedLevel === undefined}
                >
                  {this.state.recievedFormats}
                </Select>
              </Form.Item>
              <Form.Item label="Sub-formato" className="rec-format-formitem">
                <Select
                  placeholder="Seleccione el sub-formato"
                  onChange={this.handleChangeSubformat}
                  disabled={this.state.selectedFormat === undefined}
                >
                  {this.state.recievedSubformats}
                </Select>
              </Form.Item>
              <Form.Item label="Periodo" className="rec-format-formitem">
                <TreeSelect
                  treeData={this.state.recievedPeriods}
                  value={this.state.selectedPeriods}
                  placeholder="Seleccione el periodo"
                  treeCheckable={true}
                  onChange={this.handleChangePeriod}
                  disabled={this.state.selectedSubformat === undefined}
                ></TreeSelect>
              </Form.Item>
              <Form.Item label="Programa" className="rec-format-formitem">
                <TreeSelect
                  treeData={this.state.recievedPrograms}
                  value={this.state.selectedPrograms}
                  placeholder="Seleccione el programa"
                  treeCheckable={true}
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
          </Col>
          <Col span={12}>
            <Form layout="vertical">
              <Form.Item label="Tutoriales">
                <Radio.Group
                  onChange={this.handleFormLayoutChange}
                  className="rec-format-radiogroup"
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
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(RecFormat);
