const fs = require('fs');
const path = require('path');
const mocha = require('mocha');
const suite = new mocha();
fs.readdir(path.join(__dirname,'integration'), (err, files)=>{
if (err) throw err;
files.filter((filname)=>(filname.match(/\.js$/))).map((filname)=>{
    suite.addFile(path.join(__dirname,'integration', filname));

});
suite.run((failure)=>{
    process.exit(failure);
});


});