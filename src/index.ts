import { useRef, useEffect } from 'react';
import { render as renderDOM, unmountComponentAtNode } from 'react-dom';
import * as classnames from 'classnames';

type PortalTimeout = number | { enter: number; exit: number };

interface AnimationClassNames {
  enter?: string;
  enterActive?: string;
  exit?: string;
  exitActive?: string;
}

interface AnimationStyles {
  enter?: React.CSSProperties;
  enterActive?: React.CSSProperties;
  exit?: React.CSSProperties;
  exitActive?: React.CSSProperties;
}

interface Props {
  children: React.ReactElement<any>;
  className?: string;
  classNames?: AnimationClassNames;
  style?: React.CSSProperties;
  styles?: AnimationStyles;
  timeout: PortalTimeout;
  portalDidUpdate?: () => void;
}

function getEnterTimeout(timeout: PortalTimeout): number {
  if (typeof timeout === 'number') {
    return timeout;
  }
  return timeout.enter;
}

function getExitTimeout(timeout: PortalTimeout): number {
  if (typeof timeout === 'number') {
    return timeout;
  }
  return timeout.exit;
}

function getEnterActiveStyle(
  style: React.CSSProperties,
  styles: AnimationStyles,
): React.CSSProperties {
  const enterStyle = styles.enter || {};
  const enterActiveStyle = styles.enterActive || {};
  return { ...style, ...enterStyle, ...enterActiveStyle };
}

function getRemovedProperties(
  currentStyle: React.CSSProperties | undefined,
  style: React.CSSProperties | undefined,
): string[] {
  if (!currentStyle) {
    return [];
  }
  if (!style) {
    return Object.keys(currentStyle);
  }
  return Object.keys(currentStyle).filter(currentKey => !(style as any)[currentKey]);
}

function appendContainerStyle(container: HTMLDivElement, style: React.CSSProperties): void {
  Object.keys(style).forEach(property => {
    container.style[property as any] = (style as any)[property];
  });
}

function updateContainerStyle(
  container: HTMLDivElement,
  currentStyle: React.CSSProperties | undefined,
  style: React.CSSProperties | undefined,
) {
  const removedProperties = getRemovedProperties(currentStyle, style);
  removedProperties.forEach(property => {
    container.style[property as any] = '';
  });
  if (style) {
    Object.keys(style).forEach(property => {
      container.style[property as any] = (style as any)[property];
    });
  }
}

function waitNextFrame(callback: () => void): number {
  return window.setTimeout(callback, 20);
}

const AniPortal: React.FC<Props> = ({
  children,
  className = '',
  classNames = {},
  style,
  styles,
  timeout,
  portalDidUpdate,
}) => {
  const mounted = useRef(false);
  const container = useRef<HTMLDivElement | null>(null);
  const currentStyle = useRef<React.CSSProperties | undefined>(style);

  // component mount
  useEffect(() => {
    let requestFrame = 0;
    let enterTimer = 0;
    container.current = document.createElement('div');

    // compute timeout
    const enterTimeout = getEnterTimeout(timeout);

    // set enter class
    const enterClassName = classnames(className, classNames.enter);
    const enterActiveClassName = classnames(className, classNames.enter, classNames.enterActive);
    container.current.className = enterClassName;

    // set enter style
    if (style !== undefined) appendContainerStyle(container.current, style);
    if (styles !== undefined && styles.enter !== undefined) {
      appendContainerStyle(container.current, styles.enter);
    }

    document.body.appendChild(container.current);

    // render component
    renderDOM(children, container.current, () => {
      requestFrame = waitNextFrame(() => {
        // set enterActive class and style
        container.current!.className = enterActiveClassName;
        if (styles !== undefined && styles.enterActive !== undefined) {
          appendContainerStyle(container.current!, styles.enterActive);
        }

        enterTimer = window.setTimeout(() => {
          if (container.current) {
            mounted.current = true;
            // remove animation class and style
            container.current.className = className;
            const enterStyleActive = getEnterActiveStyle(style || {}, styles || {});
            updateContainerStyle(container.current, enterStyleActive, style);
          }
        }, enterTimeout);
      });
    });

    // component unmount
    return () => {
      mounted.current = false;
      clearTimeout(requestFrame);
      clearTimeout(enterTimer);

      if (container.current) {
        // compute timeout
        const exitTimeout = getExitTimeout(timeout);

        // set exit class
        const exitClassName = classnames(className, classNames!.exit);
        const exitActiveClassName = classnames(className, classNames!.exit, classNames!.exitActive);
        container.current.className = exitClassName;

        // set exit style
        if (styles !== undefined && styles.exit !== undefined) {
          appendContainerStyle(container.current, styles.exit);
        }

        waitNextFrame(() => {
          // set exitActive class and style
          container.current!.className = exitActiveClassName;
          if (styles !== undefined && styles.exitActive !== undefined) {
            appendContainerStyle(container.current!, styles.exitActive);
          }

          setTimeout(() => {
            // unmount react component
            unmountComponentAtNode(container.current!);

            // remove portal
            waitNextFrame(() => {
              document.body.removeChild(container.current!);
              container.current = null;
            });
          }, exitTimeout);
        });
      }
    };
  }, []);

  // update children
  useEffect(() => {
    renderDOM(children, container.current, portalDidUpdate);
  }, [children]);

  // update className
  useEffect(() => {
    if (container.current && mounted.current) {
      container.current.className = className;

      if (portalDidUpdate) portalDidUpdate();
    }
  }, [className]);

  // update style
  useEffect(() => {
    if (container.current && mounted.current) {
      updateContainerStyle(container.current, currentStyle.current, style);
      currentStyle.current = style;

      if (portalDidUpdate) portalDidUpdate();
    }
  }, [style]);

  return null;
};

AniPortal.displayName = 'AniPortal';

export default AniPortal;
