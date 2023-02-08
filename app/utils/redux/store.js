import { createStore } from 'redux';
import { reducer } from './reducers/reducer';

export const store = createStore(reducer);

/*store.subscribe(() => {
   console.log("State ato amin'ny store : ");
   console.log(store.getState());
});*/
