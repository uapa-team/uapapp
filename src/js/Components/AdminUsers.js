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
    title: "Departamento de Ingeniería Civil y Agrícola",
    value: ["2541", "2542"],
    children: [
      {
        title: "Ingeniería Agrícola",
        value: "2541",
      },
      {
        title: "Ingeniería Civil",
        value: "2542",
      },
    ],
  },
  {
    title: "Departamento de Sistemas e Industrial",
    value: ["2879", "2546"],
    children: [
      {
        title: "Ingeniería de Sistemas y Computación",
        value: "2879",
      },
      {
        title: "Ingeniería Industrial",
        value: "2546",
      },
    ],
  },
  {
    title: "Departamento de Ingeniería Electrica y Electrónica",
    value: ["2544", "2545"],
    children: [
      {
        title: "Ingeniería Electrica",
        value: "2544",
      },
      {
        title: "Ingeniería Electrónica",
        value: "2545",
      },
    ],
  },
  {
    title: "Departamento de Ingeniería Mecánica y Mecatrónica",
    value: ["2547", "2548"],
    children: [
      {
        title: "Ingeniería Mecánica",
        value: "2547",
      },
      {
        title: "Ingeniería Mecatrónica",
        value: "2548",
      },
    ],
  },
  {
    title: "Departamento de Química y Ambiental",
    value: ["2549", "2549"],
    children: [
      {
        title: "Ingeniería Química",
        value: "2549",
      },
    ],
  },
];

