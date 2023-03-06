import { produce } from 'immer';
import {
   addFavoris,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
} from '../actions/action_creators';

import { storeFavoriteIdToLocalStorage } from '../../storage/asyncStorage';

const initialState = {
   articles: [],
   thematiques: [],
   types: [],
   contenus: [],
   favoris: [],
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
      case getAllContenus().type:
         return produce(state, (draft) => {
            draft.contenus = action.payload;
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
