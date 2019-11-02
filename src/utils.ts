import { useEffect } from 'react';
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

/**
 * getFocusableElements
 * get elements which can be focus in portal
 * @param container portal container
 * @return focusable elements in portal
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const cssQuery =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
  const nodeList = container.querySelectorAll(cssQuery);
  return Array.prototype.slice.call(nodeList);
}

/**
 * isFocusable
 * check if an element is focusable
 * @param element
 * @return true if element is focusable
 */
function isFocusable(
  element: Element | null | Element & { focus: () => void },
): element is Element & { focus: () => void } {
  if (element && (element as any).focus) {
    return true;
  }
  return false;
}

/**
 * focusNextElement
 * set focus on next focusable element
 * if focused element is the last focusable, the focus is set on first focusable element
 * @param event
 * @param focusableElements
 */
function focusNextElement(event: KeyboardEvent, focusableElements: HTMLElement[]): void {
  const lastFocusableIndex = focusableElements.length - 1;
  const lastFocusableElement = focusableElements[lastFocusableIndex];
  if (document.activeElement === lastFocusableElement) {
    const firstFocusableElement = focusableElements[0];
    event.preventDefault();
    firstFocusableElement.focus();
  }
}

/**
 * focusPreviousElement
 * set focus on previous focusable element
 * if focused element is the first focusable, the focus is set on last focusable element
 * @param event
 * @param focusableElements
 */
function focusPreviousElement(event: KeyboardEvent, focusableElements: HTMLElement[]): void {
  const firstFocusableElement = focusableElements[0];
  if (document.activeElement === firstFocusableElement) {
    const lastFocusableIndex = focusableElements.length - 1;
    const lastFocusableElement = focusableElements[lastFocusableIndex];
    event.preventDefault();
    lastFocusableElement.focus();
  }
}

const TAB_KEYCODE = 9;

/**
 * useLocalFocus
 * react hook which set focus on portal container and
 * listen keyboard to limit focus for elements in portal
 * @param ref react ref of portal container
 * @param mounted true when portal element is mounted (after animation end)
 * @param enabled if false, the hook doesn't start any listener
 */
function useLocalFocus(
  ref: React.MutableRefObject<HTMLElement | null>,
  mounted: boolean,
  enabled: boolean,
): void {
  useEffect(() => {
    if (enabled && mounted && ref.current) {
      const focusedElementBeforeOpen = document.activeElement;
      ref.current.focus();

      const keyboardListener = (event: KeyboardEvent) => {
        if (event.keyCode === TAB_KEYCODE) {
          const focusableElements = getFocusableElements(ref.current!);

          if (event.shiftKey) {
            focusPreviousElement(event, focusableElements);
          } else {
            focusNextElement(event, focusableElements);
          }
        }
      };

      window.addEventListener('keydown', keyboardListener);

      return () => {
        window.removeEventListener('keydown', keyboardListener);
        waitNextFrame(() => {
          if (isFocusable(focusedElementBeforeOpen)) {
            focusedElementBeforeOpen.focus();
          }
        });
      };
    }
  }, [mounted, enabled]);
}

export {
  getEnterTimeout,
  getExitTimeout,
  getEnterActiveStyle,
  appendContainerStyle,
  updateContainerStyle,
  waitNextFrame,
  useLocalFocus,
};