const ProgramsPos = [
  {
    title: "Departamento de Ingeniería Civil y Agrícola",
    value: [
      "2217",
      "2278",
      "2492",
      "2696",
      "2285",
      "2886",
      "2699",
      "2700",
      "2701",
      "2705",
      "2706",
      "2683",
      "2887",
    ],
    children: [
      {
        title: "Especialización en Geotecnia",
        value: "2217",
      },
      {
        title: "Especialización en Recursos Hidráulicos",
        value: "2278",
      },
      {
        title:
          "Especialización en Ingeniería - Tránsito, Diseño y Seguridad Vial",
        value: "2492",
      },
      {
        title: "Especialización en Transito, Diseño y Seguridad Vial",
        value: "2696",
      },
      {
        title: "Especialización en Transporte",
        value: "2285",
      },
      {
        title: "Especialización en Estructuras",
        value: "2886",
      },
      {
        title: "Maestría en Ingeniería - Estructuras",
        value: "2699",
      },
      {
        title: "Maestría en Ingeniería - Geotecnia",
        value: "2700",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería Agrícola",
        value: "2701",
      },
      {
        title: "Maestría en Ingeniería - Recursos Hidráulicos",
        value: "2705",
      },
      {
        title: "Maestría en Ingeniería - Transporte",
        value: "2706",
      },
      {
        title: "Doctorado en Ingeniería - Geotecnia",
        value: "2683",
      },
      {
        title: "Doctorado en Ingeniería - Ingeniería Civil",
        value: "2887",
      },
    ],
  },
  {
    title: "Departamento de Sistemas e Industrial",
    value: [
      "2896",
      "2702",
      "2707",
      "2708",
      "2856",
      "2882",
      "2928",
      "2684",
      "2838",
    ],
    children: [
      {
        title: "Especialización en Gobierno Electrónico",
        value: "2896",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería de Sistemas y Computación",
        value: "2702",
      },
      {
        title: "Maestría en Ingeniería - Telecomunicaciones",
        value: "2707",
      },
      {
        title: "Maestría en Ingenieria Industrial",
        value: "2708",
      },
      {
        title:
          "Maestría en Ingeniería - Ingeniería de Sistemas y Computación - Conv UPC",
        value: "2856",
      },
      {
        title: "Maestría en Bioinformática",
        value: "2882",
      },
      {
        title:
          "Maestría en Ingeniería - Ingeniería de Sistemas y Computación - Conv Unillanos",
        value: "2928",
      },
      {
        title: "Doctorado en Ingeniería - Sistemas y Computación",
        value: "2684",
      },
      {
        title: "Doctorado en Ingeniería - Industria y Organizaciones",
        value: "2838",
      },
    ],
  },
  {
    title: "Departamento de Ingeniería Electrica y Electrónica",
    value: [
      "2064",
      "2113",
      "2687",
      "2691",
      "2698",
      "2703",
      "2794",
      "2865",
      "2685",
    ],
    children: [
      {
        title: "Especialización en Calidad de la Energía",
        value: "2064",
      },
      {
        title: "Especialización en Ingeniería Eléctrica",
        value: "2113",
      },
      {
        title: "Especialización en Automatización Industrial",
        value: "2687",
      },
      {
        title: "Especialización en Iluminación Pública y Privada",
        value: "2691",
      },
      {
        title: "Maestría en Ingeniería - Automatización Industrial",
        value: "2698",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería Eléctrica",
        value: "2703",
      },
      {
        title:
          "Maestría en Ingeniería - Ingeniería Eléctrica Convenio Sede Manizales",
        value: "2794",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería Electrónica",
        value: "2865",
      },
      {
        title: "Doctorado en Ingeniería - Ingeniería Eléctrica",
        value: "2685",
      },
    ],
  },
  {
    title: "Departamento de Ingeniería Mecánica y Mecatrónica",
    value: ["2709", "2710", "2682", "2839"],
    children: [
      {
        title: "Maestría en Ingeniería - Ingeniería Mecánica",
        value: "2709",
      },
      {
        title: "Maestría en Ingeniería - Materiales y Procesos",
        value: "2710",
      },
      {
        title: "Doctorado en Ingeniería - Ciencia y Tecnología de Materiales",
        value: "2682",
      },
      {
        title: "Doctorado en Ingeniería - Ingeniería Mecánica y Mecatrónica",
        value: "2839",
      },
    ],
  },
  {
    title: "Departamento de Química y Ambiental",
    value: ["2792", "2562", "2704", "2686"],
    children: [
      {
        title: "Especialización en Ingeniería Ambiental",
        value: "2792",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería Ambiental",
        value: "2562",
      },
      {
        title: "Maestría en Ingeniería - Ingeniería Química",
        value: "2704",
      },
      {
        title: "Doctorado en Ingeniería - Ingeniería Química",
        value: "2686",
      },
    ],
  },
];

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
    let users = this.state.dataSourceUsers;
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
      this.setState({ dataSourceUsers: users });
    });
  }

  filterTreeNode = (input, child) => {
    return (
      child.props.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .indexOf(
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) >= 0
    );
  };

  handleDeleteUser = (mail) => {
    const key = "updatable";
    message.loading({ content: "Eliminando usuario...", key });
    let user = mail.replace("@unal.edu.co", "");
    Backend.sendRequest("DELETE", "delete_user", { username: user }).then(
      async (response) => {
        const key = "updatable";
        if (response.status === 200) {
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
            treeData={ProgramsPre}
            value={record["programasPre"]}
            treeCheckable={true}
            showCheckedStrategy={"SHOW_PARENT"}
            placeholder="Por favor seleccione programas."
            filterTreeNode={this.filterTreeNode}
          />
        </Form.Item>
        <Form.Item name="programsPos" label="Permisos de posgrado">
          <TreeSelect
            treeData={ProgramsPos}
            value={this.state.programasPosSelected}
            treeCheckable={true}
            showCheckedStrategy={"SHOW_PARENT"}
            placeholder="Por favor seleccione programas."
            filterTreeNode={this.filterTreeNode}
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
        console.log(this.formRef);
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
                treeData={ProgramsPre}
                value={this.state.programasPreSelected}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
                filterTreeNode={this.filterTreeNode}
              />
            </Form.Item>
            <Form.Item name="programsPos" label="Permisos de posgrado">
              <TreeSelect
                treeData={ProgramsPos}
                value={this.state.programasPosSelected}
                treeCheckable={true}
                showCheckedStrategy={"SHOW_PARENT"}
                placeholder="Por favor seleccione programas."
                filterTreeNode={this.filterTreeNode}
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
