import {
   ADD_FAVORIS,
   GET_ALL_ARTICLES,
   GET_STARTED,
   GET_ALL_THEMATIQUES,
   GET_ALL_TYPES,
   GET_ALL_CONTENUS,
   CHANGE_LANGUAGE,
   IS_NETWORK_ACTIVE,
   CURRENT_PAGE_FOR_API,
   IS_CONNECTED_TO_INTERNET,
   CURRENT_PAGE_FOR_LOCAL,
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

export const getCurrentPageForApi = (numberPage) => ({
   type: CURRENT_PAGE_FOR_API,
   payload: numberPage,
});

export const getCurrentPageForLocal = (numberPage) => ({
   type: CURRENT_PAGE_FOR_LOCAL,
   payload: numberPage,
});
