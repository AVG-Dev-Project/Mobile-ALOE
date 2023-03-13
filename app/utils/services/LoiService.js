import { RouteAxios } from '_utils/services/urlAxios';

function sendMailToServ(mail, objet, contenu) {
   return RouteAxios.post(
      '/doleance',
      {
         mail,
         objet,
         contenu,
      },
      {
         headers: {
            'Content-Type': 'application/json',
         },
      }
   );
}

function getArticlesFromServ(page) {
   return RouteAxios.get(`/article?page=${page}`)
      .then((response) => {
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

function getArticlesByContenuFromServ(contenuId,page) {
   return RouteAxios.get(`/article?contenu__id=${contenuId}&page=${page}`)
      .then((response) => {
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

function getContenusFromServ(page) {
   return RouteAxios.get(`/contenu?page=${page}`)
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
   getArticlesByContenuFromServ,
   getThematiqueFromServ,
   getTypeFromServ,
   getContenusFromServ,
   sendMailToServ,
};
