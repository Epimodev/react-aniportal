import { Component, ReactElement, CSSProperties } from 'react';
import { render as renderDOM } from 'react-dom';
import * as classnames from 'classnames';
import { cssToStyleAttr } from './utils';

const TICK_TIMEOUT = 50;

interface Props {
  children: ReactElement<any>;
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

interface State {}

class AniPortal extends Component<Props, State> {
  container: HTMLDivElement = document.createElement('div');
  currentClassName = this.props.className!;
  currentStyle = this.props.style;

  static defaultProps = {
    className: '',
    classNames: {},
  };

  getEnterTimeout(): number {
    const { timeout } = this.props;
    if (typeof timeout === 'number') {
      return timeout;
    }
    return timeout.enter;
  }

  getExitTimeout(): number {
    const { timeout } = this.props;
    if (typeof timeout === 'number') {
      return timeout;
    }
    return timeout.exit;
  }

  getStyle(): string {
    const { style } = this.props;
    if (style) {
      return cssToStyleAttr(style);
    }
    return '';
  }

  getEnterStyle(): string {
    const { style = {}, styles = {} } = this.props;
    const enterStyle = styles.enter || {};
    const styleToConvert = { ...style, ...enterStyle };
    return cssToStyleAttr(styleToConvert);
  }

  getEnterActiveStyle(): string {
    const { style = {}, styles = {} } = this.props;
    const enterStyle = styles.enter || {};
    const enterActiveStyle = styles.enterActive || {};
    const styleToConvert = { ...style, ...enterStyle, ...enterActiveStyle };
    return cssToStyleAttr(styleToConvert);
  }

  getExitStyle(): string {
    const { style = {}, styles = {} } = this.props;
    const exitStyle = styles.exit || {};
    const styleToConvert = { ...style, ...exitStyle };
    return cssToStyleAttr(styleToConvert);
  }

  getExitActiveStyle(): string {
    const { style = {}, styles = {} } = this.props;
    const exitStyle = styles.exit || {};
    const exitActiveStyle = styles.exitActive || {};
    const styleToConvert = { ...style, ...exitStyle, ...exitActiveStyle };
    return cssToStyleAttr(styleToConvert);
  }

  setContainerStyle(styleValue: string) {
    if (styleValue) {
      this.container.setAttribute('style', styleValue);
    }
  }

  updateContainer() {
    const { className, style } = this.props;
    if (this.currentClassName !== className) {
      this.currentClassName = className!;
      this.container.className = className!;
    }
    if (this.currentStyle !== style) {
      this.currentStyle = style;
      if (style) {
        const styleValue = cssToStyleAttr(style);
        this.container.setAttribute('style', styleValue);
      } else {
        this.container.removeAttribute('style');
      }
    }
  }

  componentDidMount() {
    const { children, className, classNames } = this.props;
    const enterTimeout = this.getEnterTimeout();
    const enterClassName = classnames(className, classNames!.enter);
    const enterActiveClassName = classnames(className, classNames!.enter, classNames!.enterActive);
    const style = this.getStyle();
    const enterStyle = this.getEnterStyle();
    const enterActiveStyle = this.getEnterActiveStyle();

    this.container.className = enterClassName;
    this.setContainerStyle(enterStyle);
    document.body.appendChild(this.container);

    renderDOM(children, this.container, () => {
      setTimeout(() => {
        this.container.className = enterActiveClassName;
        this.setContainerStyle(enterActiveStyle);
      }, TICK_TIMEOUT);
      setTimeout(() => {
        this.container.className = className!;
        this.setContainerStyle(style);
      }, enterTimeout + TICK_TIMEOUT);
    });
  }

  componentDidUpdate() {
    this.updateContainer();
    renderDOM(this.props.children, this.container);
  }

  componentWillUnmount() {
    const { className, classNames } = this.props;
    const exitTimeout = this.getExitTimeout();
    const exitClassName = classnames(className, classNames!.exit);
    const exitActiveClassName = classnames(className, classNames!.exit, classNames!.exitActive);
    const exitStyle = this.getExitStyle();
    const exitActiveStyle = this.getExitActiveStyle();

    this.container.className = exitClassName;
    this.setContainerStyle(exitStyle);
    setTimeout(() => {
      this.container.className = exitActiveClassName;
      this.setContainerStyle(exitActiveStyle);
    }, TICK_TIMEOUT);
    setTimeout(() => document.body.removeChild(this.container), exitTimeout + TICK_TIMEOUT);
  }

  render() {
    return null;
  }
}

export default AniPortal;
