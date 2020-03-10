import React from "react";
import { withRouter } from "react-router-dom"
import { Table, Input, Button } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class AdminUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ['a','b','b','b','b','b','b','b','b'],
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
              icon={<SearchOutlined />}
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
                width: "45%",
                ...this.getColumnSearchProps("name", "nombre")
            },
            {
                title: "Correo",
                dataIndex: "mail",
                key: "mail",
                width: "45%",
                ...this.getColumnSearchProps("mail", "correo")
            }
        ]

        return (
            <Table
            dataSource={this.state.dataSource}
            columns={columns}
            bordered={true}
            expandedRowRender={record => (
              <div>
                <div>
                  <b>Fecha de radicación:</b> {record.date}.
                </div>
                <div>
                  <b>Respuesta de Consejo de Facultad:</b> {record.approval_status}.
                </div>
                <div>
                  <b>Respuesta de Comité Asesor:</b> {record.advisor_response}.
                </div>
                <div>
                  <b>Instancia que decide:</b> {record.decision_maker}.
                </div>
                <div>
                  <b>ID del caso:</b> {record.id}.
                </div>
              </div>
            )}
            rowKey="id"
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
        );
    }
}

function showTotal(total) {
    return `Hay ${total} usuarios en total`;
  }

export default withRouter(AdminUsers)