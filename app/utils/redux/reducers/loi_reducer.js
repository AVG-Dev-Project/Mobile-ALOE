import { produce } from 'immer';
import {
   addFavoris,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
   getAllContenus,
   updateTagsChoice,
   getCurrentPageArticleForApi,
   getCurrentPageContenuForApi,
   getTotalPageApi,
   getAllTags,
} from '../actions/action_creators';

import { storeFavoriteIdToLocalStorage } from '../../storage/asyncStorage';

const initialState = {
   articles: [],
   thematiques: [],
   types: [],
   contenus: [],
   favoris: [],
   currentPageContenu: 1,
   currentPageArticle: 1,
   tagsChoice: [],
   tags: [],
   totalPage: {
      article: 0,
      contenu: 0,
   },
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
      case getCurrentPageContenuForApi().type:
         return produce(state, (draft) => {
            draft.currentPageContenu = action.payload;
         });
      case getCurrentPageArticleForApi().type:
         return produce(state, (draft) => {
            draft.currentPageArticle = action.payload;
         });
      case getTotalPageApi().type:
         return produce(state, (draft) => {
            if (action.payload[0] === 'contenu') {
               draft.totalPage.contenu = action.payload[1];
            }
            if (action.payload[0] === 'article') {
               draft.totalPage.article = action.payload[1];
            }
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

      default:
         return state;
   }
};
