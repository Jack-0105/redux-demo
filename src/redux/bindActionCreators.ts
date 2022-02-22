import { Dispatch } from './types/store'
import { AnyAction, ActionCreator, ActionCreatorsMapObject } from './types/actions'
import { kindOf } from './utils/kindOf'

function bindActionCreator<A extends AnyAction = AnyAction>(actionCreator: ActionCreator<A>, dispatch: Dispatch) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}

export default function bindActionCreators(actionCreators: ActionCreator<any> | ActionCreatorsMapObject, dispatch: Dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${kindOf(
        actionCreators
      )}'. ` +
      `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
