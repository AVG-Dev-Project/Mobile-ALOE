import { insertOrUpdateToDBFunc } from '../storage/querySqlite';
import {
   parseStructureDataForArticle,
   parseStructureDataForContenu,
} from './functionHelpler';
import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
   getCurrentPageForLocal,
   getCurrentPageForApi,
} from '_utils/redux/actions/action_creators';
import { LoiService } from '_utils/services/LoiService';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
} from '_utils/storage/database';
import { storeDataToLocalStorage } from '_utils/storage/asyncStorage';

export const fetchThematiquesToApi = async () => {
   let results = await LoiService.getThematiqueFromServ();
   return insertOrUpdateToDBFunc('database', 'thematique', results);
};

export const fetchContenusToApi = async (currentPage) => {
   let res = await LoiService.getContenusFromServ(currentPage);
   return insertOrUpdateToDBFunc(
      'database',
      'contenu',
      parseStructureDataForContenu(res.results)
   );
};

export const fetchArticlesToApi = async (currentPage, dispatcher) => {
   let res = await LoiService.getArticlesFromServ(currentPage);
   dispatcher(getCurrentPageForApi(currentPage + 1));
   //storeDataToLocalStorage('currentPageApi', (currentPage + 1).toString());
   return insertOrUpdateToDBFunc(
      'database',
      'article',
      parseStructureDataForArticle(res.results)
   );
};

export const fetchTypesToApi = async () => {
   let results = await LoiService.getTypeFromServ();
   return insertOrUpdateToDBFunc('database', 'type', results);
};

export const fetchArtiContenuToLocalDatabase = (dispatcher, page) => {
   //article
   ArticleSchema.query({ columns: '*', page: page, limit: 50 }).then(
      (results) => {
         dispatcher(getAllArticles(results));
      }
   );
   //contenu
   ContenuSchema.query({ columns: '*', page: page, limit: 10 }).then(
      (results) => {
         dispatcher(getAllContenus(results));
         dispatcher(getCurrentPageForLocal(page + 1));
      }
   );
};

export const fetchTypeThemToLocalDatabase = (dispatcher) => {
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllThematiques(results));
   });
   //type
   TypeSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTypes(results));
   });
};
