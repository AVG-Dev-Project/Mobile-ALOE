import { produce } from 'immer';
import {
   getStarted,
   changeLanguage,
   isNetworkActive,
   isConnectedToInternet,
   checktatusData,
   hideShowTabBar,
   passValueForDeepSearch,
} from '../actions/action_creators';

const initialState = {
   started: false,
   langue: 'fr',
   isNetworkActive: null,
   isConnectedToInternet: null,
   isDataAvailable: false,
   isTabBarHide: false,
   valueForDeepSearch: null,
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
      case isNetworkActive().type:
         return produce(state, (draft) => {
            draft.isNetworkActive = action.payload;
         });
      case isConnectedToInternet().type:
         return produce(state, (draft) => {
            draft.isConnectedToInternet = action.payload;
         });
      case checktatusData().type:
         return produce(state, (draft) => {
            draft.isDataAvailable = action.payload;
         });
      case hideShowTabBar().type:
         return produce(state, (draft) => {
            draft.isTabBarHide = action.payload;
         });
      case passValueForDeepSearch().type:
         return produce(state, (draft) => {
            draft.valueForDeepSearch = action.payload;
         });
      default:
         return state;
   }
};
