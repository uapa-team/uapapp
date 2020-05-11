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
} from "antd";
import Highlighter from "react-highlight-words";
import {
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

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
          nombre: "Nicolás Gómez",
        },
        {
          key: "2",
          nombre: "Angel Corredor",
        },
      ],
      periodsSelected: [],
    };
  }

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
        title: "Nombre",
        dataIndex: "nombre",
        key: "name",
        width: "90%",
        ...this.getColumnSearchProps("nombre"),
      },
      {
        title: "Eliminar",
        key: "delete",
        width: "10%",
        render: (record) => (
          <Popconfirm
            title="¿Está seguro que desea eliminar este profesor?"
            onConfirm={() => console.log(record.nombre)}
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
              onFinish={(values) => this.onFinishEditUser(record, values)}
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
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} profesores en total`;
}

export default withRouter(AdminProgramsProfes);
