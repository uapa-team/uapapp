import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Button, Table, Typography, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const { Title } = Typography;

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
    };
  }

  componentDidMount() {
    let recievedGroups = [];
    for (let i = 0; i < this.props.groups.length; i++) {
      recievedGroups.push({
        key: this.props.groups[i]["cod_hermes"],
        código: this.props.groups[i]["cod_hermes"],
        nombre: this.props.groups[i]["nombre"],
      });
    }
    recievedGroups = recievedGroups.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    this.setState({ dataSourceGrupos: recievedGroups });
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

  render() {
    var columns = [
      {
        title: "Código",
        dataIndex: "código",
        key: "code",
        width: "35%",
        ...this.getColumnSearchProps("código"),
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "name",
        width: "65%",
        ...this.getColumnSearchProps("nombre"),
      },
    ];
    return (
      <div>
        <Row className="admin-programs-subtitle">
          <Title level={2}>Administración de grupos de investigación</Title>
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
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} grupos en total`;
}

export default withRouter(AdminProgramsGrupos);
