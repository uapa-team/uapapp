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
} from "antd";
import {
  UsergroupAddOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const { Title } = Typography;

class AdminProgramsGrupos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceGrupos: [
        {
          key: "1",
          código: "102",
          nombre: "Grupo de Investigación Y",
        },
        {
          key: "2",
          código: "123",
          nombre: "Grupo de Investigación X",
        },
      ],
    };
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

  addGrupo = () => {
    this.setState({
      visibleModal: false,
    });
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
          title="Añadir un nuevo grupo de investigación"
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
                <Form.Item label="Código" name="code">
                  <Input placeholder="Código Hermes" />
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
                  Buscar por código
                </Button>
              </Col>
            </Row>
          </Form>
          <Button
            type="primary"
            onClick={this.addGrupo}
            className="admin-users-add-finish-btn"
          >
            Añadir grupo
          </Button>
        </Modal>
      </div>
    );
  }
}

function showTotal(total) {
  return `Hay ${total} grupos en total`;
}

export default withRouter(AdminProgramsGrupos);
