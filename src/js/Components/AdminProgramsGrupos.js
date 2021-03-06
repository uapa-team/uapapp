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
  UsergroupAddOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Backend from "../Basics/Backend";
import { filterSelect } from "../Basics/Backend";

const { Title, Text } = Typography;
const { Option } = Select;

class AdminProgramsGrupos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceGrupos: [
        {
          key: "1",
          código: "Cargando...",
          nombre: "Cargando...",
        },
      ],
      optionsCodes: [],
      optionsNames: [],
      currentOptions: undefined,
      searchCriteria: "código",
      selectedGrupo: undefined,
    };
  }

  componentDidMount() {
    let recievedGroups = [];
    for (let i = 0; i < this.props.groups.length; i++) {
      recievedGroups.push({
        key: this.props.groups[i].data["cod_hermes"],
        código: this.props.groups[i].data["cod_hermes"],
        nombre: this.props.groups[i].data["nombre"],
      });
    }
    recievedGroups = recievedGroups.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    this.setState({ dataSourceGrupos: recievedGroups });

    Backend.sendRequest("GET", "investigation_groups").then(
      async (response) => {
        let res = await response.json();
        let recievedGruposCodes = [];
        let recievedGruposNames = [];
        for (let i = 0; i < res.length; i++) {
          recievedGruposCodes.push(
            <Option key={res[i].data["cod_hermes"]}>
              {res[i].data["cod_hermes"].toString()}
            </Option>
          );
          recievedGruposNames.push(
            <Option key={res[i].data["cod_hermes"]}>
              {res[i].data["nombre"]}
            </Option>
          );
        }
        this.setState({
          optionsCodes: recievedGruposCodes,
          optionsNames: recievedGruposNames,
        });
      }
    );
  }

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

  addGrupo = () => {
    const key = "updatable";
    message.loading({ content: "Añadiendo grupo...", key });
    Backend.sendRequest("POST", "program_groups/add", {
      cod_hermes: this.state.selectedGrupo.data.cod_hermes,
      cod_programa: this.props.programa,
    }).then(async (response) => {
      let dataSourceGrupos = this.state.dataSourceGrupos.slice();
      dataSourceGrupos.push({
        key: this.state.selectedGrupo.data.cod_hermes,
        código: this.state.selectedGrupo.data.cod_hermes,
        nombre: this.state.selectedGrupo.data.nombre,
      });
      dataSourceGrupos = dataSourceGrupos.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      this.setState({ dataSourceGrupos: dataSourceGrupos });
      if (response.status === 200) {
        message.success({
          content: "El grupo se ha añadido correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error añadiendo el grupo.",
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

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  onChangeInput = (value) => {
    Backend.sendRequest("POST", "investigation_group", {
      cod_hermes: value.toString(),
    }).then(async (response) => {
      let res = await response.json();
      this.setState({ selectedGrupo: res });
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

  handleDeleteGrupo = (code) => {
    const key = "updatable";
    message.loading({ content: "Desvinculando grupo...", key });
    Backend.sendRequest("POST", "remove_group_from_program", {
      cod_hermes: code,
      cod_programa: this.props.programa,
    }).then(async (response) => {
      let dataSourceGrupos = this.state.dataSourceGrupos.slice();
      for (let i = 0; i < dataSourceGrupos.length; i++) {
        if (dataSourceGrupos[i].key === code) {
          dataSourceGrupos.splice(i, 1);
        }
      }
      this.setState({ dataSourceGrupos: dataSourceGrupos });
      if (response.status === 200) {
        message.success({
          content: "El grupo se ha desvinculado correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error creando desvinculando al grupo.",
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
            title="¿Está seguro que desea eliminar este grupo?"
            onConfirm={() => this.handleDeleteGrupo(record.código)}
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
          <Title level={2}>Administración de grupos de investigación</Title>
          <Button type="primary" onClick={this.showModal}>
            <UsergroupAddOutlined /> Añadir grupo
          </Button>
        </Row>
        <Table
          dataSource={this.state.dataSourceGrupos}
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
          title="Por favor escriba y seleccione el código o el nombre del grupo a agregar."
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
                      placeholder="Escriba el código Hermes del grupo."
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
                      placeholder="Escriba el nombre del grupo."
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
          {this.state.selectedGrupo === undefined ? (
            <Text></Text>
          ) : (
            <>
              <Text>
                Grupo seleccionado: {this.state.selectedGrupo.data.nombre}.
                Código Hermes: {this.state.selectedGrupo.data.cod_hermes}.
              </Text>
              <Button
                type="primary"
                onClick={this.addGrupo}
                className="admin-users-add-finish-btn"
              >
                Añadir grupo
              </Button>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} grupos en total`;
}

export default withRouter(AdminProgramsGrupos);
