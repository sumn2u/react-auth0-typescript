import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

export interface RootState {

}

export default combineReducers({

  router: routerReducer
});
