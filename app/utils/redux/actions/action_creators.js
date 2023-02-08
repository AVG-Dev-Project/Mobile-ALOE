import {
   ADD_FAVORIS,
   GET_ALL_ARTICLES,
   GET_STARTED,
   GET_ALL_THEMATIQUES,
   GET_ALL_TYPES,
   CHANGE_LANGUAGE,
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

export const addFavoris = (article) => ({
   type: ADD_FAVORIS,
   payload: article,
});
