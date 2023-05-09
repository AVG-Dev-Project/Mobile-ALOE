import { produce } from 'immer';
import {
   addFavoris,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
   updateTagsChoice,
   getAllTags,
   dataForStatistique
} from '../actions/action_creators';

import { storeFavoriteIdToLocalStorage } from '../../storage/asyncStorage';

const initialState = {
   articles: [],
   thematiques: [],
   types: [],
   contenus: [],
   favoris: [],
   tagsChoice: [],
   tags: [],
   statistique: {
      article: 0,
      contenu: 0
   }
};

export const loiReducer = (state = initialState, action) => {
   switch (action.type) {
      case getAllArticles().type:
         return produce(state, (draft) => {
            action.payload.forEach((payload) => {
               if (
                  !draft.articles.find((article) => article.id === payload.id)
               ) {
                  draft.articles.push(payload);
               }
            });
         });
      case getAllThematiques().type:
         return produce(state, (draft) => {
            draft.thematiques = action.payload;
         });
      case getAllTypes().type:
         return produce(state, (draft) => {
            draft.types = action.payload;
         });
      case getAllTags().type:
         return produce(state, (draft) => {
            draft.tags = action.payload;
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
      case updateTagsChoice().type:
         if (Array.isArray(action.payload)) {
            return produce(state, (draft) => {
               draft.tagsChoice = [];
            });
         } else {
            return produce(state, (draft) => {
               if (state.tagsChoice.includes(action.payload)) {
                  draft.tagsChoice = draft.tagsChoice.filter(
                     (tag) => tag !== action.payload
                  );
               } else {
                  draft.tagsChoice.push(action.payload);
               }
            });
         }
      case dataForStatistique().type:
         return produce(state, (draft) => {
            if(action.payload.statsFor === 'article'){
               draft.statistique.article = action.payload.value;
            }
            if(action.payload.statsFor === 'contenu'){
               draft.statistique.contenu = action.payload.value;
            }
         })

      default:
         return state;
   }
};
