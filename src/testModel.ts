abstract class BaseModel {
  protected dispatch: Function | undefined;
  constructor(props?: { dispatch?: Function }) {
    if (props?.dispatch) {
      this.dispatch = props.dispatch
    }
  }
}

export default class TestModel extends BaseModel {
  update = () => {
    this.dispatch!({
      type: 'update',
      data: Date.now()
    })
  }
}

const INITIAL_STATE = {
  display: true
};

export function testInfo(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case 'update':
      state = {
        display: action.data
      };
      break;
  }
  return state;
}