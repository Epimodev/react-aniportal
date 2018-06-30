import { createElement, Fragment, Component, ChangeEvent } from 'react';
import { storiesOf } from '@storybook/react';
import AniPortal from './index';

// classNames are defined in `.storybook/preview-head.html`
const portalClassName = 'portal-example';
const portalClassNames = {
  enter: 'portal-example_enter',
  enterActive: 'portal-example_enter-active',
  leave: 'portal-example_leave',
  leaveActive: 'portal-example_leave-active',
};

storiesOf('MultiAutoComplete', module).add('default', () => <Example1 />);

class Example1 extends Component<{}, { opened: boolean; name: string }> {
  constructor(props: {}) {
    super(props);
    this.state = { opened: false, name: 'World' };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.changeName = this.changeName.bind(this);
  }
  openPortal() {
    this.setState({ opened: true });
  }
  closePortal() {
    this.setState({ opened: false });
  }
  changeName(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.currentTarget.value });
  }
  render() {
    return (
      <Fragment>
        <button onClick={this.openPortal}>Open portal</button>
        <input type="text" value={this.state.name} onChange={this.changeName} />
        {this.state.opened && (
          <AniPortal className={portalClassName} classNames={portalClassNames} timeout={500}>
            <Fragment>
              <div>Hello {this.state.name}</div>
              <button onClick={this.closePortal}>Close Portal</button>
            </Fragment>
          </AniPortal>
        )}
      </Fragment>
    );
  }
}
