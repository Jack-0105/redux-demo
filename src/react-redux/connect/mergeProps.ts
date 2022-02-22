export function defaultMergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}

export function wrapMergePropsFunc(mergeProps: (arg0: any, arg1: any, arg2: any) => any) {
  return function initMergePropsProxy(
    dispatch: any,
    { displayName, pure, areMergedPropsEqual }: any
  ) {
    let hasRunOnce = false
    let mergedProps: any

    return function mergePropsProxy(stateProps: any, dispatchProps: any, ownProps: any) {
      const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps)

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps))
          mergedProps = nextMergedProps
      } else {
        hasRunOnce = true
        mergedProps = nextMergedProps
      }

      return mergedProps
    }
  }
}

export function whenMergePropsIsFunction(mergeProps: any) {
  return typeof mergeProps === 'function'
    ? wrapMergePropsFunc(mergeProps)
    : undefined
}

export function whenMergePropsIsOmitted(mergeProps: any) {
  return !mergeProps ? () => defaultMergeProps : undefined
}

export default [whenMergePropsIsFunction, whenMergePropsIsOmitted]
