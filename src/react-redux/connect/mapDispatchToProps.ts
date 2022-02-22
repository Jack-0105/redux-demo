import { bindActionCreators } from '../../redux'
import { ActionCreator, ActionCreatorsMapObject, AnyAction } from '../../redux/types/actions'
import { Dispatch } from '../../redux/types/store'
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps'

export function whenMapDispatchToPropsIsFunction(mapDispatchToProps: any) {
  return typeof mapDispatchToProps === 'function'
    ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps')
    : undefined
}

export function whenMapDispatchToPropsIsMissing(mapDispatchToProps: any) {
  return !mapDispatchToProps
    ? wrapMapToPropsConstant((dispatch: any) => ({ dispatch }))
    : undefined
}

export function whenMapDispatchToPropsIsObject(mapDispatchToProps: ActionCreator<any, any[]> | ActionCreatorsMapObject<any, any[]>) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object'
    ? wrapMapToPropsConstant((dispatch: Dispatch<AnyAction>) =>
      bindActionCreators(mapDispatchToProps, dispatch)
    )
    : undefined
}

export default [
  whenMapDispatchToPropsIsFunction,
  whenMapDispatchToPropsIsMissing,
  whenMapDispatchToPropsIsObject
]
