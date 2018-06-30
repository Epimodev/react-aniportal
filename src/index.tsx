import { Component, ReactElement } from 'react';
import { render as renderDOM } from 'react-dom';
import * as classnames from 'classnames';

const TICK_TIMEOUT = 50;

export interface Props {
  children: ReactElement<any>;
  className: string;
  classNames: {
    enter: string;
    enterActive: string;
    leave: string;
    leaveActive: string;
  };
  timeout: number;
}

export interface State {}

class AniPortal extends Component<Props, State> {
  container: HTMLDivElement = document.createElement('div');

  componentDidMount() {
    const { children, className, classNames, timeout } = this.props;
    const enterClassName = classnames(className, classNames.enter);
    const enterActiveClassName = classnames(className, classNames.enter, classNames.enterActive);

    this.container.className = enterClassName;
    document.body.appendChild(this.container);

    renderDOM(children, this.container, () => {
      setTimeout(() => (this.container.className = enterActiveClassName), TICK_TIMEOUT);
      setTimeout(() => (this.container.className = enterActiveClassName), timeout + TICK_TIMEOUT);
    });
  }

  componentDidUpdate() {
    renderDOM(this.props.children, this.container);
  }

  componentWillUnmount() {
    const { className, classNames, timeout } = this.props;
    const leaveClassName = classnames(className, classNames.leave);
    const leaveActiveClassName = classnames(className, classNames.leave, classNames.leaveActive);

    this.container.className = leaveClassName;
    setTimeout(() => (this.container.className = leaveActiveClassName), TICK_TIMEOUT);
    setTimeout(() => document.body.removeChild(this.container), timeout + TICK_TIMEOUT);
  }

  render() {
    return null;
  }
}

export default AniPortal;
