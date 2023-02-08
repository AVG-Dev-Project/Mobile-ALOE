import { produce } from 'immer';
import { getStarted, changeLanguage } from '../actions/action_creators';

const initialState = {
   started: false,
   langue: 'fr',
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
      default:
         return state;
   }
};
