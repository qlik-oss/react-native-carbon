const {execSync} = require('child_process');
const fs = require('fs');
let carbonPackage = require('../package.json');
let carbonAppPackage = require('../example/CarbonApp/package.json');

let devBuild = carbonPackage['dev-build'];
let fileName = `react-native-carbon.dev.${devBuild}.tgz`;
carbonAppPackage.dependencies[
  '@qlik/react-native-carbon'
] = `file:../../${fileName}`;
devBuild = devBuild + 1;
carbonPackage['dev-build'] = devBuild;

fs.writeFileSync(
  './example/CarbonApp/package.json',
  JSON.stringify(carbonAppPackage, null, 2),
);
fs.writeFileSync('./package.json', JSON.stringify(carbonPackage, null, 2));

// in case you have no params to pass through
execSync(`yarn pack --filename ${fileName}`, {stdio: 'inherit', cwd: '.'});
