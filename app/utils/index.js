import { nameStackNavigation } from './constante/NameStackNavigation';
import { ContexteProvider, Contexte } from './contexte/Contexte';
import { LoiService } from './services/LoiService';
import {
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
} from './storage/asyncStorage';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   FavorisSchema,
} from './storage/database';
import { insertOrUpdateToDBFunc } from './storage/querySqlite';
import {
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   filterArticleToListByContenu,
   cutTextWithBalise,
} from './helper/functionHelpler';

import {
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchContenusToApi,
   fetchDataToLocalDatabase,
   fetchFav,
} from './helper/functionFetching';

export {
   nameStackNavigation,
   ContexteProvider,
   Contexte,
   LoiService,
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   FavorisSchema,
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   cutTextWithBalise,
   fetchTypesToApi,
   fetchContenusToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchDataToLocalDatabase,
   filterArticleToListByContenu,
   fetchFav,
};
