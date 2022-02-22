import React from 'react';
import { connect } from './react-redux';
import TestModel from './testModel';

interface IProps {
	testInfo: { display: any };
}

class App extends React.Component<IProps> {
	_testModel: TestModel;
	constructor(props: any) {
		super(props);

		this._testModel = new TestModel(props);

		setInterval(() => {
			this._testModel.update();
		}, 1000);
	}
	render(): React.ReactNode {
		const { display = '' } = this.props.testInfo;
		return <div>{display}</div>;
	}
}

const mapStateToProps = (state: { testInfo: any }) => {
	return {
		testInfo: state.testInfo,
	};
};

// @ts-ignore
export default connect(mapStateToProps)(App);
