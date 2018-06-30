import { createElement, Fragment, Component, ChangeEvent, CSSProperties } from 'react';
import { storiesOf } from '@storybook/react';
import AniPortal from './index';

interface AniPortalProps {
  className?: string;
  classNames?: {
    enter?: string;
    enterActive?: string;
    exit?: string;
    exitActive?: string;
  };
  style?: CSSProperties;
  styles?: {
    enter?: CSSProperties;
    enterActive?: CSSProperties;
    exit?: CSSProperties;
    exitActive?: CSSProperties;
  };
  timeout: number | { enter: number; exit: number };
}

// classNames are defined in `.storybook/preview-head.html`
const portalClassName = 'portal-example';
const portalClassNames = {
  enter: 'portal-example_enter',
  enterActive: 'portal-example_enter-active',
  exit: 'portal-example_exit',
  exitActive: 'portal-example_exit-active',
};
const portalClassNames2 = {
  ...portalClassNames,
  exit: `portal-example_exit_long`,
};
const portalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 0)',
  width: '400px',
  height: '200px',
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#2ecc71',
  color: 'white',
  borderRadius: '5px',
  transition: '500ms',
};
const portalStyles = {
  enter: {
    opacity: 0,
    transform: 'translate3d(-50%, -100%, 0)',
  },
  enterActive: {
    opacity: 1,
    transform: 'translate3d(-50%, -50%, 0)',
  },
  exit: {
    opacity: 1,
    transform: 'translate3d(-50%, -50%, 0)',
  },
  exitActive: {
    opacity: 0,
    transform: 'translate3d(-50%, 0, 0)',
  },
};
const portalStyles2 = {
  ...portalStyles,
  exit: {
    ...portalStyles.exit,
    transition: '2000ms',
  },
};
const customTimeout = {
  enter: 500,
  exit: 2000,
};
const partialStyle1 = {
  backgroundColor: '#e74c3c',
};
const partialStyle2 = {
  backgroundColor: '#3498db',
};

storiesOf('MultiAutoComplete', module)
  .add('With classNames', () => (
    <Example className={portalClassName} classNames={portalClassNames} timeout={500} />
  ))
  .add('With classNames and different timeout', () => (
    <Example className={portalClassName} classNames={portalClassNames2} timeout={customTimeout} />
  ))
  .add('With styles', () => <Example style={portalStyle} styles={portalStyles} timeout={500} />)
  .add('With styles and different timeout', () => (
    <Example style={portalStyle} styles={portalStyles2} timeout={customTimeout} />
  ))
  .add('With className update', () => <WithClassToogle />);

class Example extends Component<AniPortalProps, { opened: boolean; name: string }> {
  constructor(props: AniPortalProps) {
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
          <AniPortal {...this.props}>
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

class WithClassToogle extends Component<
  {},
  { currentClassName: string; currentStyle?: CSSProperties }
> {
  constructor(props: AniPortalProps) {
    super(props);
    this.state = { currentClassName: 'portal-example' };
    this.toogleClass = this.toogleClass.bind(this);
    this.toogleStyle = this.toogleStyle.bind(this);
  }
  toogleClass() {
    this.setState(state => ({
      currentClassName:
        state.currentClassName === 'portal-example'
          ? 'portal-example portal-example_purple'
          : 'portal-example',
    }));
  }
  toogleStyle() {
    this.setState(state => {
      if (state.currentStyle === partialStyle1) {
        return { currentStyle: partialStyle2 };
      }
      if (state.currentStyle === partialStyle2) {
        return { currentStyle: undefined };
      }
      return { currentStyle: partialStyle1 };
    });
  }
  render() {
    return (
      <Fragment>
        <button onClick={this.toogleClass}>Change className</button>
        <button onClick={this.toogleStyle}>Change style</button>
        <AniPortal
          className={this.state.currentClassName}
          classNames={portalClassNames}
          style={this.state.currentStyle}
          timeout={500}
        >
          <div>Hello World</div>
        </AniPortal>
      </Fragment>
    );
  }
}
