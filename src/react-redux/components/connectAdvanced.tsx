// @ts-nocheck
import hoistStatics from 'hoist-non-react-statics';
import React, { Component, PureComponent } from 'react';
import { isContextConsumer } from 'react-is';

import { ReactReduxContext } from './Context';

export default function connectAdvanced(
	selectorFactory,
	{
		getDisplayName = (name) => `ConnectAdvanced(${name})`,
		methodName = 'connectAdvanced',
		renderCountProp = undefined,
		shouldHandleStateChanges = true,
		storeKey = 'store',
		withRef = false,
		forwardRef = false,
		context = ReactReduxContext,
		...connectOptions
	} = {}
) {
	const Context = context;

	return function wrapWithConnect(WrappedComponent) {
		const wrappedComponentName =
			WrappedComponent.displayName || WrappedComponent.name || 'Component';

		const displayName = getDisplayName(wrappedComponentName);

		const selectorFactoryOptions = {
			...connectOptions,
			getDisplayName,
			methodName,
			renderCountProp,
			shouldHandleStateChanges,
			storeKey,
			displayName,
			wrappedComponentName,
			WrappedComponent,
		};

		const { pure } = connectOptions;

		let OuterBaseComponent = Component;

		if (pure) {
			OuterBaseComponent = PureComponent;
		}

		function makeDerivedPropsSelector() {
			let lastProps;
			let lastState;
			let lastDerivedProps;
			let lastStore;
			let lastSelectorFactoryOptions;
			let sourceSelector;

			return function selectDerivedProps(
				state,
				props,
				store,
				selectorFactoryOptions
			) {
				if (pure && lastProps === props && lastState === state) {
					return lastDerivedProps;
				}

				if (
					store !== lastStore ||
					lastSelectorFactoryOptions !== selectorFactoryOptions
				) {
					lastStore = store;
					lastSelectorFactoryOptions = selectorFactoryOptions;
					sourceSelector = selectorFactory(store.dispatch, selectorFactoryOptions);
				}

				lastProps = props;
				lastState = state;

				const nextProps = sourceSelector(state, props);

				lastDerivedProps = nextProps;
				return lastDerivedProps;
			};
		}

		function makeChildElementSelector() {
			let lastChildProps, lastForwardRef, lastChildElement, lastComponent;

			return function selectChildElement(
				WrappedComponent,
				childProps,
				forwardRef
			) {
				if (
					childProps !== lastChildProps ||
					forwardRef !== lastForwardRef ||
					lastComponent !== WrappedComponent
				) {
					lastChildProps = childProps;
					lastForwardRef = forwardRef;
					lastComponent = WrappedComponent;
					lastChildElement = <WrappedComponent {...childProps} ref={forwardRef} />;
				}

				return lastChildElement;
			};
		}

		class Connect extends OuterBaseComponent {
			constructor(props) {
				super(props);
				this.selectDerivedProps = makeDerivedPropsSelector();
				this.selectChildElement = makeChildElementSelector();
				this.indirectRenderWrappedComponent =
					this.indirectRenderWrappedComponent.bind(this);
			}

			indirectRenderWrappedComponent(value) {
				// calling renderWrappedComponent on prototype from indirectRenderWrappedComponent bound to `this`
				return this.renderWrappedComponent(value);
			}

			renderWrappedComponent(value) {
				const { storeState, store } = value;

				let wrapperProps = this.props;
				let forwardedRef;

				if (forwardRef) {
					wrapperProps = this.props.wrapperProps;
					forwardedRef = this.props.forwardedRef;
				}

				let derivedProps = this.selectDerivedProps(
					storeState,
					wrapperProps,
					store,
					selectorFactoryOptions
				);

				return this.selectChildElement(
					WrappedComponent,
					derivedProps,
					forwardedRef
				);
			}

			render() {
				const ContextToUse =
					this.props.context &&
					this.props.context.Consumer &&
					isContextConsumer(<this.props.context.Consumer />)
						? this.props.context
						: Context;

				return (
					<ContextToUse.Consumer>
						{this.indirectRenderWrappedComponent}
					</ContextToUse.Consumer>
				);
			}
		}

		Connect.WrappedComponent = WrappedComponent;
		Connect.displayName = displayName;

		if (forwardRef) {
			const forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
				return <Connect wrapperProps={props} forwardedRef={ref} />;
			});

			forwarded.displayName = displayName;
			forwarded.WrappedComponent = WrappedComponent;
			return hoistStatics(forwarded, WrappedComponent);
		}

		return hoistStatics(Connect, WrappedComponent);
	};
}
