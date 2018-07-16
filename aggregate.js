/**
 * Aggregates GDP and Population Data by continentnents
 * @param {*} filePath
 */

const fs = require('fs');

const fileread = function (filepath) {
  return new Promise((resolve) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      resolve(data);
    });
  });
};

function csvtoarray(csv) {
  const csvrow = csv.split('\n');
  return csvrow.map(row => row.split(','));
}
const aggregate = () => new Promise((resolve) => {
  Promise.all([fileread('./data/datafile.csv'), fileread('./data/mapper.json')]).then((values) => {
    const mapper = JSON.parse(values[1]);
    const datasetrows = csvtoarray(values[0].replace(/"/g, ''));
    let countryIndex = 0;
    let populationIndex = 0;
    let gdpIndex = 0;
    for (let i = 0; i < datasetrows[0].length; i += 1) {
      if (datasetrows[0][i] === 'Country Name')countryIndex = i;
      if (datasetrows[0][i] === 'Population (Millions) - 2012')populationIndex = i;
      if (datasetrows[0][i] === 'GDP Billions (US Dollar) - 2012')gdpIndex = i;
    }

    const json = {};
    for (let i = 0; i < datasetrows.length - 2; i += 1) {
      if (mapper[datasetrows[i][countryIndex]] !== undefined) {
        const continent = mapper[datasetrows[i][countryIndex]];
        if (json[continent] === undefined) {
          json[continent] = {};
          json[continent].POPULATION_2012 = parseFloat(datasetrows[i][populationIndex]);
          json[continent].GDP_2012 = parseFloat(datasetrows[i][gdpIndex]);
        } else {
          json[continent].POPULATION_2012 += parseFloat(datasetrows[i][populationIndex]);
          json[continent].GDP_2012 += parseFloat(datasetrows[i][gdpIndex]);
        }
      }
    }
    const js = JSON.stringify(json);
    fs.writeFile('./output/output.json', js, 'utf8', () => {
      resolve();
    });
  });
});

module.exports = aggregate;
