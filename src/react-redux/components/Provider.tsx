import React from 'react';
import { ReactReduxContext } from './Context';

interface IProps {
	store: {
		subscribe: Function;
		dispatch: Function;
		getState: Function;
	};
	context?: any;
	children?: any;
}

interface IStates {
	storeState: any;
  store: any;
}

class Provider extends React.Component<IProps, IStates> {
	private _isMounted: boolean = false;
	public unsubscribe: Function | undefined;
	constructor(props: IProps) {
		super(props);

		const { store } = props;
		this.state = {
			storeState: store.getState(),
			store,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.subscribe();
	}

	componentWillUnmount() {
		if (this.unsubscribe) this.unsubscribe();

		this._isMounted = false;
	}

	componentDidUpdate(prevProps: any) {
		if (this.props.store !== prevProps.store) {
			if (this.unsubscribe) this.unsubscribe();

			this.subscribe();
		}
	}

	subscribe() {
		const { store } = this.props;

		this.unsubscribe = store.subscribe(() => {
			const newStoreState = store.getState();

			if (!this._isMounted) {
				return;
			}

			this.setState((providerState: any) => {
				// If the value is the same, skip the unnecessary state update.
				if (providerState.storeState === newStoreState) {
					return null;
				}

				return { storeState: newStoreState };
			});
		});

		// Actions might have been dispatched between render and mount - handle those
		const postMountStoreState = store.getState();
		if (postMountStoreState !== this.state.storeState) {
			this.setState({ storeState: postMountStoreState });
		}
	}

	render() {
		const Context = this.props.context || ReactReduxContext;

		return (
			<Context.Provider value={this.state}>{this.props.children}</Context.Provider>
		);
	}
}

export default Provider;
