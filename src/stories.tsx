import { createElement, Fragment, Component } from 'react';
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

class Example1 extends Component<{}, { opened: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { opened: false };
    this.openPortal = this.openPortal.bind(this);
    this.closePortal = this.closePortal.bind(this);
  }
  openPortal() {
    this.setState({ opened: true });
  }
  closePortal() {
    this.setState({ opened: false });
  }
  render() {
    return (
      <Fragment>
        <button onClick={this.openPortal}>Open portal</button>
        {this.state.opened && (
          <AniPortal className={portalClassName} classNames={portalClassNames} timeout={1000}>
            <Fragment>
              Hello Portal
              <button onClick={this.closePortal}>Close Portal</button>
            </Fragment>
          </AniPortal>
        )}
      </Fragment>
    );
  }
}
