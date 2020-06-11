import React from "react";
import { withRouter } from "react-router-dom";
import {
  Row,
  Button,
  Table,
  Popconfirm,
  Typography,
  Input,
  Space,
  Modal,
  Form,
  Col,
  message,
  Radio,
  Select,
} from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Backend from "../Basics/Backend";
import { filterSelect } from "../Basics/Backend";

const { Title, Text } = Typography;

class AdminProgramsAsigna extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceAsigna: [
        {
          key: "1",
          código: "Cargando...",
          nombre: "Cargando...",
        },
      ],
      optionsCodes: [],
      optionsNames: [],
      searchCriteria: "código",
      selectedNewAsigna: undefined,
    };
  }

  componentDidMount() {
    let recievedAsigna = [];
    for (let i = 0; i < this.props.subjects.length; i++) {
      recievedAsigna.push({
        key: this.props.subjects[i].data["cod_asignatura"],
        código: this.props.subjects[i].data["cod_asignatura"],
        nombre: this.props.subjects[i].data["nombre_materia"],
      });
    }
    this.setState({ dataSourceAsigna: recievedAsigna });

    Backend.sendRequest("GET", "subjects").then(async (response) => {
      let res = await response.json();
      console.log(res);
    });
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

  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  };

  changeCriteria = (value) => {
    this.setState({ searchCriteria: value.target.value });
  };

  addAsigna = () => {
    this.setState({
      visibleModal: false,
    });
  };

  handleDeleteAsigna = (código) => {
    const key = "updatable";
    message.loading({ content: "Borrando asignatura...", key });
    Backend.sendRequest("POST", "remove_subject_from_program", {
      cod_asignatura: código,
      cod_programa: this.props.programa,
    }).then(async (response) => {
      if (response.status === 200) {
        message.success({
          content: "La asignatura se ha eliminado correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error creando eliminando la asignatura.",
          key,
        });
      }
    });
  };

  render() {
    var columns = [
      {
        title: "Código",
        dataIndex: "código",
        key: "code",
        width: "30%",
        ...this.getColumnSearchProps("código"),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "name",
        width: "60%",
        ...this.getColumnSearchProps("nombre"),
      },
      {
        title: "Eliminar",
        key: "delete",
        width: "10%",
        render: (record) => (
          <Popconfirm
            title="¿Está seguro que desea eliminar esta asignatura?"
            onConfirm={() => this.handleDeleteAsigna(record.código)}
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
          <Title level={2}>Administración de asignaturas</Title>
          <Button type="primary" onClick={this.showModal}>
            <AppstoreAddOutlined />
            Añadir asignatura
          </Button>
        </Row>
        <Table
          dataSource={this.state.dataSourceAsigna}
          columns={columns}
          bordered={true}
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
          title="Por favor escriba y seleccione el código o nombre de la asignatura a agregar."
          visible={this.state.visibleModal}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <Radio.Group
                  onChange={this.changeCriteria}
                  className="admin-programs-new-radio-container"
                  value={this.state.searchCriteria}
                >
                  <Radio.Button
                    className="admin-programs-new-radio-buttons"
                    value="código"
                  >
                    Código
                  </Radio.Button>
                  <Radio.Button
                    className="admin-programs-new-radio-buttons"
                    value="nombre"
                  >
                    Nombre
                  </Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={12}>
                {this.state.searchCriteria === "código" ? (
                  <Form.Item label="Código" name="code">
                    <Select
                      className="select-props"
                      showSearch
                      placeholder="Escriba el código de la asignatura."
                      onChange={this.onChangeCode}
                      filterOption={filterSelect}
                    >
                      {this.state.optionsCodes}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="Nombre" name="name">
                    <Select
                      className="select-props"
                      showSearch
                      placeholder="Escriba el nombre de la asignatura."
                      onChange={this.onChangeName}
                      filterOption={filterSelect}
                    >
                      {this.state.optionsNames}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
          </Form>
          {this.state.selectedAsigna === undefined ? (
            <Text></Text>
          ) : (
            <>
              <Text>
                Asignatura seleccionada: {this.state.selectedProfe}. Código:{" "}
                {this.state.selectedMail}.
              </Text>
              <Button
                type="primary"
                onClick={this.addAsigna}
                className="admin-users-add-finish-btn"
              >
                Añadir asignatura
              </Button>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} asignaturas en total`;
}

export default withRouter(AdminProgramsAsigna);
