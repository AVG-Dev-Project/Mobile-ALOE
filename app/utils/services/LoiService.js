import { RouteAxios, transcriptAxios } from '_utils/services/urlAxios';

function speechToText(audioURL) {
   return transcriptAxios
      .post('/api/transcript', {
         audioURL,
      })
      .then((res) => {
         console.log(res);
      })
      .catch((e) => console.log('error service : ', e));
}

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
   sendMailToServ,
   speechToText,
};
