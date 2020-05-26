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

const { Title } = Typography;

const ProgramsPre = [
  {
    title: "Departamento de Sistemas e Industrial",
    value: "Departamento de Sistemas e Industrial",
    children: [
      {
        title: "Ingeniería de Sistemas y Computación",
        value: "Ingeniería de Sistemas y Computación",
      },
      {
        title: "Ingeniería Industrial",
        value: "Ingeniería Industrial",
      },
    ],
  },
  {
    title: "Departamento Ejemplo",
    value: "0-1",
    children: [
      {
        title: "Ingeniería Agrícola",
        value: "Ingeniería Agrícola",
      },
      {
        title: "Ingeniería Química",
        value: "Ingeniería Química",
      },
      {
        title: "Ingeniería Civil",
        value: "Ingeniería Civil",
      },
    ],
  },
];

const ProgramsPos = [
  {
    title: "Departamento de Sistemas e Industrial",
    value: "Departamento de Sistemas e Industrial",
    children: [
      {
        title: "Maestría en Ingeniería de Sistemas y Computación",
        value: "Maestría en Ingeniería de Sistemas y Computación",
      },
      {
        title: "Doctorado en Ingeniería Industrial",
        value: "Doctorado en Ingeniería Industrial",
      },
    ],
  },
  {
    title: "Departamento Ejemplo",
    value: "0-1",
    children: [
      {
        title: "Doctorado en Ingeniería Agrícola",
        value: "Doctorado en Ingeniería Agrícola",
      },
      {
        title: "Maestría en Ingeniería Química",
        value: "Maestría en Ingeniería Química",
      },
      {
        title: "Especialización en Ingeniería Civil",
        value: "Especialización en Ingeniería Civil",
      },
    ],
  },
];

class AdminUsers extends React.Component {
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
      programasPreSelected: ["Ingeniería de Sistemas y Computación"],
      programasPosSelected: ["Maestría en Ingeniería Química"],
      searchText: "",
      searchedColumn: "",
      visibleModal: false,
    };
  }

  onFinishEditUser = (record, values) => {
    console.log(record);
    console.log(values);
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

  onChangePre = (value) => {
    console.log("onChangePre ", value);
    this.setState({ programasPreSelected: value });
  };

  onChangePos = (value) => {
    console.log("onChangePos ", value);
    this.setState({ programasPosSelected: value });
  };

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleNewUser = (values) => {
    //console.log(values);
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
      } else if (res.status === 204) {
        message.warning({ content: "El usuario ingresado ya existe.", key });
      } else {
        message.error({
          content:
            "Ha ocurrido un error creando el usuario. Por favor revise los campos.",
          key,
        });
      }
    });
    this.setState({
      visibleModal: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  };

  componentDidMount() {
    Backend.sendRequest("GET", "users").then(async (response) => {
      let res = await response.json();
      console.log(res);
      let users = [];
      for (let i = 0; i < res.length; i++) {
        let user = {};
        user["key"] = i;
        user["nombre"] = res[i].data["full_name"];
        user["correo"] = res[i].data["username"] + "@unal.edu.co";
        users.push(user);
      }
      this.setState({ dataSourceUsers: users });
    });
  }

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
            onConfirm={() => console.log(record.correo)}
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
        <Table
          dataSource={this.state.dataSourceUsers}
          columns={columns}
          bordered={true}
          expandedRowRender={(record) => (
            <Form
              onFinish={(values) => this.onFinishEditUser(record, values)}
              onFinishFailed={this.onFinishEditUserFailed}
              initialValues={{
                programsPre: this.state.programasPreSelected,
                programsPos: this.state.programasPosSelected,
              }}
            >
              <Form.Item name="userType" label="Tipo de usuario">
                <Radio.Group
                  buttonStyle="solid"
                  onChange={this.handleFormLayoutChange}
                >
                  <Radio.Button value="NoRol">Sin rol asignado</Radio.Button>
                  <Radio.Button value="Admin">Administrador</Radio.Button>
                  <Radio.Button value="Auxil">Auxiliar</Radio.Button>
                  <Radio.Button value="Coord">Coordinador</Radio.Button>
                  <Radio.Button value="UAPA">UAPA</Radio.Button>
                  <Radio.Button value="Depen">Dependencia</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="programsPre" label="Permisos de pregrado">
                <TreeSelect
                  treeData={ProgramsPre}
                  value={this.state.programasPreSelected}
                  onChange={this.onChangePre}
                  treeCheckable={true}
                  showCheckedStrategy={"SHOW_PARENT"}
                  placeholder="Por favor seleccione programas."
                />
              </Form.Item>
              <Form.Item name="programsPos" label="Permisos de posgrado">
                <TreeSelect
                  treeData={ProgramsPos}
                  value={this.state.programasPosSelected}
                  onChange={this.onChangePos}
                  treeCheckable={true}
                  showCheckedStrategy={"SHOW_PARENT"}
                  placeholder="Por favor seleccione programas."
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
          )}
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
        <Modal
          title="Crear un nuevo usuario"
          visible={this.state.visibleModal}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <Form onFinish={this.handleNewUser}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nombres" name="names">
                  <Input placeholder="Nombres" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Usuario UNAL" name="usernameUN">
                  <Input placeholder="Usuario institucional" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Apellidos" name="lastnames">
                  <Input placeholder="Apellidos" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Usuario UAPA" name="usernameUAPA">
                  <Input placeholder="Nombre de usuario (UAPA)" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="userType" label="Tipo de usuario">
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
                treeData={ProgramsPre}
                value={this.state.programasPreSelected}
                onChange={this.onChangePre}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
              />
            </Form.Item>
            <Form.Item name="programsPos" label="Permisos de posgrado">
              <TreeSelect
                treeData={ProgramsPos}
                value={this.state.programasPosSelected}
                onChange={this.onChangePos}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
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
