import { Component, ReactElement } from 'react';
import { render as renderDOM } from 'react-dom';
import * as classnames from 'classnames';

const TICK_TIMEOUT = 50;

interface Props {
  children: ReactElement<any>;
  className: string;
  classNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
  timeout: number | { enter: number; exit: number };
}

interface State {}

class AniPortal extends Component<Props, State> {
  container: HTMLDivElement = document.createElement('div');

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

  componentDidMount() {
    const { children, className, classNames } = this.props;
    const enterTimeout = this.getEnterTimeout();
    const enterClassName = classnames(className, classNames.enter);
    const enterActiveClassName = classnames(className, classNames.enter, classNames.enterActive);

    this.container.className = enterClassName;
    document.body.appendChild(this.container);

    renderDOM(children, this.container, () => {
      setTimeout(() => (this.container.className = enterActiveClassName), TICK_TIMEOUT);
      setTimeout(
        () => (this.container.className = enterActiveClassName),
        enterTimeout + TICK_TIMEOUT,
      );
      setTimeout(() => (this.container.className = className), enterTimeout + 2 * TICK_TIMEOUT);
    });
  }

  componentDidUpdate() {
    renderDOM(this.props.children, this.container);
  }

  componentWillUnmount() {
    const { className, classNames } = this.props;
    const exitTimeout = this.getExitTimeout();
    const exitClassName = classnames(className, classNames.exit);
    const exitActiveClassName = classnames(className, classNames.exit, classNames.exitActive);

    this.container.className = exitClassName;
    setTimeout(() => (this.container.className = exitActiveClassName), TICK_TIMEOUT);
    setTimeout(() => document.body.removeChild(this.container), exitTimeout + TICK_TIMEOUT);
  }

  render() {
    return null;
  }
}

export default AniPortal;
