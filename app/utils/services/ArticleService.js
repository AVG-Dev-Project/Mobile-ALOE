import { RouteAxios } from '_utils/services/urlAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getArticlesFromServ() {
   return RouteAxios.get('/article')
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
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

function getTypeFromServ() {
   return RouteAxios.get('/type')
      .then((response) => {
         return response.data;
      })
      .catch((error) => {
         return error.message;
      });
}

export const ArticleService = {
   getArticlesFromServ,
   getThematiqueFromServ,
   getTypeFromServ,
};
