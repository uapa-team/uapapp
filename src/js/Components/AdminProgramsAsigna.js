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
const { Option } = Select;

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
      currentOptions: [],
      searchCriteria: "código",
      selectedAsigna: undefined,
    };
  }

  componentDidMount() {
    let recievedAsigna = [];
    for (let i = 0; i < this.props.subjects.length; i++) {
      recievedAsigna.push({
        key: this.props.subjects[i]["cod_asignatura"].toString(),
        código: this.props.subjects[i]["cod_asignatura"],
        nombre: this.props.subjects[i]["nombre_materia"],
      });
    }
    recievedAsigna = recievedAsigna.sort((a, b) => a.key.localeCompare(b.key));
    this.setState({ dataSourceAsigna: recievedAsigna });

    Backend.sendRequest("GET", "subjects").then(async (response) => {
      let res = await response.json();
      let recievedAsignaCodes = [];
      let recievedAsignaNames = [];
      for (let i = 0; i < res.length; i++) {
        recievedAsignaCodes.push(
          <Option key={res[i]["cod_materia"]}>{res[i]["cod_materia"]}</Option>
        );
        recievedAsignaNames.push(
          <Option key={res[i]["cod_materia"]}>
            {res[i]["nombre_materia"] + " - " + res[i]["cod_materia"]}
          </Option>
        );
      }
      this.setState({
        optionsCodes: recievedAsignaCodes,
        optionsNames: recievedAsignaNames,
      });
    });
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  onChangeInput = (value) => {
    Backend.sendRequest("POST", "subject", {
      cod_subject: value.toString(),
    }).then(async (response) => {
      let res = await response.json();
      this.setState({ selectedAsigna: res });
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
    const key = "updatable";
    message.loading({ content: "Añadiendo asignatura...", key });
    Backend.sendRequest("POST", "program_subjects/add", {
      cod_asignatura: this.state.selectedAsigna.data.cod_materia,
      cod_programa: this.props.programa,
    }).then(async (response) => {
      if (response.status === 200) {
        let dataSourceAsigna = this.state.dataSourceAsigna.slice();
        dataSourceAsigna.push({
          key: this.state.selectedAsigna.data.cod_materia.toString(),
          código: this.state.selectedAsigna.data.cod_materia,
          nombre: this.state.selectedAsigna.data.nombre_materia,
        });
        dataSourceAsigna = dataSourceAsigna.sort((a, b) =>
          a.key.localeCompare(b.key)
        );
        this.setState({ dataSourceAsigna: dataSourceAsigna });
        message.success({
          content: "La asignatura se ha añadido correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error añadiendo la asignatura.",
          key,
        });
      }
    });

    this.setState({
      visibleModal: false,
    });
  };

  handleTypeCode = (value) => {
    if (value.length < 3) {
      this.setState({ currentOptions: [] });
    } else {
      this.setState({ currentOptions: this.state.optionsCodes });
    }
  };

  handleTypeName = (value) => {
    if (value.length < 3) {
      this.setState({ currentOptions: [] });
    } else {
      this.setState({ currentOptions: this.state.optionsNames });
    }
  };

  handleDeleteAsigna = (código) => {
    const key = "updatable";
    message.loading({ content: "Borrando asignatura...", key });
    Backend.sendRequest("POST", "remove_subject_from_program", {
      cod_asignatura: código,
      cod_programa: this.props.programa,
    }).then(async (response) => {
      if (response.status === 200) {
        let dataSourceAsigna = this.state.dataSourceAsigna.slice();
        for (let i = 0; i < dataSourceAsigna.length; i++) {
          if (dataSourceAsigna[i].key === código) {
            dataSourceAsigna.splice(i, 1);
          }
        }
        this.setState({ dataSourceAsigna: dataSourceAsigna });
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
                      onChange={this.onChangeInput}
                      filterOption={filterSelect}
                      notFoundContent={null}
                      onSearch={this.handleTypeCode}
                    >
                      {this.state.currentOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="Nombre" name="name">
                    <Select
                      className="select-props"
                      showSearch
                      placeholder="Escriba el nombre de la asignatura."
                      onChange={this.onChangeInput}
                      filterOption={filterSelect}
                      notFoundContent={null}
                      onSearch={this.handleTypeName}
                    >
                      {this.state.currentOptions}
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
                Asignatura seleccionada:{" "}
                {this.state.selectedAsigna.data.nombre_materia}. Código:
                {this.state.selectedAsigna.data.cod_materia}.
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
