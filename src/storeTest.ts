import { store } from './store';

const listener1 = store.subscribe(() => {
  console.error('listener1 getState:', store.getState());
})

const listener2 = store.subscribe(() => {
  console.error('listener2 getState:', store.getState());
})

const listener3 = store.subscribe(() => {
  console.error('listener3 getState:', store.getState());
})

setInterval(() => {
  store.dispatch({
    type: 'update',
    data: Date.now()
  })
}, 1000)