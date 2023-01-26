import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import app from '../reducers/index';

export default function configureStore() {
  // store = createStore(app, applyMiddleware(thunk, logger));
  // const store = compose(applyMiddleware(...middlewares))(createStore)(app);
  let store = createStore(app, applyMiddleware(thunk));

  return store;
}
