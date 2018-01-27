import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

export interface Global {
  document: Document;
  window: Window;
  localStorage: any;
  context:any
}

declare var global: Global;
var context = {
  router:{
    route:{
      location:{
        pathname : 'login'
      }
    }
  }
}
var localStorageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      const item = store[key];
      return item === undefined ? null : item;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

global.localStorage = localStorageMock;
global.context = context;
