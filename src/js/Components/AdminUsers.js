import React from "react";
import { withRouter } from "react-router-dom"
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Table, Input, Button } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Row } from "antd";

class AdminUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [{
              key: '1',
              nombre: 'asdf',
              correo: 'asdf'
            },
            {
              key: '2',
              nombre: 'asdf',
              correo: 'asdf'
            }],
            searchText: '',
            searchedColumn: '',
        }
    }

    getColumnSearchProps = (dataIndex, searchTerm) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Buscar por ${searchTerm}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={SearchOutlined}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Buscar
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Limpiar
            </Button>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

    render() {
        var columns = [
            {
                title: "Nombre",
                dataIndex: "name",
                key: "name",
                width: "43%",
                ...this.getColumnSearchProps("name", "nombre")
            },
            {
                title: "Correo",
                dataIndex: "mail",
                key: "mail",
                width: "43%",
                ...this.getColumnSearchProps("mail", "correo")
            },
            {
                title: "Eliminar",
                key: "delete",
                width: "14%",
                render: () => (
                    <span>
                      <a href="google.com">Borrar</a>
                    </span>
                  ),
            }
        ]

      return (
        <div>
          <Row className="admin-users-btnctn">
            <Button type="primary">
              <UserAddOutlined /> Añadir usuario
            </Button>
          </Row>
            <Table
            dataSource={this.state.dataSource}
            columns={columns}
            bordered={true}
            expandedRowRender={record => (
              <Form onSubmit={this.handleSubmit}>
                <Form.Item label="Tipo de usuario">
                  <Radio.Group
                    defaultValue="Duda"
                    buttonStyle="solid"
                    onChange={this.handleFormLayoutChange}
                  >
                    <Radio.Button value="NoRol">Sin rol asignado</Radio.Button>
                    <Radio.Button value="Admin">Administrador</Radio.Button>
                    <Radio.Button value="Auxil">Auxiliar</Radio.Button>
                    <Radio.Button value="Coord">Coordinador</Radio.Button>
                    <Radio.Button value="UAPA">UAPA</Radio.Button>
                    <Radio.Button value="Depen">Dependencia</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="Permisos">
                  <Radio.Group className="admin-users-radio-container" defaultValue="Pregrado">
                    <Radio.Button className="admin-users-radio-buttons" value="Preg">Pregrado</Radio.Button>
                    <Radio.Button className="admin-users-radio-buttons" value="Posg">Posgrado</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Form>
            )}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              locale: { items_per_page: "por página" },
              pageSizeOptions: ["10", "20", "50", "100"],
              position: "bottom",
              size: "small",
              showTotal: showTotal
            }}
          /> 
          </div>
        );
    }
}

function showTotal(total) {
    return `Hay ${total} usuarios en total`;
  }

export default withRouter(AdminUsers)