import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory({});
// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history);
const middleware = applyMiddleware(thunk, logger, historyMiddleware);
const Store = createStore(reducers, middleware);

export { history as history };
export default Store;
