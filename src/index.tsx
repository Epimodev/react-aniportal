import { createElement, Component, ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export interface State {}

class AniPortal extends Component<Props, State> {
  static defaultProps = {};

  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default AniPortal;
