import { produce } from 'immer';
import {
   getStarted,
   changeLanguage,
   isConnectedToInternet,
} from '../actions/action_creators';

const initialState = {
   started: false,
   langue: 'fr',
   isConnectedToInternet: null,
};

export const functionnalityReducer = (state = initialState, action) => {
   switch (action.type) {
      case getStarted().type:
         return produce(state, (draft) => {
            draft.started = !draft.started;
         });
      case changeLanguage().type:
         return produce(state, (draft) => {
            draft.langue = action.payload;
         });
      case isConnectedToInternet().type:
         return produce(state, (draft) => {
            draft.isConnectedToInternet = action.payload;
         });
      default:
         return state;
   }
};
