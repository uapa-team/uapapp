import React from "react";
import { withRouter } from "react-router-dom";
import { TreeSelect } from "antd";

var found = false; // Variable según si se encuentran programas asignados.
const { TreeNode } = TreeSelect;

class AdminPrograms extends React.Component {
  state = {
    value: undefined,
  };

  onChange = (value) => {
    console.log(value);
    this.setState({ value });
  };

  render() {
    return found ? (
      <div className="not-found-programs-div">
        <h4>
          No se le ha asignado ningún programa. Contacte a un administrador si
          considera que es un error.
        </h4>
      </div>
    ) : (
      <div>
        <div className="select-programs-div">
          <h2>Seleccione un programa: </h2>
        </div>
        <TreeSelect
          showSearch
          style={{ width: "100%" }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Por favor busque o seleccione un programa."
          allowClear
          onChange={this.onChange}
        >
          <TreeNode selectable={false} value="Pregrado" title="Pregrado">
            <TreeNode
              value="Sistemas1"
              title="Ingeniería de Sistemas"
            ></TreeNode>
          </TreeNode>
          <TreeNode selectable={false} value="Posgrado" title="Posgrado">
            <TreeNode
              value="Sistemas2"
              title="Maestría en Ingeniería de Sistemas"
            ></TreeNode>
          </TreeNode>
        </TreeSelect>
      </div>
    );
  }
}

export default withRouter(AdminPrograms);
