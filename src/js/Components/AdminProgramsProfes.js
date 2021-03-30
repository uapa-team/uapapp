import React from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Table,
  Form,
  TreeSelect,
  Input,
  Space,
  Row,
  Typography,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import Backend from "../Basics/Backend";

const { Title } = Typography;

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
    };
  }

  componentDidMount() {
    let recievedProfes = [];
    for (let i = 0; i < this.props.teachers.length; i++) {
      recievedProfes.push({
        key: this.props.teachers[i]["dni_docente"],
        correo: this.props.teachers[i]["correo_unal"],
        nombre: this.props.teachers[i]["nombre_completo"],
      });
    }
    recievedProfes = recievedProfes.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    this.setState({ dataSourceProfes: recievedProfes });

    Backend.sendRequest("POST", "periods", {}).then(async (response) => {
      let periods = await response.json();
      periods = periods.map((data) => {
        let ndata = {
          title: data["periodo"],
          value: data["periodo"],
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
      </Form>
    );

    let program = this.props.programa;
    let professor = record["key"];

    Backend.sendRequest("POST", "get_professor_periods", {
      cod_programa: program,
      dni_docente: professor,
    }).then(async (response) => {
      response.json().then(async (response) => {
        let periods_professor = response.map((data) => data["periodo"]);
        this.formRef.current.setFieldsValue({
          periods: periods_professor,
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
        width: "50%",
        ...this.getColumnSearchProps("nombre"),
      },
      {
        title: "Correo",
        dataIndex: "correo",
        key: "mail",
        width: "50%",
        ...this.getColumnSearchProps("correo"),
      },
    ];

    return (
      <div>
        <Row className="admin-programs-subtitle">
          <Title level={2}>Administración de profesores</Title>
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
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} profesores en total`;
}

export default withRouter(AdminProgramsProfes);
