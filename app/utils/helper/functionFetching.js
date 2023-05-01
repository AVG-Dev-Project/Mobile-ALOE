import { insertOrUpdateToDBFunc } from '../storage/querySqlite';
import {
   parseStructureDataForArticle,
   parseStructureDataForContenu,
} from './functionHelpler';
import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllTags,
   getAllContenus,
   getCurrentPageContenuForApi,
   getCurrentPageArticleForApi,
   getTotalPageApi,
} from '_utils/redux/actions/action_creators';
import { LoiService } from '_utils/services/LoiService';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   TagSchema,
} from '_utils/storage/database';

export const fetchThematiquesToApi = async () => {
   let results = await LoiService.getThematiqueFromServ();
   return insertOrUpdateToDBFunc('database', 'thematique', results);
};

export const fetchTagsToApi = async () => {
   let results = await LoiService.getTagFromServ();
   return insertOrUpdateToDBFunc('database', 'tag', results);
};

export const fetchContenusToApi = async (currentPage, dispatcher) => {
   let res = await LoiService.getContenusFromServ(currentPage);
   dispatcher(getCurrentPageContenuForApi(currentPage + 1));
   dispatcher(getTotalPageApi(['contenu', res.pages_count ?? 0]));
   insertOrUpdateToDBFunc(
      'database',
      'contenu',
      parseStructureDataForContenu(res.results)
   );
   return res;
};

export const fetchArticlesByContenuToApi = async (contenuId, currentPage) => {
   let res = await LoiService.getArticlesByContenuFromServ(
      contenuId,
      currentPage
   );
   insertOrUpdateToDBFunc(
      'database',
      'article',
      parseStructureDataForArticle(res.results)
   );
   return res;
};

export const fetchArticlesToApi = async (currentPage, dispatcher) => {
   let res = await LoiService.getArticlesFromServ(currentPage);
   dispatcher(getCurrentPageArticleForApi(currentPage + 1));
   dispatcher(getTotalPageApi(['article', res.pages_count]));
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

//offline
export const fetchAllDataToLocalDatabase = (dispatcher) => {
   //article
   ArticleSchema.query({ columns: '*', order: 'id ASC' }).then((results) => {
      dispatcher(getAllArticles(results));
   });
   //contenu
   ContenuSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllContenus(results));
   });
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllThematiques(results));
   });
   //type
   TypeSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTypes(results));
   });
   TagSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTags(results));
   });
};
