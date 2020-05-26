import React , {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Flex, Box } from "react-system";
import JSONEditorReact from "./JSONEditorReact";
import None from './None';
import MultiSelect from "@khanacademy/react-multi-select";
import clsx from 'clsx';
import  useTheme from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Sinks from './Sinks';
import Utils from './Utils';
import PDF from "./PDF";
import ReactPDF from '@react-pdf/renderer';





const sinks = [
  'S3',
  'Dynamodb',
  'Redshift'
];
const fs = require('fs')

//const sink=[];

const modes = ["tree", "form", "view", "code", "text"];

const style = {
  formDiv:{
    spacing:15,
    width:'25ch',
  },
  buttonDiv:{
    margin: 50,
    width:'18ch',
    height:'4.5ch'
  },
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  }
};  

const initialSchema= '{json:"this works "}';

var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com"
  };
AWS.config.update(awsConfig);

let x = [window.sessionStorage.getItem("sinkval")];

var docClient = new AWS.DynamoDB.DocumentClient();

class CreateNew extends Component{


  state = {
    schemaInput: window.top.sample_schema,
    fileConfigInput: JSON.stringify({json:"FileConfigsample"}, null, 2),
    mode: "tree",
    mode1:"tree",
    mode2: "tree",
    selectedType: '',
    inputSourceType:'',
    inputSinkType:'',
    JSONselectedType:'',
    inputKeyName:'',
    source: '',
    open:false,
    selectedSinks:window.sessionStorage.getItem("sinkval"),
    submitJob: window.top.sample_job_submit,
  };
  sink = [];


  changeinputSourceType = (event) =>{
    this.setState({inputSourceType:event.target.value})
  }

  changeInputKeyName = (event) =>{
    this.setState({inputKeyName:event.target.value})
  }




  handleSubmit = (event) => {
    //alert(`${this.state.inputSourceType}`)
    //console.log(top.globa);
    event.preventDefault();
    console.log('Source: %s',this.state.source)
    //console.log('Sinks Object: %s ', window.sessionStorage.getItem("sinkval"))
    //this.setState({selectedSinks:window.sessionStorage.getItem("sinkval").toString()})
    console.log('Sinks: %s ', window.sessionStorage.getItem("sinkval"))
    //console.log(window.sessionStorage.getItem("sinkval").split(','))
    //console.log(String(window.sessionStorage.getItem("sinkval").split(',')).split(','))
    this.setFileConfigRendering(this.state.source, window.sessionStorage.getItem("sinkval").split(',').sort())
    //console.log(window.sessionStorage.getItem("sinkval").split(',').sort())
    //this.setFileConfigRendering(this.state.source, window.sessionStorage.getItem("sinkval"))
    //alert(`${this.state.fileConfigInput}`)
    //console.log(this.state.fileConfigInput)
    
  }


