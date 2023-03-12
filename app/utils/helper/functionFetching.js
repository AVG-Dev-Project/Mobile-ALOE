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
} from '_utils/redux/actions/action_creators';
import { LoiService } from '_utils/services/LoiService';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
} from '_utils/storage/database';

export const fetchThematiquesToApi = async () => {
   let results = await LoiService.getThematiqueFromServ();
   return insertOrUpdateToDBFunc('database', 'thematique', results);
};

export const fetchArticlesToApi = async () => {
   let res = await LoiService.getArticlesFromServ();
   return insertOrUpdateToDBFunc(
      'database',
      'article',
      parseStructureDataForArticle(res.results)
   );
};

export const fetchContenusToApi = async () => {
   let res = await LoiService.getContenusFromServ();
   return insertOrUpdateToDBFunc(
      'database',
      'contenu',
      parseStructureDataForContenu(res.results)
   );
};

export const fetchTypesToApi = async () => {
   let results = await LoiService.getTypeFromServ();
   return insertOrUpdateToDBFunc('database', 'type', results);
};

export const fetchArtiContenuToLocalDatabase = (dispatcher) => {
   //article
   ArticleSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllArticles(results));
   });
   //contenu
   ContenuSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllContenus(results));
   });
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
