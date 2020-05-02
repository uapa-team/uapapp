import React from "react";
import { withRouter } from "react-router-dom";
import { TreeSelect, Radio } from "antd";

const { TreeNode } = TreeSelect;

class AdminPrograms extends React.Component {
  state = {
    value: undefined,
    found: false, //Variable según si se encuentran programas asignados.
    select: false, //Variable según si ya se eligió programa.
  };

  onChange = (value) => {
    console.log(value);
    if (value !== undefined) {
      this.setState({ select: true });
    } else {
      this.setState({ select: false });
    }
    this.setState({ value });
  };

  render() {
    return this.state.found ? (
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

        {this.state.select ? (
          <div className="admin-programs-below-select">
            <Radio.Group className="admin-programs-radio-container">
              <Radio.Button className="admin-programs-radio-buttons" value="1">
                Profesores
              </Radio.Button>
              <Radio.Button className="admin-programs-radio-buttons" value="2">
                Asignaturas
              </Radio.Button>
              <Radio.Button className="admin-programs-radio-buttons" value="3">
                Grupos de Investigación
              </Radio.Button>
            </Radio.Group>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default withRouter(AdminPrograms);
