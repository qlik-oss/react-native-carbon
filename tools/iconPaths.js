const path = require('path');
const yargs = require('yargs');
const fs = require('fs');
var _ = require('lodash');
const {XMLParser} = require('fast-xml-parser');

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
  const options = {
    ignoreAttributes: false,
  };
  const parser = new XMLParser(options);

  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const data = fs.readFileSync(`${directoryPath}/${file}`, {
      encoding: 'utf8',
      flag: 'r',
    });
    const name = _.upperFirst(_.camelCase(path.parse(file).name));
    let jsonObj = parser.parse(data);

    if (Array.isArray(jsonObj.svg.path)) {
      const value = jsonObj.svg.path.map((a) => {
        return a['@_d'];
      });
      IconPaths[name] = value;
    } else {
      if (jsonObj?.svg?.path) {
        IconPaths[name] = jsonObj.svg.path['@_d'];
      }
    }
  });

  fs.writeFileSync('./IconPaths.json', JSON.stringify(IconPaths, null, '\t'), {
    encoding: 'utf-8',
  });
}

main();

module.exports = IconPaths;
