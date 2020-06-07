import React from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Popconfirm,
  Table,
  Form,
  TreeSelect,
  Input,
  Space,
  Row,
  Typography,
  Modal,
  Col,
  message,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Title } = Typography;

const periods = [
  {
    title: "2010-1",
    value: "2010-1",
  },
  {
    title: "2010-2",
    value: "2010-2",
  },
];

class AdminProgramsProfes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceProfes: [
        {
          key: "1",
          correo: "Cargando...",
          nombre: "Cargando...",
        },
      ],
      periodsSelected: [],
      visibleModal: false,
    };
  }

  componentDidMount() {
    let recievedProfes = [];
    for (let i = 0; i < this.props.teachers.length; i++) {
      recievedProfes.push({
        key: this.props.teachers[i].data["dni_docente"],
        correo: this.props.teachers[i].data["correo_unal"],
        nombre: this.props.teachers[i].data["nombre_completo"],
      });
    }
    this.setState({ dataSourceProfes: recievedProfes });

    Backend.sendRequest("POST", "get_professors_list").then(
      async (response) => {
        let res = await response.json();
        console.log(res);
      }
    );
  }

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

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleNewProfe = (values) => {
    console.log(values);
    this.setState({
      visibleModal: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  };

  onFinishPeriods = (record, values) => {
    console.log(record);
    console.log(values);
  };

  addProfe = () => {
    this.setState({
      visibleModal: false,
    });
  };

  handleDeleteProfe = (dni) => {
    const key = "updatable";
    message.loading({ content: "Desvinculando profesor...", key });
    Backend.sendRequest("POST", "remove_professor_from_program", {
      cod_programa: this.props.programa,
      dni_docente: dni,
    }).then(async (response) => {
      if (response.status === 200) {
        message.success({
          content: "El profesor se ha desvinculado correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error creando desvinculando al profesor.",
          key,
        });
      }
    });
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
            title="¿Está seguro que desea eliminar este profesor?"
            onConfirm={() => this.handleDeleteProfe(record.key)}
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
        <Row className="admin-programs-subtitle">
          <Title level={2}>Administración de profesores</Title>
          <Button type="primary" onClick={this.showModal}>
            <UserAddOutlined /> Añadir profesor
          </Button>
        </Row>
        <Table
          dataSource={this.state.dataSourceProfes}
          columns={columns}
          bordered={true}
          expandedRowRender={(record) => (
            <Form
              onFinish={(values) => this.onFinishPeriods(record, values)}
              onFinishFailed={this.onFinishEditUserFailed}
              initialValues={{
                periods: this.state.periodsSelected,
              }}
            >
              <Form.Item name="periods" label="Periodos">
                <TreeSelect
                  treeData={periods}
                  value={this.state.periodsSelected}
                  onChange={this.onChangePeriods}
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
          title="Añadir un nuevo profesor"
          visible={this.state.visibleModal}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <Form onFinish={this.searchByName}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nombre" name="names">
                  <Input placeholder="Nombres" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  ghost
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  className="admin-users-add-finish-btn"
                >
                  Buscar por nombre
                </Button>
              </Col>
            </Row>
          </Form>
          <Form onFinish={this.searchByMail}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Correo" name="mail">
                  <Input placeholder="Correo" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  ghost
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  className="admin-users-add-finish-btn"
                >
                  Buscar por correo
                </Button>
              </Col>
            </Row>
          </Form>
          <Button
            type="primary"
            onClick={this.addProfe}
            className="admin-users-add-finish-btn"
          >
            Añadir profesor
          </Button>
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} profesores en total`;
}

export default withRouter(AdminProgramsProfes);
