const path = require('path');
const yargs = require('yargs');
const fs = require('fs');
var parseString = require('xml2js').parseString;
var _ = require('lodash');
const {result} = require('lodash');

const argv = yargs
  .command('icons', 'Where the icons are', {
    icons: {
      description: 'the year to check for',
      alias: 'i',
      type: 'string',
    },
  })
  .help()
  .alias('help', 'h').argv;

console.log(argv.icons);

const directoryPath = path.join(__dirname, `../${argv.icons}`);
console.log(directoryPath);

let IconPaths = {};

function main() {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const data = fs.readFileSync(`${directoryPath}/${file}`, {
      encoding: 'utf8',
      flag: 'r',
    });
    const name = _.upperFirst(_.camelCase(path.parse(file).name));
    let dValue = data.match(/ d=".*"/);
    if (dValue) {
      const dValueTrimmed = dValue[0].replace(' d=', '').replaceAll('"', '');
      IconPaths[name] = dValueTrimmed;
    }
    // xmlData.push({name, data});
  });

  fs.writeFileSync('./IconPaths.json', JSON.stringify(IconPaths), {
    encoding: 'utf-8',
  });
  // return xmlData;
}

main();

// fs.readdir(directoryPath, function (err, files) {
//   if (err) {
//     return console.log('unable to scan directory: ' + err);
//   }
//   // for each file in svg, get the d="" value
//   files.forEach(function (file) {
//     // fs.readFileSync(`${directoryPath}/${file}`, 'utf8', (err, data) => {
//     //   if (err) {
//     //     throw err;
//     //   }
//     //   parseString(data, (xmlerr, result) => {
//     //     if (xmlerr) {
//     //       throw xmlerr;
//     //     }
//     //     const name = _.upperFirst(_.camelCase(path.parse(file).name)); // => DoubleBarrel
//     //     console.log('file', name, ' === \n')
//     //     if (result.svg.path) {
//     //       IconPaths[name] = result.svg.path[0].$.d;
//     //       console.log(result.svg.path[0].$.d);
//     //     }
//     //   });
//     // });
//   });
// });

module.exports = IconPaths;
