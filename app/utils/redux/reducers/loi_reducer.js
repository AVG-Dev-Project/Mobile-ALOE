import { produce } from 'immer';
import {
   addFavoris,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
   getCurrentPageForLocal,
   getCurrentPageForApi,
} from '../actions/action_creators';

import { storeFavoriteIdToLocalStorage } from '../../storage/asyncStorage';

const initialState = {
   articles: [],
   thematiques: [],
   types: [],
   contenus: [],
   favoris: [],
   currentPage: null,
   currentPageLocal: 1,
};

export const loiReducer = (state = initialState, action) => {
   switch (action.type) {
      case getAllArticles().type:
         return produce(state, (draft) => {
            draft.articles = action.payload;
         });
      case getAllThematiques().type:
         return produce(state, (draft) => {
            draft.thematiques = action.payload;
         });
      case getAllTypes().type:
         return produce(state, (draft) => {
            draft.types = action.payload;
         });
      case getCurrentPageForApi().type:
         return produce(state, (draft) => {
            draft.currentPage = action.payload;
         });
      case getCurrentPageForLocal().type:
         return produce(state, (draft) => {
            draft.currentPageLocal = action.payload;
         });
      case getAllContenus().type:
         return produce(state, (draft) => {
            action.payload.forEach((payload) => {
               if (
                  !draft.contenus.find((contenu) => contenu.id === payload.id)
               ) {
                  draft.contenus.push(payload);
               }
            });
         });
      case addFavoris().type:
         if (Array.isArray(action.payload)) {
            return produce(state, (draft) => {
               draft.favoris = action.payload;
            });
         } else {
            return produce(state, (draft) => {
               if (state.favoris.includes(action.payload)) {
                  draft.favoris = draft.favoris.filter(
                     (favoriId) => favoriId !== action.payload
                  );
               } else {
                  draft.favoris.push(action.payload);
               }
               storeFavoriteIdToLocalStorage(draft.favoris);
            });
         }

      default:
         return state;
   }
};
