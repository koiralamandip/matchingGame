import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import reducers from "./reducers/userReducer";
import mySaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(mySaga);