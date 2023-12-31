import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(
    reducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__(),
);
export default store;
