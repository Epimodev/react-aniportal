import { PortalTimeout, AnimationStyles } from './types';

/**
 * getEnterTimeout
 * get timeout for enter animation
 * @param timeout
 * @return duration to wait for enter animation
 */
function getEnterTimeout(timeout: PortalTimeout): number {
  if (typeof timeout === 'number') {
    return timeout;
  }
  return timeout.enter;
}

/**
 * getExitTimeout
 * get timeout for exit animation
 * @param timeout
 * @return duration to wait for exit animation
 */
function getExitTimeout(timeout: PortalTimeout): number {
  if (typeof timeout === 'number') {
    return timeout;
  }
  return timeout.exit;
}

/**
 * getEnterActiveStyle
 * get style for enter animation
 * @param style portal container style
 * @param styles styles to apply for animation
 * @return inline style to apply for enter animation
 */
function getEnterActiveStyle(
  style: React.CSSProperties,
  styles: AnimationStyles,
): React.CSSProperties {
  const enterStyle = styles.enter || {};
  const enterActiveStyle = styles.enterActive || {};
  return { ...style, ...enterStyle, ...enterActiveStyle };
}

/**
 * getRemovedProperties
 * get style properties to remove
 * @param currentStyle style object applied on portal container
 * @param style new style object to apply on portal container
 * @return style properties to remove
 */
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

/**
 * appendContainerStyle
 * append style properties to portal container
 * @param container portal container
 * @param style style properties to append
 */
function appendContainerStyle(container: HTMLDivElement, style: React.CSSProperties): void {
  Object.keys(style).forEach(property => {
    container.style[property as any] = (style as any)[property];
  });
}

/**
 * updateContainerStyle
 * update style to apply on portal container
 * @param container portal container
 * @param currentStyle style applied on portal container
 * @param style style to apply on portal container
 */
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

/**
 * waitNextFrame
 * wait during a short time to apply active className
 * use this instead of requestAnimation frame
 * because enter animation doesn't work when the component is remounting during unmount
 * @param callback
 * @return timeout id for cancel
 */
function waitNextFrame(callback: () => void): number {
  return window.setTimeout(callback, 30);
}

export {
  getEnterTimeout,
  getExitTimeout,
  getEnterActiveStyle,
  appendContainerStyle,
  updateContainerStyle,
  waitNextFrame,
};
