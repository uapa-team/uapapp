import React from "react";
import { withRouter } from "react-router-dom";
import {
  Radio,
  Table,
  Input,
  Button,
  Form,
  Typography,
  Space,
  Popconfirm,
  TreeSelect,
  Modal,
  Row,
  Col,
  message,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Backend from "../Basics/Backend";
import { filterTreeNode } from "../Basics/Backend";

const { Title } = Typography;

class AdminUsers extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      dataSourceUsers: [
        {
          key: "1",
          nombre: "Cargando...",
          correo: "Cargando...",
        },
      ],
      programasPreSelected: [],
      programasPosSelected: [],
      ProgramsPre: undefined,
      ProgramsPos: undefined,
      searchText: "",
      searchedColumn: "",
      visibleModal: false,
    };
  }

  onFinishEditUser = (record, values) => {
    let username = record["username"];
    let programs = [];

    values["programsPre"].forEach((element) => {
      programs = programs.concat(element);
    });
    values["programsPos"].forEach((element) => {
      programs = programs.concat(element);
    });
    programs = Array.from(new Set(programs));

    let rol = values["userType"];

    const key = "updatable";
    message.loading({ content: "Guardando permisos...", key });
    Backend.sendRequest("POST", "app_user_programs/add_programs_with_delete", {
      username: username,
      programs: programs,
    }).then(async (response) => {
      if (response.status === 200) {
        Backend.sendRequest("POST", "change_role", {
          username: username,
          role: rol,
        }).then(async (response) => {
          if (response.status === 200) {
            message.success({
              content: "Permisos de usuario actualizados correctamente.",
              key,
            });
          } else {
            message.error({
              content:
                "Ha ocurrido un error actualizando los permisos. Por favor contáctenos.",
              key,
            });
          }
        });
      } else {
        message.error({
          content:
            "Ha ocurrido un error actualizando los programas. Por favor contáctenos.",
          key,
        });
      }
    });
  };

  getRecord = (record) => {
    let users = this.state.dataSourceUsers.slice();
    users.forEach((user) => {
      if (user["username"] === record["username"]) {
        return user;
      }
    });
  };

  onFinishEditUserFailed = (values) => {
    console.log(values);
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Buscar por ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleNewUser = (values) => {
    const key = "updatable";
    message.loading({ content: "Creando usuario...", key });
    Backend.sendRequest("POST", "user_create", {
      username: values["usernameUN"],
      first_name: values["names"],
      last_name: values["lastnames"],
      role: values["userType"],
    }).then(async (response) => {
      let res = await response.json();
      console.log(res);
      if (res.status === 200) {
        message.success({ content: "Usuario creado correctamente.", key });
        let users = this.state.dataSourceUsers.slice();
        users.push({
          key: users.length,
          nombre: values["names"] + " " + values["lastnames"],
          correo: values["usernameUN"] + "@unal.edu.co",
          username: values["usernameUN"],
          role: values["userType"],
        });
        users = users.sort((a, b) => a.username.localeCompare(b.username));
        this.setState({ dataSourceUsers: users });
      } else if (res.status === 204) {
        message.warning({ content: "El usuario ingresado ya existe.", key });
      } else {
        message.error({
          content: "Ha ocurrido un error creando el usuario.",
          key,
        });
      }
    });
    this.setState({
      visibleModal: false,
    });
  };

  handleNewUserFailed = (values) => {
    console.log("Failed:", values);
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  };

  componentDidMount() {
    Backend.sendRequest("GET", "users").then(async (response) => {
      let res = await response.json();
      let users = [];
      for (let i = 0; i < res.length; i++) {
        let user = {};
        user["key"] = i;
        user["nombre"] = res[i].data["full_name"];
        user["correo"] = res[i].data["username"] + "@unal.edu.co";
        user["username"] = res[i].data["username"];
        user["role"] = res[i].data["role"];
        users.push(user);
      }
      users = users.sort((a, b) => a.username.localeCompare(b.username));
      this.setState({ dataSourceUsers: users });
    });

    Backend.sendRequest("GET", "academic_programs_info").then(
      async (response) => {
        let res = await response.json();
        let area = {};
        res.forEach((program) => {
          let pprogram = {
            title: program["data"]["programa"],
            nivel: program["data"]["cod_nivel"],
            value: program["data"]["cod_programa"],
          };
          if (area[program["data"]["area_curricular"]] === undefined) {
            area[program["data"]["area_curricular"]] = [];
          }
          area[program["data"]["area_curricular"]].push(pprogram);
        });
        let pProgramsPre = [];
        let pProgramsPos = [];
        for (const [key] of Object.entries(area)) {
          let preprograms = area[key].filter(
            (program) => program["nivel"] === 1
          );
          let posprograms = area[key].filter(
            (program) => program["nivel"] !== 1
          );
          let preprogramskeys = preprograms.map((program) => program["value"]);
          let posprogramskeys = posprograms.map((program) => program["value"]);
          if (preprogramskeys.length === 1) {
            preprogramskeys.push(preprogramskeys[0]);
          }
          let pareapre = {
            title: key,
            value: preprogramskeys,
            children: preprograms,
          };
          pProgramsPre.push(pareapre);
          let pareapos = {
            title: key,
            value: posprogramskeys,
            children: posprograms,
          };
          pProgramsPos.push(pareapos);
        }
        this.setState({ ProgramsPre: pProgramsPre });
        this.setState({ ProgramsPos: pProgramsPos });
      }
    );
  }

  handleDeleteUser = (mail) => {
    const key = "updatable";
    message.loading({ content: "Eliminando usuario...", key });
    let user = mail.replace("@unal.edu.co", "");
    Backend.sendRequest("DELETE", "delete_user", { username: user }).then(
      async (response) => {
        const key = "updatable";
        if (response.status === 200) {
          let users = this.state.dataSourceUsers.slice();
          for (let i = 0; i < users.length; i++){
            if(users[i].username === user){
              users.splice(i,1);
            }
          }
          this.setState({dataSourceUsers: users});
          message.success({ content: "Usuario eliminado correctamente.", key });
        } else {
          message.error({
            content: "Ha ocurrido un error eliminando el usuario.",
            key,
          });
        }
      }
    );
  };

  renderForm = (record) => {
    let form = (
      <Form
        ref={this.formRef}
        onFinish={(values) => this.onFinishEditUser(record, values)}
        onFinishFailed={this.onFinishEditUserFailed}
        initialValues={{
          programsPre: [],
          programsPos: [],
        }}
      >
        <Form.Item
          name="userType"
          label="Tipo de usuario"
          rules={[
            {
              required: true,
              message: "Por favor seleccione el tipo de usuario.",
            },
          ]}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={this.handleFormLayoutChange}
          >
            <Radio.Button value="0">Sin rol asignado</Radio.Button>
            <Radio.Button value="1">Administrador</Radio.Button>
            <Radio.Button value="2">Auxiliar</Radio.Button>
            <Radio.Button value="3">Coordinador</Radio.Button>
            <Radio.Button value="4">UAPA</Radio.Button>
            <Radio.Button value="5">Dependencia</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="programsPre" label="Permisos de pregrado">
          <TreeSelect
            treeData={this.state.ProgramsPre}
            value={record["programasPre"]}
            treeCheckable={true}
            showCheckedStrategy={"SHOW_PARENT"}
            placeholder="Por favor seleccione programas."
            filterTreeNode={filterTreeNode}
          />
        </Form.Item>
        <Form.Item name="programsPos" label="Permisos de posgrado">
          <TreeSelect
            treeData={this.state.ProgramsPos}
            value={this.state.programasPosSelected}
            treeCheckable={true}
            showCheckedStrategy={"SHOW_PARENT"}
            placeholder="Por favor seleccione programas."
            filterTreeNode={filterTreeNode}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="admin-users-btnfinish"
          >
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    );
    let username = record["username"];
    Backend.sendRequest("POST", "app_user_programs", {
      username: username,
    }).then(async (response) => {
      response.json().then(async (response) => {
        let programasPre = response
          .filter((data) => data["data"]["cod_nivel"] === 1)
          .map((data) => data["data"]["cod_programa"]);
        let programasPos = response
          .filter((data) => data["data"]["cod_nivel"] !== 1)
          .map((data) => data["data"]["cod_programa"]);
        this.formRef.current.setFieldsValue({
          programsPre: programasPre,
          programsPos: programasPos,
          userType: record["role"].toString(),
        });
      });
    });
    return form;
  };

  render() {
    var columns = [
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "name",
        width: "45%",
        ...this.getColumnSearchProps("nombre"),
      },
      {
        title: "Correo",
        dataIndex: "correo",
        key: "mail",
        width: "45%",
        ...this.getColumnSearchProps("correo"),
      },
      {
        title: "Eliminar",
        key: "delete",
        width: "10%",
        render: (record) => (
          <Popconfirm
            title="¿Está seguro que desea eliminar este usuario?"
            onConfirm={() => this.handleDeleteUser(record.correo)}
            okText="Sí"
            cancelText="No"
            placement="top"
          >
            <Button icon={<DeleteOutlined />} type="link"></Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <div>
        <Row className="admin-users-btnctn">
          <Title level={2}>Administración de usuarios</Title>
          <Button type="primary" onClick={this.showModal}>
            <UserAddOutlined /> Añadir usuario
          </Button>
        </Row>
        <div className="admin-users-tablectn">
          <Table
            dataSource={this.state.dataSourceUsers}
            columns={columns}
            bordered={true}
            expandedRowRender={this.renderForm}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              locale: { items_per_page: "por página" },
              pageSizeOptions: ["10", "20", "50"],
              position: "bottom",
              size: "small",
              showTotal: showTotal,
            }}
          />
        </div>
        <Modal
          title="Crear un nuevo usuario"
          visible={this.state.visibleModal}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <Form
            onFinish={this.handleNewUser}
            onFinishFailed={this.handleNewUserFailed}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Nombres"
                  name="names"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el nombre.",
                    },
                  ]}
                >
                  <Input placeholder="Nombres" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Usuario UNAL"
                  name="usernameUN"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el usuario.",
                    },
                  ]}
                >
                  <Input placeholder="Usuario institucional" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Apellidos"
                  name="lastnames"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese los apellidos.",
                    },
                  ]}
                >
                  <Input placeholder="Apellidos" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Usuario UAPA" name="usernameUAPA">
                  <Input placeholder="Nombre de usuario (UAPA)" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="userType"
              label="Tipo de usuario"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el tipo de usuario.",
                },
              ]}
            >
              <Radio.Group
                buttonStyle="solid"
                onChange={this.handleFormLayoutChange}
              >
                <Radio.Button value="0">Sin rol asignado</Radio.Button>
                <Radio.Button value="1">Administrador</Radio.Button>
                <Radio.Button value="2">Auxiliar</Radio.Button>
                <Radio.Button value="3">Coordinador</Radio.Button>
                <Radio.Button value="4">UAPA</Radio.Button>
                <Radio.Button value="5">Dependencia</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="programsPre" label="Permisos de pregrado">
              <TreeSelect
                treeData={this.state.ProgramsPre}
                value={this.state.programasPreSelected}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
                filterTreeNode={filterTreeNode}
              />
            </Form.Item>
            <Form.Item name="programsPos" label="Permisos de posgrado">
              <TreeSelect
                treeData={this.state.ProgramsPos}
                value={this.state.programasPosSelected}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
                filterTreeNode={filterTreeNode}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="admin-users-add-finish-btn"
            >
              Crear usuario
            </Button>
          </Form>
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} usuarios en total`;
}

export default withRouter(AdminUsers);
