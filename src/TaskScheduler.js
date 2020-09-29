import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  notification,
  InputNumber,
  Statistic
} from "antd";
import moment from "moment";

const { Countdown } = Statistic;
var timeconst = 0;

const Addanewservertodashboard = type => {
  notification[type]({
    message: "New Server Added",
    description: "A new server is added to the Dashboard."
  });
};

const NotificationServerLimit = type => {
  notification[type]({
    message: "Server Limit Reached to 10",
    description:
      "You can deploy a maximum of 10 servers more than that can not be deployed, Please delete an old server to add a new one."
  });
};

const Serverdeletedfromdashboard = type => {
  notification[type]({
    message: "An old server is deleted.",
    description:
      "A server is deleted from the dashboard, Please be careful while doing this operation."
  });
};

const NoMandatoryServerDelete = type => {
  notification[type]({
    message: "Cannot Delete Mandatory Server",
    description:
      "You are trying to delete a manadatory server, atleast one server should be always available in Dashboard."
  });
};
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "name",
        dataIndex: "name",
        width: "30%",
        editable: true
      },
      {
        title: "date",
        dataIndex: "date"
      },
      {
        title: "Time left per task",
        dataIndex: "description"
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Remove a server</a>
            </Popconfirm>
          ) : null
      }
    ];
    this.state = {
      dataSource: [
        {
          key: "0",
          name: "Default Server",
          date: "29/09/2020",
          description: (
            <Countdown
              value={Date.now() + 1000 * timeconst}
              format="HH:mm:ss:SSS"
            />
          )
        }
      ],
      count: 1,
      counter: 0,
      tasks: 0,
      timeleftpertask: 0
    };
  }

  handleDelete = key => {
    console.log(this.state.count, this.state.counter);
    if (this.state.count - this.state.counter <= 1) {
      console.log("Can't delete this mandatory server");
      NoMandatoryServerDelete("error");
    } else {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter(item => item.key !== key),
        counter: this.state.counter + 1
      });
      Serverdeletedfromdashboard("info");
      console.log("An old server is deleted.");
    }
  };
  handleAdd = () => {
    if (this.state.count - this.state.counter > 9) {
      console.log("can't add more than 10 rows.");
      NotificationServerLimit("warning");
    } else {
      const { count, dataSource } = this.state;
      var currentDate = moment().format("DD/MM/YYYY");
      const newData = {
        key: count,
        name: `New Server ${count}`,
        date: currentDate,
        description: (
          <Countdown
            value={Date.now() + 1000 * timeconst}
            format="HH:mm:ss:SSS"
          />
        )
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1
      });
      Addanewservertodashboard("success");
      console.log("A new server is added to the Dashboard.");
    }
  };
  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData
    });
  };

  handleChangeTask = value => {
    this.setState({ tasks: value });
    console.log("tasks changed", value);
    var dataSources = [];
    var numberofrows = this.state.count - this.state.counter;
    console.log(numberofrows, "number of rows");
    if (numberofrows >= value) {
      this.state.dataSource.map((a, i) =>
        dataSources.push({
          key: a.key,
          name: a.name,
          date: a.date,
          description:
            i < value ? (
              <Countdown value={Date.now() + 1000 * 10} format="HH:mm:ss:SSS" />
            ) : (
              <Countdown
                value={Date.now() + 1000 * timeconst}
                format="HH:mm:ss:SSS"
              />
            )
        })
      );
      this.setState({ dataSource: dataSources });
    } else {
      setTimeout(() => {
        this.state.dataSource.map((a, i) =>
          dataSources.push({
            key: a.key,
            name: a.name,
            date: a.date,
            description:
              i < value ? (
                <Countdown
                  value={Date.now() + 1000 * 10}
                  format="HH:mm:ss:SSS"
                />
              ) : (
                <Countdown
                  value={Date.now() + 1000 * timeconst}
                  format="HH:mm:ss:SSS"
                />
              )
          })
        );
        this.setState({ dataSource: dataSources });
      }, 10500);
    }
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary">
          Add a server, Total upto 10.
        </Button>
        <InputNumber
          style={{
            marginTop: "1%",
            marginBottom: "1%",
            marginRight: "1%",
            marginLeft: "1%"
          }}
          min={0}
          defaultValue={0}
          onChange={this.handleChangeTask}
        />
        Add Tasks Here
        <Countdown
          title="Total time needed to complete all tasks if single server is used, this will update everytime whenever a new server is added or task is updated because it calculates constant time i.e number of tasks * 10"
          value={Date.now() + 1000 * 10 * this.state.tasks}
          format="HH:mm:ss:SSS"
        />
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable;
