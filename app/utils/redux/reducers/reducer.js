import { combineReducers } from 'redux';

import { articleReducer } from './article_reducer';
import { functionnalityReducer } from './functionnality_reducer';

export const reducer = combineReducers({
   article: articleReducer,
   fonctionnality: functionnalityReducer,
});
