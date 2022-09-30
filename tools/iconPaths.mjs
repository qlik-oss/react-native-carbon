import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import fs from 'fs';
import _ from 'lodash';
import {XMLParser} from 'fast-xml-parser';
// const {XMLParser} = require('fast-xml-parser');
// const d3Path = require('d3-path');
import * as d3Path from 'd3-path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const argv = yargs(hideBin(process.argv))
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
    attributeNamePrefix : "_"
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
        return a['_d'];
      });
      IconPaths[name] = value;
    } else {
      if (jsonObj?.svg?.path) {
        IconPaths[name] = [jsonObj.svg.path['_d']];
      }
    }


    if(jsonObj.svg.circle) {
      if(!Array.isArray(jsonObj.svg.circle)) {
        const context = d3Path.path();
        context.arc(jsonObj.svg.circle._cx, jsonObj.svg.circle._cy, jsonObj.svg.circle._r, 0, 2 * Math.PI);
        IconPaths?.[name]?.push(context.toString());
      } else {
        const circles = jsonObj.svg.circle.map((c) => {
          const context = d3Path.path();
          context.arc(c._cx, c._cy, c._r, 0, 2 * Math.PI);
          return context.toString();
        });
        IconPaths?.[name]?.push(...circles);
      }
    }

  });

  fs.writeFileSync('./IconPaths.json', JSON.stringify(IconPaths, null, '\t'), {
    encoding: 'utf-8',
  });
}

main();

// module.exports = IconPaths;
