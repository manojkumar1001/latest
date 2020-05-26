var source_db = '{"version":1,"source":{"databases":[{"sourcetype":"sys_bic.upos_s02","format":"jdbc","dbInputOptions":{"url":"","dbtable":"","driver":"com.sap.db.jdbc.Driver","user":"SVCAWSDWH","password":"iveL4SWA"},"dbOutputOptions":[{"outputFormat":"parquet","savemode":"Append","numberOfOutputPartitions":"1","outputDirectory":"s3://dms-ingestion-encrypted-levis/ingestion_output_UPOS_S02_final/"}],"dbErrorOptions":{"outputFormat":"csv","savemode":"Append","numberOfOutputPartitions":"1","continueOnError":true,"outputDirectory":"/Users/sahookir/Desktop/Code/error/inventory/"},"hooks":[]}]}}';
var athena_hook = {"hooktype":"athena","hookoptions":[{"type":"read","options":{}},{"type":"write","options":{"athenaDB":"deltadb","athenaTable":"customers","athenaDir":"s3://dms-ingestion-encrypted-levis/athena/","region":"us-west-2","athenaMsckQuery":"MSCKREPAIRTABLEcustomers","athenaAlterTableQuery":"AlterTABLEcustomersADD","tblproperties":""}}]};
var File_ObjectStorage = {"outputFormat":"delta","savemode":"Overwrite","outputDirectory":"s3://dms-ingestion-encrypted-levis/delta_output/customers","partitioncolumns":"state_code"}
//console.log(source_db)

//console.log(source_db['source']['databaes'][0])
//out = surce_db[source][]

obj = JSON.parse(source_db);

var out = obj['source']['databases'][0]['hooks'].push(athena_hook);
obj['source']['databases'][0]['hooks'].push(athena_hook);
obj['source']['files'][0]['fileOutputOptions'].push(File_ObjectStorage);


out = JSON.parse(out)

//console.log(obj['source']['databases'][0]['hooks']);
//console.log(obj['source']['databases'][0]['hooks'][0]);
console.log(obj['source']['databases'][0]['hooks'])

//console.log(obj['source']['databases'][0]['hooks'][0]);
