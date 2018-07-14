/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');

const filepath1 = './data/datafile.csv';
const filepath2 = './data/all.csv';

const pro1 = function readFilePromisified(filename) {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(filename, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    },
  );
};

const pro2 = function readFilePromisified(filename) {
  return new Promise(
    (resolve, reject) => {
      fs.readFile(filename, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    },
  );
};

const aggregate = () => new Promise((resolve) => {
  Promise.all([pro1(filepath1), pro2(filepath2)]).then((values) => {
    const myfile = values[0];
    const myfile2 = values[1];

    const CountryRow = myfile.split('\n');
    const CountryRowArray = [];
    let i = 0;

    for (let k = 0; k < CountryRow.length; k += 1) {
      CountryRowArray[k] = CountryRow[k].split(',');
    }

    const map1 = new Map();

    const maprow = myfile2.split('\n');

    for (i = 0; i < maprow.length; i += 1) {
      const temp = maprow[i].split(',');
      map1.set(`"${temp[0]}"`, temp[5]);
    }

    const a = ['South America', 'Oceania', 'North America', 'Asia', 'Europe', 'Africa'];
    const obj = {};

    for (i = 0; i < a.length; i += 1) {
      obj[a[i]] = {};
      obj[a[i]].GDP_2012 = 0;
      obj[a[i]].POPULATION_2012 = 0;
    }

    for (i = 1; i < CountryRowArray.length - 1; i += 1) {
      const continent = map1.get(CountryRowArray[i][0]);
      const pop = parseFloat(CountryRowArray[i][4].substr(1, (CountryRowArray[i][4].length - 2)));
      const gdp = parseFloat(CountryRowArray[i][7].substr(1, (CountryRowArray[i][7].length - 2)));

      if (continent !== undefined) {
        obj[continent].GDP_2012 += gdp;
        obj[continent].POPULATION_2012 += pop;
      }
    }
    const j = JSON.stringify(obj);
    fs.writeFile('./output/output.json', j, 'utf8', (err, data) => {
      resolve(data);
    });
  });
});

module.exports = aggregate;
