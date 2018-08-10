import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

//Components
import MainComponent from "../components/MainComponent";

const title = "MTG Draft Wizard";

const App = () => (
  <MuiThemeProvider>
    <MainComponent />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("app"));

module.hot.accept();
