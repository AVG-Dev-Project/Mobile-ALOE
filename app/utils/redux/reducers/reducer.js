import { combineReducers } from 'redux';

import { loiReducer } from './loi_reducer';
import { functionnalityReducer } from './functionnality_reducer';

export const reducer = combineReducers({
   loi: loiReducer,
   fonctionnality: functionnalityReducer,
});
