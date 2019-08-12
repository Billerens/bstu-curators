import Menu from "../../components/menu/Menu";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Request from "../../components/request/Request";
import NotFound from "../404/404";
import PageWrapper from "../../containers/pageWrapper/PageWrapper";
import GroupLayout from "./groups";
import GroupModal from "../../components/groupModal/Group";

class Dashboard extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          flexGrow: 1,
          backgroundColor: "#f3f4f8"
        }}
      >
        <Menu />
        <Switch>
          <Route
            exec
            path="/dashboard/groups"
            render={props => (
              <PageWrapper {...props} title="Группы" component={GroupLayout} />
            )}
          />
          <Route
            exec
            path="/dashboard/students"
            render={props => (
              <PageWrapper {...props} title="Студенты" component={Request} />
            )}
          />
          <Route
            exec
            path="/dashboard/reports"
            render={props => (
              <PageWrapper {...props} title="Отчеты" component={Request} />
            )}
          />
          <Route
            path="/dashboard/*"
            exact
            render={props => (
              <PageWrapper {...props} title="Упс!" component={NotFound} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default Dashboard;
