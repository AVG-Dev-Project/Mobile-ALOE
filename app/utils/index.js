import { nameStackNavigation } from './constante/NameStackNavigation';
import { ContexteProvider, Contexte } from './contexte/Contexte';
import { positionOfAllPolice } from './constante/CoordinatePolice';
import {
   AllArticles,
   ArticleLastPublish,
   Thematique,
   Types,
} from './constante/Data';
import { ArticleService } from './services/ArticleService';
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
} from './storage/database';
import { insertOrUpdateToDBFunc } from './storage/querySqlite';
import {
   parseStructureDataForArticle,
   parseStructureDataForContenu,
} from './helper/functionHelpler';

import {
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
} from './helper/functionFetching';

export {
   nameStackNavigation,
   ContexteProvider,
   Contexte,
   positionOfAllPolice,
   ArticleLastPublish,
   AllArticles,
   Types,
   Thematique,
   ArticleService,
   storeDataToLocalStorage,
   getDataFromLocalStorage,
   removeInLocalStorage,
   getAllKeys,
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   insertOrUpdateToDBFunc,
   parseStructureDataForArticle,
   parseStructureDataForContenu,
   fetchTypesToApi,
   fetchArticlesToApi,
   fetchThematiquesToApi,
};
