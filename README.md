## Presentation

`react-aniportal` is a React component which render his children in a portal and give the possibility to mount and unmount the portal with css animations.
This component is made to create modal, tooltip, dropdown with animations.

The api of this component is inspired by [`react-transition-group`](https://github.com/reactjs/react-transition-group).

## Installation

```sh
yarn add react-aniportal

# or with npm

npm install react-aniportal
```

## Example

```javascript
import React from 'react';
import AniPortal from 'react-aniportal';

const modalClassNames = {
  enter: 'modal_enter';
  enterActive: 'modal_enter-active';
  exit: 'modal_exit';
  exitActive: 'modal_exit-active';
}

function ModalExample() {
  <AniPortal className="modal" classNames={modalClassNames} timeout={500}>
    <div>
      Modal Content
    </div>
  </AniPortal>
}

```

## Available props

#### className: string
className to apply on portal container

#### classNames: { enter?: string; enterActive?: string; exit?: string; exitActive?: string }
classNames which are applied during mount and unmount of the component

#### style: CSSProperties
style to apply on portal container

#### styles: { enter?: CSSProperties; enterActive?: CSSProperties; exit?: CSSProperties; exitActive?: CSSProperties }
styles which are applied during mount and unmount of the component

#### timeout: number | { enter: number; exit: number }
duration of enter and exit animations