  setFileConfigRendering = (source, sink) =>
   {
    var dict = {
      Athena: {"hooktype":"athena","hookoptions":[{"type":"read","options":{}},{"type":"write","options":{"athenaDB":"deltadb","athenaTable":"customers","athenaDir":"s3://dms-ingestion-encrypted-levis/athena/","region":"us-west-2","tblproperties":""}}]},
      Redshift: {"hooktype":"redshift","hookoptions":[{"type":"read","options":{}},{"type":"write","options":{"url":"jdbc:redshift://demoredshiftcluster.*******.us-east-1.redshift.amazonaws.com:5439/demodb?user=xxx&password=xx","aws_iam_role":"arn:aws:iam::*******:role/vfcredshiftRole","dbtable":"customerredshiftdata","tempdir":"s3a://temdir/data"}}]},
      DynamoDB: {"hooktype":"dynamodb","hookoptions":[{"type":"read","options":{}},{"type":"write","options":{"dynamodb.servicename":"dynamodb","dynamodb.output.tableName":"*****","dynamodb.endpoint":"dynamodb.us-east-1.amazonaws.com","dynamodb.regionid":"us-east-1","dynamodb.throughput.write":"1","dynamodb.throughput.write.percent":"1","mapred.output.format.class":"org.apache.hadoop.dynamodb.write.DynamoDBOutputFormat","mapred.input.format.class":"org.apache.hadoop.dynamodb.read.DynamoDBInputFormat"}}]},
      Database: {"hooktype":"jdbc","hookoptions":[{"type":"read","options":{}},{"type":"write","options":{"url":"jdbc:postgresql://testinstance.*****.us-east-1.rds.amazonaws.com:5432/testdb","dbtable":"ricohmaster","user":"{dbuser-usesystemparametersforstringtheactualvalue,fortestingvaluescanbehardcodedhere}","password":"{dbpassword-usesystemparametersforstringtheactualvalue,fortestingvaluescanbehardcodedhere}","numPartitions":"10"}}]},
      ElasticSearch: {"hooktype":"elasticsearch","hookoptions":[{"type":"read","options":{"index":"index/ricohmaster","es.nodes.wan.only":"true","es.port":"443","es.net.ssl":"true","es.nodes":"https://vpc-testdomain-*****.us-east-1.es.amazonaws.com"}},{"type":"write","options":{"mode":"Append","save":"index/ricohmaster","es.nodes.wan.only":"true","es.port":"443","es.net.ssl":"true","es.nodes":"https://vpc-testdomain-****.us-east-1.es.amazonaws.com"}}]},
      file_outputOptions : {"outputFormat":"parquet","savemode":"Overwrite","outputDirectory":"s3://output/customers","partitioncolumns":"state_code","numberOfOutputPartitions":"1"},
      db_outputOptions : {"outputFormat":"parquet","savemode":"Append","numberOfOutputPartitions":"1","outputDirectory":"s3://customerdbdata/","partitioncolumns":""},
      kafka_outputOptions: {"outputFormat":"parquet","savemode":"Append","numberOfOutputPartitions":"1","outputDirectory":"s3://metadata-framwork/real-time-ingestion/ingestion_output/","checkpointLocation":"s3://metadata-framwork/ingestion_checkpoint3/","partitioncolumns":"specifypartitioningcolumnhereordeletethiselement"},
      filestreaming_outputOptions : {"outputFormat":"deltacdc","savemode":"Append","cdccolumn":"op","keyColumn":"id","numberOfOutputPartitions":"1","outputDirectory":"s3://dms-ingestion-encrypted-levis/delta_output/customers/","checkpointLocation":"s3://dms-ingestion-encrypted-levis/check_point/"},
      kinesis_outputOptions:{"outputFormat":"parquet","savemode":"Append","numberOfOutputPartitions":"1","outputDirectory":"s3://metadata-framwork/real-time-ingestion/ingestion_output/","checkpointLocation":"s3://metadata-framwork/ingestion_checkpoint3/","partitioncolumns":"specifypartitioningcolumnhereordeletethiselement"}
    };


    if (source == 'Files'){
      var i
      console.log(sink.length)
      var a = JSON.parse(window.top.source_files);
      for (i=0; i<sink.length; i++)
      {
        console.log(sink[i])
        if (sink[i] == 'DataLake(HDFS or S3)')
        {
          console.log('came here')
          a['source']['files'][0]['fileOutputOptions'].push(dict["file_outputOptions"])
        }
        else
        {
          a['source']['files'][0]['hooks'].push(dict[sink[i]])
        }
        
      };
      //console.log(JSON.stringify(a))
      this.setState({fileConfigInput:JSON.stringify(a)})

      
    }
    if (source == 'Databases')
      {
      var i
      console.log(sink.length)
      var a = JSON.parse(window.top.source_databases);
      for (i=0; i<sink.length; i++)
      {
        console.log(sink[i])
        if (sink[i] == 'DataLake(HDFS or S3)')
        {
          console.log('came here')
          a['source']['databases'][0]['dbOutputOptions'].push(dict["db_outputOptions"])
        }
        else
        {
          a['source']['databases'][0]['hooks'].push(dict[sink[i]])
        }
        
      };
      //console.log(JSON.stringify(a))
      this.setState({fileConfigInput:JSON.stringify(a)})
      
     }
    if (source == 'Kafka')
    {
      var i
      console.log(sink.length)
      var a = JSON.parse(window.top.source_kafka);
      for (i=0; i<sink.length; i++)
      {
        console.log(sink[i])
        if (sink[i] == 'DataLake(HDFS or S3)')
        {
          console.log('came here')
          a['source']['streams'][0]['streamOutputOptions'].push(dict["kafka_outputOptions"])
        }
        else
        {
          a['source']['streams'][0]['hooks'].push(dict[sink[i]])
        }
        
      };
      //console.log(JSON.stringify(a))
      this.setState({fileConfigInput:JSON.stringify(a)})
    }

    if (source == 'FileStreaming'){
      var i
      console.log(sink.length)
      var a = JSON.parse(window.top.source_filestreaming);
      for (i=0; i<sink.length; i++)
      {
        console.log(sink[i])
        if (sink[i] == 'DataLake(HDFS or S3)')
        {
          console.log('came here')
          a['source']['streams'][0]['streamOutputOptions'].push(dict["filestreaming_outputOptions"])
        }
        else
        {
          a['source']['streams'][0]['hooks'].push(dict[sink[i]])
        }
        
      };
      //console.log(JSON.stringify(a))
      this.setState({fileConfigInput:JSON.stringify(a)})
      
    }

  if (source == 'Kinesis'){
      var i
      console.log(sink.length)
      var a = JSON.parse(window.top.source_kinesis);
      for (i=0; i<sink.length; i++)
      {
        console.log(sink[i])
        if (sink[i] == 'DataLake(HDFS or S3)')
        {
          console.log('came here')
          a['source']['streams'][0]['streamOutputOptions'].push(dict["kinesis_outputOptions"])
        }
        else
        {
          a['source']['streams'][0]['hooks'].push(dict[sink[i]])
        }
        
      };
      //console.log(JSON.stringify(a))
      this.setState({fileConfigInput:JSON.stringify(a)})
      
    }


  }

