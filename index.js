const express = require('express');
const fs = require('fs').promises;

let allCities = [];
global.allStates = [];

async function createJSONsByState () {
  try {
    let data = await fs.readFile("Estados.json", "utf8")
    let states = JSON.parse(data);
    global.allStates = states;

    global.allStates.map(state => {
      const stateFileName = `./states/${state.Sigla}.json`;
      insertCitysIntoStates(state, stateFileName);
      //console.log(state);
    });

    //console.log(allStates);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: "Estados.json"\n${err.message}`);
  }
}

async function insertCitysIntoStates(state, stateFileName) {
  let allCitiesByState = [];
  
  try {
    let data = await fs.readFile("Cidades.json", "utf8");
    let jsonCitys = JSON.parse(data);
    allCities = jsonCitys;
    allCitiesByState = allCities.filter(city => city.Estado == state.ID);
  } catch (err) {
    console.log(`Erro na leitura do arquivo "Cidades.json": \n${err.message}`);
  }
 
  try {
    const jsonToSave = {
              id: state.ID,
              citys: allCitiesByState
            };
  
    await fs.writeFile(stateFileName, JSON.stringify(jsonToSave));
  } catch (err) {
    console.log(`Erro na gravação do arquivo "${stateFileName}": \n${err.message}`);
  }
}

async function getCitiesByState(uf) {
  let allCitiesByState = [];
  try {
    let data = await fs.readFile(`./states/${uf}.json`, "utf8");
    let jsonCitiesByState = JSON.parse(data);
      
    allCitiesByState = jsonCitiesByState.citys;

  } catch (err) {
    console.log(`Erro na leitura do arquivo ./states/${uf}.json\n${err.message}`);
  }

  allCitiesByState.map((city) => {
    console.log(`Estado: ${uf} ID: ${city.ID} Cidade: ${city.Nome}`);
  });
}

async function getTopFiveLargestCities() {
  let countCitiesByState = [];
  let countAllStates = 0;
  let top5 = [];

  try {
    let data = await fs.readFile("Estados.json", "utf8")
    let states = JSON.parse(data);
    countAllStates = states.length;

    let dataCities = await fs.readFile("Cidades.json", "utf8");
    let cities = JSON.parse(dataCities);

    for (let i = 1; i <= countAllStates; i++) {
      let citysByState = cities.filter((city => city.Estado == i));
      const jsonCitiesByState = {
        ID: i,
        UF: states[i-1].Sigla,
        count: citysByState.length
      }
      countCitiesByState.push(jsonCitiesByState);
    }
  } catch (err) {
    console.error(`Erro ao ler o arquivo: "Estados.json"\n${err.message}`);
  }
    
  
  countCitiesByState.sort((a, b) => {
    if(a.count < b.count) return 1;
    else if(a.count > b.count) return -1;
    else return 0;
  });
  
  console.log("Estados com mais cidades: \n", countCitiesByState);

  for (let i = 0; i < 5; i++) {
    top5.push(countCitiesByState[i]);
  }
  
  let sumCitiesTopFiveLargestStates = top5.reduce((acc, cur) => {
    return acc + cur.count;
  }, 0);
  console.log("Top 5 estados com mais cidades: \n", top5);
  console.log("Soma das cidades top 5: ", sumCitiesTopFiveLargestStates);
}

async function getTopFiveSmallestStates() {
  let countCitiesByState = [];
  let countAllStates = 0;
  let top5 = [];

  try {
    let data = await fs.readFile("Estados.json", "utf8")
    let states = JSON.parse(data);
    countAllStates = states.length;

    let dataCities = await fs.readFile("Cidades.json", "utf8");
    let cities = JSON.parse(dataCities);

    for (let i = 1; i <= countAllStates; i++) {
      let citysByState = cities.filter((city => city.Estado == i));
      const jsonCitiesByState = {
        ID: i,
        UF: states[i-1].Sigla,
        count: citysByState.length
      }
      countCitiesByState.push(jsonCitiesByState);
    }
  } catch (err) {
    console.error(`Erro ao ler o arquivo: "Estados.json"\n${err.message}`);
  }
  
  countCitiesByState.sort((a, b) => {
    if(a.count < b.count) return -1;
    else if(a.count > b.count) return 1;
    else return 0;
  });
  
  for (let i = 4; i >= 0; i--) {
    top5.push(countCitiesByState[i]);
  }

  let sumCitiesTopFiveSmallestStates = top5.reduce((acc, cur) => {
    return acc + cur.count;
  }, 0);
  
  console.log("Top 5 estados com menos cidades: \n", top5);
  console.log("Soma das cidades: ", sumCitiesTopFiveSmallestStates);
}

