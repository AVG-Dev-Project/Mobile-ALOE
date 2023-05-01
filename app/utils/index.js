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
   checkAndsendMailFromLocalDBToAPI,
   parsingTags,
   parseDataArticleLazyLoading,
   parseDataContenuLazyLoading,
} from './helper/functionHelpler';

import {
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchArticlesByContenuToApi,
   fetchThematiquesToApi,
   fetchContenusToApi,
   fetchAllDataToLocalDatabase,
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
   checkAndsendMailFromLocalDBToAPI,
   parsingTags,
   fetchTypesToApi,
   parseDataArticleLazyLoading,
   parseDataContenuLazyLoading,
   fetchContenusToApi,
   fetchArticlesToApi,
   fetchArticlesByContenuToApi,
   fetchThematiquesToApi,
   fetchAllDataToLocalDatabase,
   filterArticleToListByContenu,
};
