import {
   ADD_FAVORIS,
   GET_ALL_ARTICLES,
   GET_STARTED,
   GET_ALL_THEMATIQUES,
   GET_ALL_TYPES,
   GET_ALL_CONTENUS,
   CHANGE_LANGUAGE,
   IS_NETWORK_ACTIVE,
   IS_CONNECTED_TO_INTERNET,
   CURRENT_PAGE_CONTENU_FOR_API,
   CURRENT_PAGE_ARTICLE_FOR_API,
   TOTAL_PAGE_API,
   CHECK_STATUS_DATA,
   UPDATE_LIST_TAG_CHOICE
} from './action_names';

export const getStarted = () => ({
   type: GET_STARTED,
});

export const changeLanguage = (langue) => ({
   type: CHANGE_LANGUAGE,
   payload: langue,
});

export const getAllArticles = (articles) => ({
   type: GET_ALL_ARTICLES,
   payload: articles,
});

export const getAllThematiques = (thematiques) => ({
   type: GET_ALL_THEMATIQUES,
   payload: thematiques,
});

export const getAllTypes = (types) => ({
   type: GET_ALL_TYPES,
   payload: types,
});

export const getAllContenus = (contenus) => ({
   type: GET_ALL_CONTENUS,
   payload: contenus,
});

export const addFavoris = (idArticle) => ({
   type: ADD_FAVORIS,
   payload: idArticle,
});

export const isNetworkActive = (status) => ({
   type: IS_NETWORK_ACTIVE,
   payload: status,
});

export const isConnectedToInternet = (status) => ({
   type: IS_CONNECTED_TO_INTERNET,
   payload: status,
});

export const getCurrentPageContenuForApi = (numberPage) => ({
   type: CURRENT_PAGE_CONTENU_FOR_API,
   payload: numberPage,
});

export const getCurrentPageArticleForApi = (numberPage) => ({
   type: CURRENT_PAGE_ARTICLE_FOR_API,
   payload: numberPage,
});

export const getTotalPageApi = (array) => ({
   type: TOTAL_PAGE_API,
   payload: array,
});

export const checktatusData = (status) => ({
   type: CHECK_STATUS_DATA,
   payload: status
})

export const updateTagsChoice = (tag) => ({
   type: UPDATE_LIST_TAG_CHOICE,
   payload: tag
})