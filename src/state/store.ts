import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import reducers from "./reducers/userReducer";
import mySaga from "./saga";

// Creating a saga middleware that watches the relevant action before reducers get them
// So that saga can use those actions for async. tasks 
const sagaMiddleware = createSagaMiddleware();

// Creating a store with the combined reducer, and configuration to apply saga.
export const store = createStore(reducers, applyMiddleware(sagaMiddleware));

// finally, run the combined saga wather function so that Saga is activated.
sagaMiddleware.run(mySaga);