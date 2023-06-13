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
   let res = await LoiService.getThematiqueFromServ();
   if (res.results?.length > 0) {
      insertOrUpdateToDBFunc('database', 'thematique', res.results);
   }
   return res;
};

export const fetchTagsToApi = async () => {
   let res = await LoiService.getTagFromServ();
   if (res.results?.length > 0) {
      insertOrUpdateToDBFunc('database', 'tag', res.results);
   }
   return res;
};

export const fetchContenusToApi = async (currentPage) => {
   let res = await LoiService.getContenusFromServ(currentPage);
   if (res.results?.length > 0) {
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
   if (res.results?.length > 0) {
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
   if (res.results?.length > 0) {
      insertOrUpdateToDBFunc(
         'database',
         'article',
         parseStructureDataForArticle(res.results)
      );
   }
   return res;
};

export const fetchTypesToApi = async () => {
   let res = await LoiService.getTypeFromServ();
   if (res.results?.length > 0) {
      insertOrUpdateToDBFunc('database', 'type', res.results);
   }
   return res;
};

//offline
export const fetchAllDataToLocalDatabase = async (dispatcher) => {
   //article
   ArticleSchema.query({ columns: '*', order: 'id ASC' }).then((results) => {
      dispatcher(getAllArticles(results));
   });
   //contenu
   ContenuSchema.query({ columns: '*', order: 'numero ASC' }).then(
      (results) => {
         dispatcher(getAllContenus(results));
      }
   );
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllThematiques(results));
   });
   //type
   TypeSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTypes(results));
   });
   //tag
   await TagSchema.query({ columns: '*' }).then((results) => {
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
