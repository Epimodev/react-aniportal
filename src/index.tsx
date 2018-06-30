import { Component, ReactNode, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import * as classnames from 'classnames';

const TICK_TIMEOUT = 50;

export interface Props {
  children: ReactNode;
  className: string;
  classNames: {
    enter: string;
    enterActive: string;
    leave: string;
    leaveActive: string;
  };
  timeout: number;
}

export interface State {
  children: ReactNode;
}

class AniPortal extends Component<Props, State> {
  container: HTMLDivElement = document.createElement('div');

  constructor(props: Props) {
    super(props);
    this.state = {
      children: props.children,
    };
  }

  static getDerivedStateFromProps(props: Props): State {
    console.log('GET DERIVED STATE');
    return {
      children: props.children,
    };
  }

  componentDidMount() {
    const { className, classNames, timeout } = this.props;
    const enterClassName = classnames(className, classNames.enter);
    const enterActiveClassName = classnames(className, classNames.enter, classNames.enterActive);

    this.container.className = enterClassName;
    document.body.appendChild(this.container);

    setTimeout(() => (this.container.className = enterActiveClassName), TICK_TIMEOUT);
    setTimeout(() => (this.container.className = enterActiveClassName), timeout + TICK_TIMEOUT);
  }

  componentWillUnmount() {
    const { className, classNames, timeout } = this.props;
    const leaveClassName = classnames(className, classNames.leave);
    const leaveActiveClassName = classnames(className, classNames.leave, classNames.leaveActive);

    this.container.className = leaveClassName;
    setTimeout(() => (this.container.className = leaveActiveClassName), TICK_TIMEOUT);
    setTimeout(() => document.body.removeChild(this.container), timeout + TICK_TIMEOUT);
  }

  render(): ReactPortal {
    return createPortal(this.state.children, this.container);
  }
}

export default AniPortal;