async function getCitiesWithBiggestName() {
  let countStates = 27;
  let citiesBiggestName = [];
  let allCitiesByState = [];

  let dataStates = await fs.readFile("Estados.json", "utf-8");
  let jsonStates = JSON.parse(dataStates);

  for (let i = 0; i < countStates; i++) {
    let stateFileName = `./states/${jsonStates[i].Sigla}.json`;
    
    let dataState = await fs.readFile(stateFileName, "utf-8");
    let jsonState = JSON.parse(dataState);
    allCitiesByState = jsonState.citys;

    allCitiesByState.sort((a, b) => {
      if(a.Nome.length < b.Nome.length) return 1;
      else if(a.Nome.length > b.Nome.length) return -1;
      else return 0;
    });
    
    if (allCitiesByState.length > 1) {
      if (allCitiesByState[0].Nome.length == allCitiesByState[1].Nome.length) {
        let cityBiggestName = [];
        cityBiggestName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
        cityBiggestName.push(`${allCitiesByState[1].Nome} - ${jsonStates[i].Sigla}`);

        cityBiggestName.sort();

        citiesBiggestName.push(cityBiggestName[0]);
      } else {
        citiesBiggestName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
      }
    } else {
      citiesBiggestName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
    }
  }
  console.log("final: ", citiesBiggestName.length, citiesBiggestName);
}

async function getCitiesWithSmallerName() {
  let countStates = 27;
  let citiesSmallerName = [];
  let allCitiesByState = [];

  let dataStates = await fs.readFile("Estados.json", "utf-8");
  let jsonStates = JSON.parse(dataStates);

  for (let i = 0; i < countStates; i++) {
    let stateFileName = `./states/${jsonStates[i].Sigla}.json`;
    
    let dataState = await fs.readFile(stateFileName, "utf-8");
    let jsonState = JSON.parse(dataState);
    allCitiesByState = jsonState.citys;

    allCitiesByState.sort((a, b) => {
      if(a.Nome.length < b.Nome.length) return -1;
      else if(a.Nome.length > b.Nome.length) return 1;
      else return 0;
    });

    if (allCitiesByState.length > 1) {
      if (allCitiesByState[0].Nome.length == allCitiesByState[1].Nome.length) {
        let citySmallerName = [];
        citySmallerName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
        citySmallerName.push(`${allCitiesByState[1].Nome} - ${jsonStates[i].Sigla}`);

        citySmallerName.sort();

        citiesSmallerName.push(citySmallerName[0]);
      } else {
        citiesSmallerName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
      }
    } else {
      citiesSmallerName.push(`${allCitiesByState[0].Nome} - ${jsonStates[i].Sigla}`);
    }
  }
  console.log(citiesSmallerName);
}

async function getCityWithBiggestName() {
  let cityBiggestName = [];

  let dataStates = await fs.readFile("Estados.json", "utf-8");
  let jsonStates = JSON.parse(dataStates);

  let data = await fs.readFile("Cidades.json", "utf8");
  let jsonCitys = JSON.parse(data);

  jsonCitys.sort((a, b) => {
    if(a.Nome.length < b.Nome.length) return 1;
    else if(a.Nome.length > b.Nome.length) return -1;
    else return 0;
  });

  let lengthBiggestCity = jsonCitys[0].Nome.length;

  let citysBiggestName = jsonCitys.filter ((city) => city.Nome.length == lengthBiggestCity);

  citysBiggestName.sort((a, b) => {
    if(a.Nome < b.Nome) return 1;
    else if(a.Nome > b.Nome) return -1;
    else return 0;
  });

  let ufId = citysBiggestName[0].Estado;
  let uf = jsonStates.filter((state) => state.ID == ufId);

  console.log(`${citysBiggestName[0].Nome} - ${uf[0].Sigla}`);
}

async function getCityWithSmallerName() {
  let citySmallerName = [];

  let dataStates = await fs.readFile("Estados.json", "utf-8");
  let jsonStates = JSON.parse(dataStates);

  let data = await fs.readFile("Cidades.json", "utf8");
  let jsonCitys = JSON.parse(data);

  jsonCitys.sort((a, b) => {
    if(a.Nome.length < b.Nome.length) return -1;
    else if(a.Nome.length > b.Nome.length) return 1;
    else return 0;
  });

  let lengthSmallerCity = jsonCitys[0].Nome.length;

  let citysSmallerName = jsonCitys.filter ((city) => city.Nome.length == lengthSmallerCity);

  citysSmallerName.sort((a, b) => {
    if(a.Nome < b.Nome) return -1;
    else if(a.Nome > b.Nome) return 1;
    else return 0;
  });

  let ufId = citysSmallerName[0].Estado;
  let uf = jsonStates.filter((state) => state.ID == ufId);

  console.log(`${citysSmallerName[0].Nome} - ${uf[0].Sigla}`);
}

//createJSONsByState();
//getCitiesByState("AC");
//getTopFiveLargestCities();
//getTopFiveSmallestStates();
//getCitiesWithBiggestName();
//getCitiesWithSmallerName();
//getCityWithBiggestName();
//getCityWithSmallerName();