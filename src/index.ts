import { useState, useRef, useEffect } from 'react';
import { render as renderDOM, unmountComponentAtNode } from 'react-dom';
import * as classnames from 'classnames';
import {
  getEnterTimeout,
  getExitTimeout,
  getEnterActiveStyle,
  appendContainerStyle,
  updateContainerStyle,
  waitNextFrame,
  useLocalFocus,
} from './utils';
import { AnimationClassNames, AnimationStyles, PortalTimeout } from './types';

interface Props {
  children: React.ReactElement<any>;
  className?: string;
  classNames?: AnimationClassNames;
  style?: React.CSSProperties;
  styles?: AnimationStyles;
  timeout: PortalTimeout;
  portalDidUpdate?: () => void;
  withoutLocalFocus?: boolean;
}

const AniPortal: React.FC<Props> = ({
  children,
  className = '',
  classNames = {},
  style,
  styles,
  timeout,
  portalDidUpdate,
  withoutLocalFocus,
}) => {
  const [mounted, setMounted] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const currentStyle = useRef<React.CSSProperties | undefined>(style);

  useLocalFocus(container, mounted, !withoutLocalFocus);

  // component mount
  useEffect(() => {
    let requestFrame = 0;
    let enterTimer = 0;
    container.current = document.createElement('div');
    if (!withoutLocalFocus) {
      container.current.setAttribute('tabindex', '0');
    }

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
            setMounted(true);
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
      setMounted(false);
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
    if (container.current && mounted) {
      container.current.className = className;

      if (portalDidUpdate) portalDidUpdate();
    }
  }, [className, mounted]);

  // update style
  useEffect(() => {
    if (container.current && currentStyle.current !== style) {
      updateContainerStyle(container.current, currentStyle.current, style);
      currentStyle.current = style;

      if (portalDidUpdate) portalDidUpdate();
    }
  }, [style]);

  return null;
};

AniPortal.displayName = 'AniPortal';

export default AniPortal;
