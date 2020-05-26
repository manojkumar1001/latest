
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com"
};
AWS.config.update(awsConfig);
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

let docClient = new AWS.DynamoDB.DocumentClient();

async function fetchOneByKey1(key){
    
    function fetchOneByKey(key) {
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
                console.log("Yu gorjin");
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
    
    let out = await fetchOneByKey(key);
    console.log(out);
    }
   
fetchOneByKey1('customerfiledata');


//{this.renderJSONEditor(this.state.JSONselectedType)}