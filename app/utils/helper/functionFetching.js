import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
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

export const fetchTypesToApi = async (dispatcher) => {
   let results = await ArticleService.getTypeFromServ();
   dispatcher(getAllTypes(results));
};

export const fetchDataToLocalDatabase = (dispatcher) => {
   //article
   ArticleSchema.query({ columns: '*' }).then((res) =>
      dispatcher(getAllTypes(results))
   );
   //contenu
   ContenuSchema.query({ columns: '*' }).then((res) =>
      dispatcher(getAllTypes(results))
   );
   //thematique
   ThematiqueSchema.query({ columns: '*' }).then((res) =>
      dispatcher(getAllTypes(results))
   );
   //type
   TypeSchema.query({ columns: '*' }).then((res) =>
      dispatcher(getAllTypes(results))
   );
};
