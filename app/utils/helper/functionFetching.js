import {
   getAllArticles,
   getAllThematiques,
   getAllTypes,
} from '_utils/redux/actions/action_creators';
import { ArticleService } from '_utils/services/ArticleService';

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
