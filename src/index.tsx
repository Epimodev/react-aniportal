import { Component, ReactElement, CSSProperties } from 'react';
import { render as renderDOM } from 'react-dom';
import * as classnames from 'classnames';

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

  getEnterActiveStyle(): CSSProperties {
    const { style = {}, styles = {} } = this.props;
    const enterStyle = styles.enter || {};
    const enterActiveStyle = styles.enterActive || {};
    return { ...style, ...enterStyle, ...enterActiveStyle };
  }

  getRemovedProperties(
    currentStyle: CSSProperties | undefined,
    style: CSSProperties | undefined,
  ): string[] {
    if (!currentStyle) {
      return [];
    }
    if (!style) {
      return Object.keys(currentStyle);
    }
    return Object.keys(currentStyle).filter(currentKey => !(style as any)[currentKey]);
  }

  appendContainerStyle(style: CSSProperties) {
    Object.keys(style).forEach(property => {
      this.container.style[property as any] = (style as any)[property];
    });
  }

  updateContainerStyle(currentStyle: CSSProperties | undefined, style: CSSProperties | undefined) {
    const removedProperties = this.getRemovedProperties(currentStyle, style);
    removedProperties.forEach(property => {
      this.container.style[property as any] = '';
    });
    if (style) {
      Object.keys(style).forEach(property => {
        this.container.style[property as any] = (style as any)[property];
      });
    }
  }

  updateContainer() {
    const { className, style } = this.props;
    if (this.currentClassName !== className) {
      this.container.className = className!;
      this.currentClassName = className!;
    }
    if (this.currentStyle !== style) {
      this.updateContainerStyle(this.currentStyle, style);
      this.currentStyle = style;
    }
  }

  componentDidMount() {
    const { children, className, classNames, style, styles } = this.props;
    const enterTimeout = this.getEnterTimeout();
    const enterClassName = classnames(className, classNames!.enter);
    const enterActiveClassName = classnames(className, classNames!.enter, classNames!.enterActive);

    this.container.className = enterClassName;
    if (style) this.appendContainerStyle(style);
    if (styles && styles.enter) this.appendContainerStyle(styles.enter);
    document.body.appendChild(this.container);

    renderDOM(children, this.container, () => {
      setTimeout(() => {
        this.container.className = enterActiveClassName;
        if (styles && styles.enterActive) this.appendContainerStyle(styles.enterActive);
      }, TICK_TIMEOUT);
      setTimeout(() => {
        this.container.className = className!;
        this.updateContainerStyle(this.getEnterActiveStyle(), style);
      }, enterTimeout + TICK_TIMEOUT);
    });
  }

  componentDidUpdate() {
    this.updateContainer();
    renderDOM(this.props.children, this.container);
  }

  componentWillUnmount() {
    const { className, classNames, styles } = this.props;
    const exitTimeout = this.getExitTimeout();
    const exitClassName = classnames(className, classNames!.exit);
    const exitActiveClassName = classnames(className, classNames!.exit, classNames!.exitActive);

    this.container.className = exitClassName;
    if (styles && styles.exit) this.appendContainerStyle(styles.exit);
    setTimeout(() => {
      this.container.className = exitActiveClassName;
      if (styles && styles.exitActive) this.appendContainerStyle(styles.exitActive);
    }, TICK_TIMEOUT);
    setTimeout(() => document.body.removeChild(this.container), exitTimeout + TICK_TIMEOUT);
  }

  render() {
    return null;
  }
}

export default AniPortal;
