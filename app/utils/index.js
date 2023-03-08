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
import { insertOrUpdateToDBFunc } from './storage/querySqlite';
import {
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   filterArticleToListByContenu,
   cutTextWithBalise,
   checkAndsendMailFromLocalDBToAPI,
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
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   cutTextWithBalise,
   checkAndsendMailFromLocalDBToAPI,
   fetchTypesToApi,
   fetchContenusToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
   fetchDataToLocalDatabase,
   filterArticleToListByContenu,
};
