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
  Select,
  Radio,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Backend from "../Basics/Backend";
import { filterSelect } from "../Basics/Backend";

const { Option } = Select;
const { Title, Text } = Typography;

class AdminProgramsProfes extends React.Component {
  formRef = React.createRef();

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
      periods: undefined,
      periodsSelected: [],
      visibleModal: false,
      selectedProfe: undefined,
      optionsUsers: [],
      optionsNames: [],
      currentOptions: [],
      searchCriteria: "nombre",
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
    recievedProfes = recievedProfes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    this.setState({ dataSourceProfes: recievedProfes });

    Backend.sendRequest("POST", "get_professors_list").then(
      async (response) => {
        let res = await response.json();
        let recievedProfesUsers = [];
        let recievedProfesNames = [];
        for (let i = 0; i < res.length; i++) {
          if (
            res[i].data["nombre_completo"] !== "" ||
            res[i].data["nombre_completo"] !== null
          ) {
            recievedProfesNames.push(
              <Option key={res[i].data["dni_persona"]}>
                {res[i].data["nombre_completo"]}
              </Option>
            );
          }

          if (
            res[i].data["correo_unal"] !== "" ||
            res[i].data["correo_unal"] !== null
          ) {
            recievedProfesUsers.push(
              <Option key={res[i].data["dni_persona"]}>
                {res[i].data["correo_unal"]}
              </Option>
            );
          }
        }
        this.setState({
          optionsUsers: recievedProfesUsers,
          optionsNames: recievedProfesNames,
        });
      }
    );

    Backend.sendRequest("GET", "periods").then(async (response) => {
      let periods = await response.json();
      periods = periods.map((data) => {
        let ndata = {
          title: data["data"]["periodo"],
          value: data["data"]["periodo"],
        };
        return ndata;
      });
      this.setState({ periods: periods });
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

  changeCriteria = (value) => {
    this.setState({
      searchCriteria: value.target.value,
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
    const key = "updatable";
    message.loading({ content: "Actualizando periodos...", key });
    Backend.sendRequest("POST", "set_professor_periods", {
      dni_docente: record.key,
      cod_programa: this.props.programa,
      periods: values.periods,
    }).then(async (response) => {
      if (response.status === 200) {
        message.success({
          content: "Los periodos fueron asignados correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error actualizando los periodos del profesor.",
          key,
        });
      }
    });
  };

  addProfe = (values) => {
    const key = "updatable";
    message.loading({ content: "Vinculando profesor...", key });
    Backend.sendRequest("POST", "program_profressors/add", {
      cod_programa: this.props.programa,
      dni_docente: values.names,
      periodos: values.periods,
    }).then(async (response) => {
      if (response.status === 200) {
        Backend.sendRequest("POST", "get_professor_dni", {
          dni_professor: values.names,
        }).then(async (response) => {
          response.json().then(response => {
            let dataSourceProfes = this.state.dataSourceProfes.slice();
            dataSourceProfes.push({
              key: response[0].data.dni_docente,
              correo: response[0].data.correo_unal,
              nombre: response[0].data.nombres, 
            });
            dataSourceProfes = dataSourceProfes.sort((a, b) => a.nombre.localeCompare(b.nombre));
            this.setState({ dataSourceProfes: dataSourceProfes });
          });
        });
        message.success({
          content: "El profesor ha sido vinculado correctamente.",
          key,
        });
      } else {
        message.error({
          content: "Ha ocurrido un error creando vinculando al profesor.",
          key,
        });
      }
    });
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

  renderForm = (record) => {
    let form = (
      <Form
        ref={this.formRef}
        onFinish={(values) => this.onFinishPeriods(record, values)}
        onFinishFailed={this.onFinishEditUserFailed}
        initialValues={{
          periods: this.state.periodsSelected,
        }}
      >
        <Form.Item name="periods" label="Periodos">
          <TreeSelect
            treeData={this.state.periods}
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
    );

    let program = this.props.programa;
    let professor = record["key"];

    Backend.sendRequest("POST", "get_professor_periods", {
      cod_programa: program,
      dni_docente: professor,
    }).then(async (response) => {
      response.json().then(async (response) => {
        let periods_professor = response.map((data) => data["data"]["periodo"]);
        console.log(periods_professor);
        this.formRef.current.setFieldsValue({
          periods: periods_professor,
        });
      });
    });

    return form;
  };

  onChangeInput = (value) => {
    console.log(value.toString());
    Backend.sendRequest("POST", "get_professor_dni", {
      dni_professor: value.toString(),
    }).then(async (response) => {
      let res = await response.json();
      this.setState({ selectedProfe: res });
    });
  };

  handleTypeName = (value) => {
    if (value.length < 3) {
      this.setState({ currentOptions: [] });
    } else {
      this.setState({ currentOptions: this.state.optionsNames });
    }
  };

  handleTypeUser = (value) => {
    if (value.length < 3) {
      this.setState({ currentOptions: [] });
    } else {
      this.setState({ currentOptions: this.state.optionsUsers });
    }
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
            <UserAddOutlined /> Añadir docente
          </Button>
        </Row>
        <Table
          dataSource={this.state.dataSourceProfes}
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
        <Modal
          title="Por favor escriba y seleccione el nombre o usuario del docente a agregar."
          visible={this.state.visibleModal}
          onCancel={this.handleCancel}
          footer={null}
          width={800}
        >
          <Form onFinish={this.addProfe}>
            <Row gutter={16}>
              <Col span={12}>
                <Radio.Group
                  onChange={this.changeCriteria}
                  className="admin-programs-new-radio-container"
                  value={this.state.searchCriteria}
                >
                  <Radio.Button
                    className="admin-programs-new-radio-buttons"
                    value="nombre"
                  >
                    Nombre
                  </Radio.Button>
                  <Radio.Button
                    className="admin-programs-new-radio-buttons"
                    value="usuario"
                  >
                    Usuario
                  </Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={12}>
                {this.state.searchCriteria === "nombre" ? (
                  <Form.Item label="Nombre" name="names">
                    <Select
                      className="select-props"
                      showSearch
                      placeholder="Escriba el nombre del docente."
                      onChange={this.onChangeInput}
                      filterOption={filterSelect}
                      notFoundContent={null}
                      onSearch={this.handleTypeName}
                    >
                      {this.state.currentOptions}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="Usuario" name="username">
                    <Select
                      className="select-props"
                      showSearch
                      placeholder="Escriba el nombre de usuario del docente."
                      onChange={this.onChangeInput}
                      filterOption={filterSelect}
                      notFoundContent={null}
                      onSearch={this.handleTypeUser}
                    >
                      {this.state.currentOptions}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="periods" label="Periodos">
                  <TreeSelect
                    treeData={this.state.periods}
                    value={this.state.periodsSelected}
                    onChange={this.onChangePeriods}
                    treeCheckable={true}
                    showCheckedStrategy={"SHOW_PARENT"}
                    placeholder="Por favor seleccione programas."
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                {this.state.selectedProfe === undefined ? (
                  <></>
                ) : (
                  <>
                    <Text>
                      Profesor seleccionado:{" "}
                      {this.state.selectedProfe[0].data.nombre_completo}. Correo
                      institucional: {this.state.selectedProfe[0].data.correo_unal}.
                    </Text>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="admin-users-add-finish-btn"
                      >
                        Añadir profesor
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} profesores en total`;
}

export default withRouter(AdminProgramsProfes);
