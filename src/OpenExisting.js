import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Flex, Box } from "react-system";
import Button from '@material-ui/core/Button';
import JSONEditorReact from "./JSONEditorReact";
import None from './None';

var AWS = require("aws-sdk");

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

const modes = ["tree", "form", "view", "code", "text"];

const style = {
  formDiv:{
    spacing:15,
    width:'25ch',
  },
  buttonDiv:{
    margin: 50,
    width:'18ch',
    height:'4.5ch',
    color:"primary",
    variant:'outlined'
  },
};

class OpenExisting extends Component{

  state = {
    inputKey: '',
    S3Location: 's3://',
    S3Location1:'',
    S3Location2:'',
    fileConfig: JSON.stringify({ json: "value" }, null, 2),
    schema: JSON.stringify({ json: "value" }, null, 2),
    JSONselectedType:'',
    selectedType:'',
    text: JSON.stringify({ json: "value" }, null, 2),
    mode: "tree",

    createSchema: JSON.stringify({json:"load sample Schmea"},null,2),

    fetchedfileConfig: JSON.stringify({json:"fetchedfileConfig23"},null,2),
    fetchedSchema: JSON.stringify({json:"fetchedSchema"},null,2)
  };

  setFileConfig = (event) =>{
      //event = event.replace(/\\/g, "");
      this.setState({fileConfig:JSON.parse(JSON.stringify(event))})
      //console.log(this.state.fileConfig)
  }
  setSchema = (event) =>{
    //event = event.replace(/\\/g, "");
     this.setState({schema:JSON.parse(JSON.stringify(event))})
    //console.log(this.state.fileConfig)
  }



  async dynamoDBFetch(key){

    function fetchOneByKey(key) {
      return new Promise(resolve => {
      setTimeout(() => {
        var params = {
            TableName: "DatalakeConfig",
            Key: {
                "ResourceType": key
            },
            AttributesToGet: ["fileConfig"],
        };

        docClient.get(params,function (err, data) {
            if (err) {

                console.log(err);
            }

            else {
               // console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
    //             console.log(data.Item.queryConfig)
                resolve(data.Item.fileConfig);
            }
        });
        });
        });
    }

    const out = await fetchOneByKey(key);
    console.log(out)
    //return out
    //if (attribute == 'fileConfig')
    this.setFileConfig(out)
    //if (attribute == 'schema')
    //this.setSchema(out)
    //this.setState({fileConfig:out})
    }


    async dynamoDBFetch1(key){

      function fetchOneByKey1(key) {
        return new Promise(resolve => {
        setTimeout(() => {
          var params = {
              TableName: "DatalakeConfig",
              Key: {
                  "ResourceType": key
              },
              AttributesToGet: ["schema"],
          };

          docClient.get(params,function (err, data) {
              if (err) {

                  console.log(err);
              }

              else {
                 // console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
      //             console.log(data.Item.queryConfig)
                  resolve(data.Item.schema);
              }
          });
          });
          });
      }

      const out = await fetchOneByKey1(key);
      console.log(out)
      this.setSchema(out)
      //this.setState({fileConfig:out})
      }


  renderJSONEditor(JSONselectedType, out){
    switch(JSONselectedType)
    {
      case "CreateSchema":
      {
        return (
          <Flex p={"50px"}>
          <JSONEditorReact

                      text={this.state.createSchema}
                      mode={this.state.mode}
                      modes={modes}
                      indentation={4}
                      onChangeText={this.onChangeText}
                      onModeChange={this.onModeChange}
                    />
          </Flex>
          );
      }
      case "RetrieveFileConfig":
        {
          return (
            <>
            <Flex p={"50px"}>
            <JSONEditorReact

                        text={this.state.fileConfig}
                        mode={this.state.mode}
                        modes={modes}
                        indentation={4}
                        onChangeText={this.onChangeText}
                        onModeChange={this.onModeChange}
                      />
            </Flex>

            <Flex pl="5%">
              <form onSubmit={this.handleSubmitRetrieveFileConfig1}>
              <div>
                <Button type="submit" style={style.buttonDiv} variant="outlined" color = "primary" >Submit</Button>
              </div>
              </form>
            </Flex>
            </>
            );
        }
      case "RetrieveSchema":
        {
          return (
            <>
            <Flex p={"50px"}>
            <JSONEditorReact

                      text={this.state.schema}
                      mode={this.state.mode}
                      modes={modes}
                      indentation={4}
                      onChangeText={this.onChangeText1}
                      onModeChange={this.onModeChange1}
                    />
            </Flex>
            <Flex pl="5%">
              <form onSubmit={this.handleSubmitRetrieveSchema1}>
              <div>
                <Button type="submit" style={style.buttonDiv} variant="outlined" color = "primary">Submit</Button>
              </div>
              </form>
          </Flex>
          </>
          );
        }

        case "RetrieveS3Location":
            {
              return (
                <>

                <Flex pl="10%">
                  <form onSubmit={this.handleSubmitRetrieveS3Location1}>

                    <p>S3Location: {this.state.S3Location1}</p>
                    <div><TextField required id="standard-required" label="Enter New Location" defaultValue={this.state.S3Location2} value={this.S3Location1} onChange={this.changeS3Location2} /></div>

                  <div>
                    <Button type="submit" style={style.buttonDiv} color="primary" variant="outlined">Submit</Button>
                  </div>
                  </form>
                </Flex>
                </>
              );

            }

      default:
        {
          return <None />;
        }

    }
  }

