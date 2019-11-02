import { createElement, Fragment, useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import AniPortal from './index';
import { AnimationClassNames, AnimationStyles, PortalTimeout } from './types';

interface AniPortalProps {
  className?: string;
  classNames?: AnimationClassNames;
  style?: React.CSSProperties;
  styles?: AnimationStyles;
  timeout: PortalTimeout;
  portalDidUpdate?: () => void;
  withoutLocalFocus?: boolean;
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

storiesOf('AniPortal', module)
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

const Example: React.FC<AniPortalProps> = props => {
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState('World');

  const togglePortal = () => {
    setOpened(o => !o);
  };
  const closePortal = () => {
    setOpened(false);
  };
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  return (
    <Fragment>
      <button onClick={togglePortal}>{opened ? 'Close portal' : 'Open portal'}</button>
      <input type="text" value={name} onChange={changeName} />
      {opened && (
        <AniPortal {...props}>
          <Fragment>
            <div>Hello {name}</div>
            <button onClick={closePortal}>Close</button>
            <button onClick={() => alert('Validate!!!')}>Validate</button>
            <PortalChildren />
          </Fragment>
        </AniPortal>
      )}
    </Fragment>
  );
};

const WithClassToogle: React.FC = () => {
  const [currentClassName, setCurrentClassName] = useState('portal-example');
  const [currentStyle, setCurrentStyle] = useState<React.CSSProperties | undefined>();

  const toggleClass = () => {
    setCurrentClassName(className =>
      className === 'portal-example' ? 'portal-example portal-example_purple' : 'portal-example',
    );
  };
  const toggleStyle = () => {
    setCurrentStyle(style => {
      if (style === partialStyle1) {
        return partialStyle2;
      }
      if (style === partialStyle2) {
        return undefined;
      }
      return partialStyle1;
    });
  };

  return (
    <Fragment>
      <button onClick={toggleClass}>Change className</button>
      <button onClick={toggleStyle}>Change style</button>
      <AniPortal
        className={currentClassName}
        classNames={portalClassNames}
        style={currentStyle}
        timeout={500}
      >
        <div>Hello World</div>
      </AniPortal>
    </Fragment>
  );
};

// Component create to check componentWillUnmount is well called when AniPortal is unmounted
const PortalChildren: React.FC = ({ children }) => {
  useEffect(() => {
    return () => {
      console.log('portal children component will unmount');
    };
  }, []);

  return <Fragment>{children}</Fragment> || null;
};
