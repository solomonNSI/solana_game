const fs = require('fs');
const idl = require('./target/idl/coinflip.json');

fs.writeFileSync('./app/app/src/idl.json', JSON.stringify(idl));
console.log("Done");