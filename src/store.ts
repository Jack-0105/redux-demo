import { createStore, applyMiddleware, compose } from './redux';
import rootReducer from './reducers'
import { createLogger } from './redux-logger';

const middlewares: never[] = []

if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
  middlewares.push(createLogger() as unknown as never)
}

const middlewareFuncs = applyMiddleware(middlewares);

const enhancer = compose(middlewareFuncs);
const store = createStore(rootReducer, enhancer);

export { store };