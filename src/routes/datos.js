const { Router } = require('express');
const router = Router();
const fetch = require("node-fetch");

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

async function getEntitiesByRange({startId, endId}){
    const entitiesIds = range(endId - startId + 1, startId);
    const promises = entitiesIds.map(async (entityId) => {
        const response = await fetch(`https://awovcw7p76.execute-api.us-east-1.amazonaws.com/dev/entity/v2.1/entities/${entityId}`);
        const entity = await response.json();
        return entity;
    });
    const data = await Promise.all(promises);
    return data;
}

router.get('/datos/:rango', (req, res) => {

    const rango = req.params.rango.split("-");
    rIni = parseInt(rango[0]);
    rFin = parseInt(rango[1]);
    if(rIni > rFin) {
      return res.status(400).send("Codigo 400: Error en validación datos de entrada");
    }
    if(rIni < 1 || rFin > 20){
      return res.status(404).send("Codigo 404: Error no se encuentra para rango especificado");
    }
   
    getEntitiesByRange({ startId: rIni, endId: rFin }).then((result) => {
      const datos = [];
      for (i = 0; i < result.length; i++) {
        datos.push(result[i].data);
        if(result[i].code === "F133"){
          return res.status(400).send("Codigo 400: Error en validación datos de entrada");
        }
      }
      ordenar(datos);
      console.log(datos);
      res.json(datos);
    }); 
    
});

function ordenar(arrayJson) {
    arrayJson.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
}

module.exports = router;