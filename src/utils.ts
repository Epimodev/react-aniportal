import { CSSProperties } from 'react';
import kebabCase = require('lodash/kebabCase');

/**
 * @name cssToStyleAttr
 * @description transform css properties to a string ready to set as attribute of an HTML Element
 * @param css - css properties
 * @return formatted style for `style` attribute
 */
export function cssToStyleAttr(css: CSSProperties): string {
  const keyValuePairs = Object.keys(css).map(key => {
    const cssKey = kebabCase(key);
    const value: any = (css as any)[key];
    return `${cssKey}:${value}`;
  });
  return keyValuePairs.join(';');
}
