import React from "react";
import { withRouter } from "react-router-dom";
import { TreeSelect, Radio, Typography } from "antd";
import AdminProgramsProfes from "./AdminProgramsProfes";
import AdminProgramsAsigna from "./AdminProgramsAsigna";
import AdminProgramsGrupos from "./AdminProgramsGrupos";
import Backend from "../Basics/Backend";
import { filterTreeNode } from "../Basics/Backend";

const { TreeNode } = TreeSelect;
const { Title, Text } = Typography;

class AdminPrograms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programSelected: undefined,
      programsPre: [],
      programsPos: [],
      programsFound: true, //Variable según si se encuentran programas asignados.
      visibleMenu: false,
      selectedAdminCategory: undefined,
      visibleProfes: false,
      visibleAsigna: false,
      visibleGrupos: false,
      recievedProfessors: [],
      recievedSubjects: [],
      recievedGroups: [],
    };
  }

  onChangeSelectProgram = (value) => {
    this.setState({ selectedAdminCategory: undefined });
    this.setState({
      visibleProfes: false,
      visibleAsigna: false,
      visibleGrupos: false,
    });
    if (value !== undefined) {
      this.setState({ visibleMenu: true });
    } else {
      this.setState({ visibleMenu: false });
    }
    this.setState({ programSelected: value });

    Backend.sendRequest("POST", "get_unique_program_professors", {
      cod_programa: value,
    }).then(async (response) => {
      let res = await response.json();
      this.setState({
        recievedProfessors: res,
      });
    });

    Backend.sendRequest("POST", "get_program_subjects", {
      cod_programa: value,
    }).then(async (response) => {
      let res = await response.json();
      this.setState({
        recievedSubjects: res,
      });
    });

    Backend.sendRequest("POST", "get_program_groups", {
      cod_programa: value,
    }).then(async (response) => {
      let res = await response.json();
      this.setState({
        recievedGroups: res,
      });
    });
  };

  displayAdminProgram = (e) => {
    this.setState({ selectedAdminCategory: e.target.value });
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
        // TO DO: Replace if(true) with the line below when request is updated.
        //if (res[i]["cod_nivel"] !== 1) {
        if (true) {
          posProgRec.push(
            <TreeNode
              key={res[i]["cod_programa"]}
              value={res[i]["cod_programa"]}
              title={res[i]["cod_programa"] + " - " + res[i]["programa"]}
            ></TreeNode>
          );
        } else {
          preProgRec.push(
            <TreeNode
              key={res[i]["cod_programa"]}
              value={res[i]["cod_programa"]}
              title={res[i]["cod_programa"] + " - " + res[i]["programa"]}
            ></TreeNode>
          );
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
          className="select-props"
          style={{ width: "100%" }}
          allowClear
          showSearch
          treeDefaultExpandAll
          defaultValue={undefined}
          value={this.state.programSelected}
          onChange={this.onChangeSelectProgram}
          filterTreeNode={filterTreeNode}
          placeholder="Por favor busque o seleccione un programa."
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
              value={this.state.selectedAdminCategory}
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
            {this.state.visibleProfes ? (
              <AdminProgramsProfes
                programa={this.state.programSelected}
                teachers={this.state.recievedProfessors}
              />
            ) : null}
            {this.state.visibleAsigna ? (
              <AdminProgramsAsigna
                programa={this.state.programSelected}
                subjects={this.state.recievedSubjects}
              />
            ) : null}
            {this.state.visibleGrupos ? (
              <AdminProgramsGrupos
                programa={this.state.programSelected}
                groups={this.state.recievedGroups}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(AdminPrograms);
