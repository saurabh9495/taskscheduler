import React, { Component } from "react";
import "./App.css";
import { PageHeader, Button, Descriptions } from "antd";
import EditableTable from "./TaskScheduler";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        {" "}
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.location.reload()}
            title="DASHBOARD TO SCHEDULER"
            subTitle="We can monitor jobs here"
            extra={[
              <Button
                key="2"
                type="primary"
                onClick={() => window.location.reload()}
              >
                Home
              </Button>
            ]}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Created">
                Saurabh Kumar
              </Descriptions.Item>
              <Descriptions.Item label="Association">
                <a>Sample Project</a>
              </Descriptions.Item>
              <Descriptions.Item label="Creation Time">
                29th September 2020
              </Descriptions.Item>
              <Descriptions.Item label="Effective Time">
                29th September 2020
              </Descriptions.Item>
              <Descriptions.Item label="Remarks">
                This DASHBOARD will monitor all the server task and
                <br /> time remaining time for all tasks.
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div style={{ marginLeft: "2%" }}>
            <EditableTable />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