  async insertNewFileConfig(toInput) {
    console.log('Coming into Insert for DynamoDB')
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


  handleSubmit1 = (event) => {
    //alert(`${this.state.inputSourceType}`)
    //event.preventDefault();
    console.log('Hey this is from new project')
    console.log('Key Name: ', this.state.inputKeyName)
    console.log('config to push:', this.state.fileConfigInput)
    //this.save_fileConfig();
    var key = this.state.inputKeyName
    var configType = 'SourceDestinationConfigSetUp'
    var jsonInfo = this.state.fileConfigInput
    var values = {key, configType, jsonInfo}
    var body = this.insertNewFileConfig(values);
    if (body)
    {
      alert(`Successfully Inserted New File Config in DynamoDB`)
    }
    else{
      alert(`Could not Insert New File Config in DynamoDB`)
    }
    //alert(`Pushed event to DynamoDB`)
    //console.log(this.state.schemaInput)

  }


  async insertNewSchema(toInput) {
    console.log('Coming here')
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
    //setMessage(body.id ? "Data sucessfully updated" : "Data updation failed");
  }



  handleSubmit2 = (event) => {
    //alert(`${this.state.inputSourceType}`)
    console.log('Key Name: ', this.state.inputKeyName)
    console.log('config to push:', this.state.schemaInput)

    var key = this.state.inputKeyName
    var configType = 'Schema'
    var jsonInfo = this.state.schemaInput
    var values = {key, configType, jsonInfo}
    var body = this.insertNewSchema(values);
    if (body)
    {
      alert(`Successfully Inserted New Schema in DynamoDB`)
    }
    else{
      alert(`Could not Insert New Schema in DynamoDB`)
    }
  }


  handleSubmit3 = (event) => {
    //alert(`${this.state.inputSourceType}`)
    console.log('Push this to DB')
    console.log('JobDetails to push:', this.state.submitJob)
    var key = ''
    var configType = ''
    var jsonInfo = this.state.submitJob
    var values = {key,configType,jsonInfo}

    var body = this.submitJobToEMR(values);
    if (body)
    {
      alert(`Successfully Submitted Job to EMR`)
    }
    else{
      alert(`Could not submit job to EMR`)
    }
    //alert(`Event pushed to JSON successfully`)
  }


  async submitJobToEMR(toInput) {
    console.log('Coming to Submitjob function')
    const response = await fetch("/metadataapi/submitjobtoemr", {
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
    //console.log(body);
    return body
    //setMessage(body.id ? "Data sucessfully updated" : "Data updation failed");
  }


save_fileConfig = function () {

    var fc=JSON.stringify(JSON.parse(this.state.fileConfigInput))
    var input = {
        "ResourceType": this.state.inputKeyName, "fileConfig":fc
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

save_schema = function () {

  var fc=JSON.stringify(JSON.parse(this.state.schemaInput))
  var input = {
      "ResourceType": this.state.inputKeyName, "schema":fc
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

update_schema = function () {
  console.log("inside_update")
  //var set_query = "SET #DatalakeConfig.ResourceType = :current, #DatalakeConfig.fileConfig = :prev, #DatalakeConfig.schema = :is_deployed, #DatalakeConfig.querycConfig = :current_status, #DatalakeConfig.predefinedSchemaS3Location = :current_status"

  var fc=JSON.stringify(JSON.parse(this.state.schemaInput))
  var params = {
    TableName: "DatalakeConfig",
    Key: { "ResourceType": this.state.inputKeyName },
    UpdateExpression: "set #s = :byUser",
    ExpressionAttributeNames: {
      '#s': "schema"
    },
    ExpressionAttributeValues: {
      ":byUser" : fc,
    },
    //ExpressionAttributeNames = {
      //'#service_name': service_name,
   //},
    ReturnValues: "UPDATED_NEW"
    }

  docClient.update(params, function (err, data) {

    if (err) {
        console.log("users::update::error - " + JSON.stringify(err, null, 2));
    } else {
        console.log("users::update::success ");
    }
    });

}

//save();
    


  render = (props) => {
    switch(this.props.value)
    {
      case "CreateFileConfig":
        {
          return (
            <>
            <Flex pl={"10%"} >
            <form onSubmit={this.handleSubmit}>
              <div>
                
                <div>{this.renderSourceSelect()}</div>
                <div><Sinks /></div>
                
                <Button type="submit" style={style.buttonDiv} variant="outlined" color = "primary"  onClick = {() => {this.setState({JSONselectedType:'1'})}}>Create</Button>
                
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
      case "CreateSchema":
        {
          return (
            <>
            <section>
            <div className="renderJSON">
            {this.renderJSONEditor("CreateSchema")}
              </div> 
            </section>
          </>
          );
        }
      
      case "SubmitJob":
        {
          return (
            <>
            <section>
            <div className="renderJSON">
            {this.renderJSONEditor("SubmitJob")}
              </div> 
            </section>
          </>
          );        
        }
      case "QueryConfig":
        {
          return (
             <None />
          );
        }
      case "Reference":
          {
            return (
              <PDF />
            );
          }
      
    }
    
  }

  renderSourceSelect(){
    return (
      <>
      
        <FormControl style={style.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Source</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={this.open}
            onClose={this.sourceHandleClose}
            onOpen={this.sourceHandleOpen}
            value={this.source}
            onChange={this.sourceHandleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'Files'}>Files</MenuItem>
            <MenuItem value={'Databases'}>Databases</MenuItem>
            <MenuItem value={'Kafka'}>Kafka</MenuItem>
            <MenuItem value={'FileStreaming'}>FileStreaming</MenuItem>
            <MenuItem value={'Kinesis'}>Kinesis</MenuItem>
          </Select>
        </FormControl>
      
      </>
    );
  }

  sourceHandleChange = (event) => {
    this.setState({source:event.target.value})
    //console.log(event.target.value)
  }

  sourceHandleClose = (event) => {
    this.setState({open:false})
  }

  sourceHandleOpen = (event) =>{
    this.setState({open:true})
  }




  renderJSONEditor(JSONselectedType){   

    if (!JSONselectedType)
      return <None />;

    if (JSONselectedType == '1')
      return (
      <>
      <Flex p={"50px"}>
      <JSONEditorReact
              text={this.state.fileConfigInput}
              mode={this.state.mode}
              modes={modes}
              indentation={4}
              onChangeText={this.onChangeFileConfig}
              onModeChange={this.onModeChange} 
          />
        </Flex>
        
        <Flex pl="5%">   
          <form onSubmit={this.handleSubmit1}>
          <div>
            <TextField required id="standard-required" label="Enter new key:" defaultValue="" value={this.inputKeyName} onChange={this.changeInputKeyName} /> 
            <Button type="submit" style={style.buttonDiv} color="primary" variant="outlined">Submit</Button> 
          </div>
          </form>
      </Flex>
        
       
      </>
    );

    if (JSONselectedType == 'CreateSchema')
      return (
      <>
        <Flex p={"50px"}>
        <JSONEditorReact
              
              text={this.state.schemaInput}
              mode={this.state.mode1}
              modes={modes}
              indentation={4}
              onChangeText={this.onChangeSchema}
              onModeChange={this.onModeChange1} 
          />
          </Flex>
          <Flex pl="10%">   
          <form onSubmit={this.handleSubmit2}>
          <div>
            <TextField required id="standard-required" label="Enter new key:" defaultValue="" value={this.inputKeyName} onChange={this.changeInputKeyName} /> 
            <Button type="submit" style={style.buttonDiv} variant="outlined" color = "primary">Submit</Button> 
          </div>
          </form>
      </Flex>
          
      </>
      );
      
      if (JSONselectedType == 'SubmitJob')
      return (
      <>
        <Flex p={"50px"}>
        
        <JSONEditorReact
              
              text={this.state.submitJob}
              mode={this.state.mode2}
              modes={modes}
              indentation={4}
              onChangeText={this.onChangeSubmit}
              onModeChange={this.onModeChange2} 
          />
          </Flex>
          <Flex pl="10%">   
          <form onSubmit={this.handleSubmit3}>
          <div> 
          
            <Button type="submit" style={style.buttonDiv} variant="outlined" color = "primary">Submit</Button> 
            
          </div>
          </form>
      </Flex>
          
    </>
    );
    

  }

  renderFormList(){
    return(
          <FormControl style={style.formControl}>
            <InputLabel id="demo-mutiple-name-label">Sink</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={this.sink}
              onChange={this.setSinkType}
              input={<Input />}
              //MenuProps={MenuProps}
            >
              {sinks.map((sink) => (
                <MenuItem key={sink} value={sink} style={this.getStyles(sink, sinks)}>
                  {sink}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
    );
  }



  onChangeFileConfig = (fileConfigInput) => {
    this.setState({ fileConfigInput });
  };

  onChangeSchema = (schemaInput) => {
    this.setState({ schemaInput });
  };

  onChangeSubmit = (submitJob) => {
    this.setState({ submitJob });
  };

  onModeChange = (mode) => {
    this.setState({ mode });
  };
  onModeChange1 = (mode1) => {
    this.setState({ mode1 });
  };
  onModeChange2 = (mode2) => {
    this.setState({ mode2 });
  };

  getStyles = (sink, sinks) => {
    return {
      fontWeight:
        sinks.indexOf(sink) === -1
    };
  }

  setSinkType = (event) => {
    //this.setState({sink:event.target.value});
    this.sink.push(event.target.value)
  };
    
}

export default CreateNew
