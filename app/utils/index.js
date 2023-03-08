import { nameStackNavigation } from './constante/NameStackNavigation';
import { ContexteProvider, Contexte } from './contexte/Contexte';
import { LoiService } from './services/LoiService';
import {
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
   storeFavoriteIdToLocalStorage,
   getFavoriteFromLocalStorage,
} from './storage/asyncStorage';
import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   DoleanceSchema,
} from './storage/database';
import { insertOrUpdateToDBFunc, removeDoleance } from './storage/querySqlite';
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
   storeFavoriteIdToLocalStorage,
   getFavoriteFromLocalStorage,
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   DoleanceSchema,
   insertOrUpdateToDBFunc,
   removeDoleance,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   cutTextWithBalise,
   fetchTypesToApi,
   fetchContenusToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchDataToLocalDatabase,
   filterArticleToListByContenu,
};
