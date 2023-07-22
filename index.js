const { error } = require('console');
const fs = require('fs');

fs.readFile('./files/lorem.txt','utf-8',(err,data)=>{
	if(err) throw err;
	console.log(data);
}) 

process.on('uncaughtException',err=>{
	console.error(`There was an unchaught error: ${err}`);
	process.exit(1)
})