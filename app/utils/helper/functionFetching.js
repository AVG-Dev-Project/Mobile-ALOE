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
   if (results.length > 0) {
      insertOrUpdateToDBFunc('database', 'thematique', results);
   }
   return;
};

export const fetchTagsToApi = async () => {
   let results = await LoiService.getTagFromServ();
   if (results.length > 0) {
      insertOrUpdateToDBFunc('database', 'tag', results);
   }
   return;
};

export const fetchContenusToApi = async (currentPage) => {
   let res = await LoiService.getContenusFromServ(currentPage);
   if (res.results.length > 0) {
      insertOrUpdateToDBFunc(
         'database',
         'contenu',
         parseStructureDataForContenu(res.results)
      );
   }
   return res;
};

export const fetchArticlesByContenuToApi = async (contenuId, currentPage) => {
   let res = await LoiService.getArticlesByContenuFromServ(
      contenuId,
      currentPage
   );
   if (res.results.length > 0) {
      insertOrUpdateToDBFunc(
         'database',
         'article',
         parseStructureDataForArticle(res.results)
      );
   }
   return res;
};

export const fetchArticlesToApi = async (currentPage) => {
   let res = await LoiService.getArticlesFromServ(currentPage);
   if (res.results.length > 0) {
      insertOrUpdateToDBFunc(
         'database',
         'article',
         parseStructureDataForArticle(res.results)
      );
   }
   return;
};

export const fetchTypesToApi = async () => {
   let results = await LoiService.getTypeFromServ();
   if (results.length > 0) {
      insertOrUpdateToDBFunc('database', 'type', results);
   }
   return;
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
   //tag
   TagSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTags(results));
   });
};

export const fetchPartialDataForUpdating = (dispatcher) => {
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllThematiques(results));
   });
   //type
   TypeSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTypes(results));
   });
   //tag
   TagSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTags(results));
   });
};
