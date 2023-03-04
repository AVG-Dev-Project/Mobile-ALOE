import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
} from '_utils/redux/actions/action_creators';
import { ArticleService } from '_utils/services/ArticleService';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
} from '_utils/storage/database';

export const fetchThematiquesToApi = async (dispatcher) => {
   let results = await ArticleService.getThematiqueFromServ();
   dispatcher(getAllThematiques(results));
};

export const fetchArticlesToApi = async (dispatcher) => {
   let results = await ArticleService.getArticlesFromServ();
   dispatcher(getAllArticles(results));
};

export const fetchContenusToApi = async (dispatcher) => {
   let results = await ArticleService.getContenusFromServ();
   dispatcher(getAllContenus(results));
};

export const fetchTypesToApi = async (dispatcher) => {
   let results = await ArticleService.getTypeFromServ();
   dispatcher(getAllTypes(results));
};

export const fetchDataToLocalDatabase = (dispatcher) => {
   //article
   ArticleSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllArticles(results));
      // console.log('Article mis dans store');
   });
   //contenu
   ContenuSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllContenus(results));
      // console.log('Contenus mis dans store');
   });
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllThematiques(results));
      // console.log('Thematique mis dans store');
   });
   //type
   TypeSchema.query({ columns: '*' }).then((results) => {
      dispatcher(getAllTypes(results));
      // console.log('Type mis dans store');
   });
};