  onChangeText = (fileConfig) => {
    this.setState({ fileConfig });
  };

  onModeChange = (mode) => {
    this.setState({ mode });
  };

  onChangeText1 = (schema) => {
    this.setState({ schema });
  };

  onModeChange1 = (mode1) => {
    this.setState({ mode1 });
  };

  changeInputKey = (event) =>{
    this.setState({inputKey:event.target.value})
  }

  changeS3Location = (event) =>{
    //event = event.replace(/\\/g, "");
     this.setState({S3Location:event.target.value})
     //this.setState({S3Location1:event})
    //console.log(this.state.fileConfig)
  }

  changeS3Location1 = (event) => {
    this.setState({S3Location1:event})
  }

  changeS3Location2 = (event) => {
    this.setState({S3Location2:event.target.value})
  }




  handleSubmitCreateSchema = (event) => {
    //alert(`${this.state.inputKey}`)
    console.log(this.state.inputKey)
    //console.log(this.fetchOneByKey(this.state.inputKey))
    event.preventDefault()
    this.save();
    //this.fetchOneByKey1(this.state.inputKey);

    //console.log(this.state.fileConfig);
  }

  async fetchFileConfig(toInput) {

    const response = await fetch("/metadataapi/retrieve", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(toInput) // body data type must match "Content-Type" header
    });
    let out = await response.json();
    //console.log(body.id);
    //setMessage(body.id ? "Data sucessfully updated" : "Data updation failed");
    console.log('Response from DB:')
    console.log(typeof out)
    console.log(JSON.stringify(out))
    this.setFileConfig(JSON.stringify(out))
  }



  handleSubmitRetrieveFileConfig = (event) => {
    //console.log('coming here')

    console.log(this.state.inputKey)
    event.preventDefault()

    //this.dynamoDBFetch(this.state.inputKey);
    var key = this.state.inputKey
    var configType = 'SourceDestinationConfigSetUp'
    //var jsonInfo = this.state.fileConfigInput
    var values = {key, configType}
    this.fetchFileConfig(values);
   // console.log(this.state.selectedType)
   this.setState({JSONselectedType:'RetrieveFileConfig'})
  }



  async fetchSchema(toInput) {
    console.log('Coming here')
    const response = await fetch("/metadataapi/retrieve", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(toInput) // body data type must match "Content-Type" header
    });
    let out = await response.json();
    //console.log(body.id);
    //setMessage(body.id ? "Data sucessfully updated" : "Data updation failed");
    console.log('Response from DB:')
    console.log(JSON.stringify(out))
    this.setSchema(JSON.stringify(out))
  }

  handleSubmitRetrieveSchema = (event) => {
    //console.log('alalla coming here')
    console.log(this.state.inputKey)
    event.preventDefault()
    //this.dynamoDBFetch(this.state.inputKey,'schema');
    //this.dynamoDBFetch1(this.state.inputKey);
    var key = this.state.inputKey
    var configType = 'Schema'
    //var jsonInfo = this.state.fileConfigInput
    var values = {key, configType}
    this.fetchSchema(values)
    //console.log(this.state.JSONselectedType)
    this.setState({JSONselectedType:'RetrieveSchema'})
  }


  async updateFileConfig(toInput) {
    console.log('Coming here')
    const response = await fetch("/metadataapi/update", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(toInput) // body data type must match "Content-Type" header
    });
    let body = await response.json();
    console.log(body);
    return body
  }


  handleSubmitRetrieveFileConfig1 = (event) => {
    console.log('Need to submit this Updated Config to DynamoDB:')
    //event.preventDefault()
    console.log(this.state.fileConfig)
    var key = this.state.inputKey
    var configType = 'SourceDestinationConfigSetUp'
    var jsonInfo = this.state.fileConfig
    var values = {key, configType, jsonInfo}
    var body = this.updateFileConfig(values);
    if (body)
    {
      alert(`Updated FileConfig pushed to DynamoDB`)
    }
    else{
      alert(`Could not Update FileConfig in DynamoDB`)
    }
    
  }


  async updateSchemaConfig(toInput) {
    console.log('Coming here')
    const response = await fetch("/metadataapi/update", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(toInput) // body data type must match "Content-Type" header
    });
    let body = await response.json();
    console.log(body);
    return body
  }


  handleSubmitRetrieveSchema1 = (event) => {
    console.log('Need to submit this Updated Schema to DynamoDB:')
    console.log(this.state.schema)
    var key = this.state.inputKey
    var configType = 'Schema'
    var jsonInfo = this.state.schema
    var values = {key, configType, jsonInfo}
    var body = this.updateSchemaConfig(values);
    if (body)
    {
      alert(`Updated Schema pushed to DynamoDB successfully`)
    }
    else{
      alert(`Could not Insert Schema in DynamoDB`)
    }
    //event.preventDefault()
  }


  async insertS3Location(toInput) {
    console.log('Coming here to insert S3 location value')
    const response = await fetch("/metadataapi/create", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(toInput) // body data type must match "Content-Type" header
    });
    let body = await response.json();
    console.log(body);
    return body
  }


  handleSubmitS3Location = (event) => {

    console.log(this.state.S3Location)
    //event.preventDefault()
    console.log(this.state.inputKey)
    console.log('Coming to SubmitS3Location Function')
    //this.dynamoDBFetch(this.state.inputKey,'schema');
    //this.dynamoDBFetch1(this.state.inputKey);
    var key = this.state.inputKey
    var configType = 'PredefinedSchemaLocation'
    var jsonInfo = this.state.S3Location
    var values = {key, configType, jsonInfo}
    var body = this.insertS3Location(values);
    if (body)
    {
      alert(`New S3 Location pushed to DynamoDB successfully`)
    }
    else{
      alert(`Could not Insert S3 Location in DynamoDB`)
    }
    
  }








  setSelectedType = (value) =>{
    this.setState({selectedType:value});
    //console.log(this.state.fileConfig)
    }

    save = function () {

      var fc=JSON.stringify(JSON.parse(this.state.fileConfigInput))
      var input = {
          "ResourceType": this.state.inputKey, "schema":fc
      };
      var params = {
          TableName: "DatalakeConfig",
          Item:  input
      };
      docClient.put(params, function (err, data) {

          if (err) {
              console.log("users::save::error - " + JSON.stringify(err, null, 2));
          } else {
              console.log("users::save::success" );
          }
      });
    }


    render = (props) => {
      //this.setSelectedType(props.value);
      //console.log('heere here');
      //alert(props.value)
      console.log(this.props.value)
      //this.setSelectedType(this.props.value);
      //console.log(this.state.selectedType)
      switch(this.props.value)
      {
        case "CreateSchema":
          {
            return (
              <>
              <section>
              <div className="renderJSON">
              {this.renderJSONEditor(this.props.value)}
                </div>
              </section>
              <Flex pl={"5%"} >
              <form className="Form" onSubmit={this.handleSubmitCreateSchema}>
                <div>
                <Box>
                  <TextField required id="standard-required" label="Enter Key" defaultValue="" value={this.inputKey} onChange={this.changeInputKey} />
                  <Button type="submit" style={style.buttonDiv} variant="outlined" color="primary" onClick = {() => {this.setState({JSONselectedType:'CreateSchema'})}}> Submit</Button>
                </Box>
                </div>
              </form>
              </Flex>
            </>
            );
          }
        case "RetrieveFileConfig":
          {
            return (
              <>
              <Flex pl={"10%"} >
              <form className="Form" onSubmit={this.handleSubmitRetrieveFileConfig}>
                <div>
                <Box>
                  <TextField required id="standard-required" label="Enter Key " defaultValue="" value={this.inputKey} onChange={this.changeInputKey} />
                  <Button type="submit" style={style.buttonDiv} variant="outlined" color="primary" >Submit </Button>
                </Box>
                </div>
              </form>
              </Flex>
              <section>
              <div className="renderJSON">
                  {this.renderJSONEditor(this.state.JSONselectedType)}

                </div>
              </section>
            </>
            );
          }
        case "RetrieveSchema":
          {
            return (
              <>
              <Flex pl={"10%"} >
              <form className="Form" onSubmit={this.handleSubmitRetrieveSchema}>
                <div>
                <Box>
                  <TextField required id="standard-required" label="Enter Key" defaultValue="" value={this.inputKey} onChange={this.changeInputKey} />
                  <Button type="submit" style={style.buttonDiv} variant="outlined" color = 'primary' > Submit</Button>
                </Box>
                </div>
              </form>
              </Flex>
              <section>
              <div className="renderJSON">
                  {this.renderJSONEditor(this.state.JSONselectedType)}

                </div>
              </section>
            </>
            );
          }
        case "PredefinedS3Schema":
          {
             return (
               <>
               <Flex pl={"10%"} >
               <form className="Form" onSubmit={this.handleSubmitS3Location}>
                 <div>
                 <Box>
                   <div><TextField required id="standard-required" label="Enter S3 Location" defaultValue="" value={this.S3Location} onChange={this.changeS3Location} /></div>
                   <div><TextField required id="standard-required" label="Enter Key" defaultValue="" value={this.inputKey} onChange={this.changeInputKey} /> </div>
                   <Button type="submit" style={style.buttonDiv} variant="outlined" color="primary" > Submit</Button>
                 </Box>
                 </div>
               </form>
               </Flex>
             </>
             );
          }

          case "UpdatePredefinedS3Schema":
          {
              return (
                <>
                <Flex pl={"10%"} >
                <form className="Form" onSubmit={this.handleSubmitRetrieveS3Location}>
                  <div>
                  <Box>
                    <div><TextField required id="standard-required" label="Enter Key" defaultValue="" value={this.inputKey} onChange={this.changeInputKey} /> </div>
                    <Button type="submit" style={style.buttonDiv} variant="outlined" color="primary" > Submit</Button>
                  </Box>
                  </div>
                </form>
                </Flex>
                <section>
                  <div className="renderJSON">
                  {this.renderJSONEditor(this.state.JSONselectedType)}

                </div>
              </section>
              </>
              );
          }

          default:
          {
              return(
                <Flex pl={"5%"} >
                <form className="Form" onSubmit={this.handleSubmit}>
                <div>
                <Box>
                  <TextField required id="standard-required" label="Enter Key" defaultValue="" value={this.inputKey} onChange={this.changeInputKey} />
                  <Button type="submit" style={style.buttonDiv} variant="outlined" color="primary" onClick = {() => {this.setState({JSONselectedType:'1'})}}> Submit</Button>
                </Box>
                </div>
              </form>
              </Flex>
              );
          }


      }

    }

    wait(ms){
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
     }
   }

    handleSubmitRetrieveS3Location = (event) => {
      //console.log('alalla coming here')
      console.log(this.state.inputKey)
      event.preventDefault()
      //this.dynamoDBFetch(this.state.inputKey,'schema');
      //this.dynamoDBFetch1(this.state.inputKey);
      var key = this.state.inputKey
      var configType = 'PredefinedSchemaLocation'
      //var jsonInfo = this.state.fileConfigInput
      var values = {key, configType}
      this.fetchS3Location(values)

      //console.log(this.state.JSONselectedType)
      this.setState({JSONselectedType:'RetrieveS3Location'})
      //this.wait(2000)
    }
    async fetchS3Location(toInput) {
      console.log('Coming here to fetch S3Location value: cmg here bro')
      const response = await fetch("/metadataapi/retrieve", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *client
        body: JSON.stringify(toInput) // body data type must match "Content-Type" header
      });

      let out = await response.text();
      //console.log(body.id);
      //setMessage(body.id ? "Data sucessfully updated" : "Data updation failed");
      //out.text()
      console.log('Response from DB for S3:', out)
      //let body = await response.json();
      //console.log(JSON.stringify(body))
      //console.log(typeof promise.resolve(out))
      //this.changeS3Location(out.toString())
      //console.log(typeof out)
      this.changeS3Location1(out)
      console.log(this.state.S3Location1)
    }


    handleSubmitRetrieveS3Location1 = (event) => {
      console.log('Need to submit this Updated S3Location to DynamoDB:')
      //console.log(this.state.S3Location)
      var key = this.state.inputKey
      var configType = 'PredefinedSchemaLocation'
      var jsonInfo = this.state.S3Location2
      var values = {key, configType, jsonInfo}
      console.log(key)
      console.log(configType)
      console.log(jsonInfo)
      console.log('pushing this to submit:', values)
      var body = this.updateS3Location(values);
      if (body)
      {
        alert('Sucesfully Updated S3 Location in DynamoDB')
      }
      else
      {
        alert('Could not update in DynamoDB')
      }
      //event.preventDefault()
      //alert('Updated S3 Location is pushed to DynamoDb')
    }


    async updateS3Location(toInput) {
      console.log('Coming here to insert S3 location value')
      const response = await fetch("/metadataapi/update", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *client
        body: JSON.stringify(toInput) // body data type must match "Content-Type" header
      });
      let body = await response.json();
      console.log(body);
      return body
      //setMessage(body ? "Data sucessfully updated" : "Data updation failed");
    }



}

export default OpenExisting
