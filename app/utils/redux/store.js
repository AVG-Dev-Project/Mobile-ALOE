import { createStore } from 'redux';
import { reducer } from './reducers/reducer';

export const store = createStore(reducer);

/*store.subscribe(() => {
   console.log("Article ato amin'ny store : ");
   console.log(store.getState());
});*/
