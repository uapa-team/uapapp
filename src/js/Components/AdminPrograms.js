import React from "react";
import { withRouter } from "react-router-dom";
import { TreeSelect, Radio, Typography } from "antd";
import AdminProgramsProfes from "./AdminProgramsProfes";
import AdminProgramsAsigna from "./AdminProgramsAsigna";
import AdminProgramsGrupos from "./AdminProgramsGrupos";
import Backend from "../Basics/Backend";

const { TreeNode } = TreeSelect;
const { Title, Text } = Typography;

class AdminPrograms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      programsPre: [],
      programsPos: [],
      programsFound: true, //Variable según si se encuentran programas asignados.
      visibleMenu: false,
      visibleProfes: false,
      visibleAsigna: false,
      visibleGrupos: false,
      visibleModalProfes: false,
      visibleModalAsigna: false,
      visibleModalGrupos: false,
    };
  }

  onChangeSelect = (value) => {
    console.log(value);
    if (value !== undefined) {
      this.setState({ visibleMenu: true });
    } else {
      this.setState({ visibleMenu: false });
    }
    this.setState({ value });
  };

  displayAdminProgram = (e) => {
    if (e.target.value === "Profesores") {
      this.setState({
        visibleProfes: true,
        visibleAsigna: false,
        visibleGrupos: false,
      });
    } else if (e.target.value === "Asignaturas") {
      this.setState({
        visibleProfes: false,
        visibleAsigna: true,
        visibleGrupos: false,
      });
    } else if (e.target.value === "Grupos") {
      this.setState({
        visibleProfes: false,
        visibleAsigna: false,
        visibleGrupos: true,
      });
    }
  };

  componentDidMount() {
    Backend.sendRequest("POST", "app_user_programs", {
      username: localStorage.getItem("username"),
    }).then(async (response) => {
      let res = await response.json();
      let preProgRec = [];
      let posProgRec = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].data["cod_nivel"] !== 1) {
          posProgRec.push(
            <TreeNode
              value={res[i].data["programa"]}
              title={
                res[i].data["cod_programa"] + " - " + res[i].data["programa"]
              }
            ></TreeNode>
          );
        } else {
          preProgRec.push(
            <TreeNode
              value={res[i].data["programa"]}
              title={
                res[i].data["cod_programa"] + " - " + res[i].data["programa"]
              }
            ></TreeNode>
          );
          console.log(preProgRec);
        }
      }
      if (preProgRec.length === 0 && posProgRec.length === 0) {
        this.setState({
          programsFound: false,
        });
      } else {
        this.setState({
          programsPre: preProgRec,
          programsPos: posProgRec,
        });
      }
    });
  }

  render() {
    return !this.state.programsFound ? (
      <div className="admin-programs-not-found-div">
        <div className="admin-programs-title-div">
          <Title level={2}>Administración de programas</Title>
        </div>
        <Text>
          No se le ha asignado ningún programa. Contacte a un administrador si
          considera que es un error.
        </Text>
      </div>
    ) : (
      <div>
        <div className="admin-programs-title-div">
          <Title level={2}>Administración de programas</Title>
        </div>
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Por favor busque o seleccione un programa."
          allowClear
          treeDefaultExpandAll
          onChange={this.onChangeSelect}
        >
          <TreeNode selectable={false} value="Pregrado" title="Pregrado">
            {this.state.programsPre}
          </TreeNode>
          <TreeNode selectable={false} value="Posgrado" title="Posgrado">
            {this.state.programsPos}
          </TreeNode>
        </TreeSelect>

        {this.state.visibleMenu ? (
          <div className="admin-programs-below-select">
            <Radio.Group
              onChange={this.displayAdminProgram}
              className="admin-programs-radio-container"
            >
              <Radio.Button
                className="admin-programs-radio-buttons"
                value="Profesores"
              >
                Profesores
              </Radio.Button>
              <Radio.Button
                className="admin-programs-radio-buttons"
                value="Asignaturas"
              >
                Asignaturas
              </Radio.Button>
              <Radio.Button
                className="admin-programs-radio-buttons"
                value="Grupos"
              >
                Grupos de Investigación
              </Radio.Button>
            </Radio.Group>
            {this.state.visibleProfes ? <AdminProgramsProfes /> : null}
            {this.state.visibleAsigna ? <AdminProgramsAsigna /> : null}
            {this.state.visibleGrupos ? <AdminProgramsGrupos /> : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(AdminPrograms);
