import React, { Component } from "react";
import JSONEditorReact from "./JSONEditorReact";
import { Flex, Box } from "react-system";
import {
  blue,
  red,
  grey,
  blueGrey,
  yellow,
  amber,
} from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { Container } from "reactstrap";
import CreateNew from "./CreateNew";
import OpenExisting from "./OpenExisting";
import None from "./None";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const modes = ["tree", "form", "view", "code", "text"];
const style = {
  headingDiv: {
    //backgroundColor: blueGrey["200"],
    //backgroundColor: amber["200"],
    backgroundColor: grey["800"],
    color: "white",
    position: "fixed",
    width: "100%",
    zIndex: 1,
  },
  buttonDiv: {
    margin: 50,
  },
  sidebarDiv: {
    // border: '2px solid red',
    //paddingRight: '2px solid red'
  },
  selectionDiv: {
    backgroundColor: grey["800"],
    color: "white",
  },
};
const useStyles = {
  root: {
    height: 10000,
    flexGrow: 1,
    anchor: "left",
    backgroundColor: grey["800"],
    color: "white",
    margin: -1,
    paddingTop: "40%",
    paddingLeft: 35,
  },
};

class App extends Component {
  state = {
    text: JSON.stringify({ json: "value" }, null, 2),
    mode: "tree",
    selectedType: "",
  };

  render() {
    return (
      <>
        <Flex pl={"30%"} style={style.headingDiv}>
          <Box>
            <h1>Metadata Driven ETL Framework</h1>
          </Box>
        </Flex>
        <section className="Options">
          <div className="Selection">
            <Flex width={1}>
              <Box width={1 / 5} style={{ position: "fixed" }}>
                {this.renderSidebar()}
              </Box>
              <Box
                width={4 / 5}
                style={{
                  backgroundColor: grey[50],
                  marginLeft: "20%",
                  padding: "10%",
                }}
              >
                {this.renderSelection(this.state.selectedType)}
              </Box>
            </Flex>
          </div>
        </section>
      </>
    );
  }

  onChangeText = (text) => {
    this.setState({ text });
  };

  onModeChange = (mode) => {
    this.setState({ mode });
  };

  renderSelection(SelectedType) {
    console.log(SelectedType);

    if (!SelectedType) return <None />;

    if (SelectedType == "CreateFileConfig")
      return <CreateNew value="CreateFileConfig" />;

    if (SelectedType == "CreateSchema")
      return <CreateNew value="CreateSchema" />;

    if (SelectedType == "RetrieveFileConfig")
      return <OpenExisting value="RetrieveFileConfig" />;

    if (SelectedType == "RetrieveSchema")
      return <OpenExisting value="RetrieveSchema" />;

    if (SelectedType == "PredefinedS3Schema")
      return <OpenExisting value="PredefinedS3Schema" />;

    if (SelectedType == "UpdatePredefinedS3Schema")
      return <OpenExisting value="UpdatePredefinedS3Schema" />;

    if (SelectedType == "SubmitJob") return <CreateNew value="SubmitJob" />;

    if (SelectedType == "QueryConfig") return <CreateNew value="QueryConfig" />;

    if (SelectedType == "Reference") return <CreateNew value="Reference" />;
  }

  setStateCreateNew() {
    return this.setState({ selectedType: "Create New" });
  }

  setStateFetchExisting() {
    return this.setState({ selectedType: "Fetch Existing" });
  }

  renderJSONEditor() {
    return (
      <Flex p={"50px"}>
        <JSONEditorReact
          text={this.state.text}
          mode={this.state.mode}
          modes={modes}
          indentation={4}
          onChangeText={this.onChangeText}
          onModeChange={this.onModeChange}
        />
      </Flex>
    );
  }

  renderSidebar() {
    return (
      <TreeView
        style={useStyles.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="1" label="Create New">
          <TreeItem
            nodeId="2"
            label="SourceDestinationConfig"
            onClick={() => {
              this.setState({ selectedType: "CreateFileConfig" });
            }}
          />
          <TreeItem
            nodeId="3"
            label="Schema"
            onClick={() => {
              this.setState({ selectedType: "CreateSchema" });
            }}
          />
          <TreeItem
            nodeId="4"
            label="PredefinedSchemaLocation"
            onClick={() => {
              this.setState({ selectedType: "PredefinedS3Schema" });
            }}
          />
          <TreeItem
            nodeId="5"
            label="QueryConfig"
            onClick={() => {
              this.setState({ selectedType: "QueryConfig" });
            }}
          />
        </TreeItem>
        <TreeItem nodeId="6" label="Retrieve">
          <TreeItem
            nodeId="10"
            label="SourceDestinationConfig"
            onClick={() => {
              this.setState({ selectedType: "RetrieveFileConfig" });
            }}
          />
          <TreeItem
            nodeId="7"
            label="Schema"
            onClick={() => {
              this.setState({ selectedType: "RetrieveSchema" });
            }}
          />
          <TreeItem
            nodeId="11"
            label="PredefinedSchemaLocation"
            onClick={() => {
              this.setState({ selectedType: "UpdatePredefinedS3Schema" });
            }}
          />
          <TreeItem
            nodeId="9"
            label="QueryConfig"
            onClick={() => {
              this.setState({ selectedType: "QueryConfig" });
            }}
          />
        </TreeItem>
        <TreeItem nodeId="12" label="Admin">
          <TreeItem
            nodeId="13"
            label="Submit Job"
            onClick={() => {
              this.setState({ selectedType: "SubmitJob" });
            }}
          />
        </TreeItem>
        <TreeItem nodeId="14" label="Help">
          <TreeItem
            nodeId="15"
            label="Reference"
            onClick={() => {
              this.setState({ selectedType: "Reference" });
            }}
          />
        </TreeItem>
      </TreeView>
    );
  }
}

export default App;
