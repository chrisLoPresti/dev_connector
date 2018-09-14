import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";

const middleware = [thunk];
//the enhancer allows us to use the redux dev tools if the broswer supports it, or else we wont include it
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

let initialState = {};
const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
  // other store enhancers if any
);
const store = createStore(rootReducer, initialState, enhancer);

export default store;
