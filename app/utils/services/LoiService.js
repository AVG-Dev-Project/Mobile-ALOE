import { RouteAxios } from '_utils/services/urlAxios';

function getArticlesFromServ() {
   return RouteAxios.get('/article')
      .then((response) => {
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

function getContenusFromServ() {
   return RouteAxios.get('/contenu')
      .then((response) => {
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

function getThematiqueFromServ() {
   return RouteAxios.get('/thematique')
      .then((response) => {
         return response.data.results;
      })
      .catch((error) => {
         return error.message;
      });
}

function getTypeFromServ() {
   return RouteAxios.get('/type')
      .then((response) => {
         return response.data.results;
      })
      .catch((error) => {
         return error.message;
      });
}

export const LoiService = {
   getArticlesFromServ,
   getThematiqueFromServ,
   getTypeFromServ,
   getContenusFromServ,
};
