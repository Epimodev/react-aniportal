## Presentation

`react-aniportal` is a React component which render his children in a portal and give the possibility to mount and unmount the portal with css animations.
This component is made to create modal, tooltip, dropdown with animations.

The api of this component is inspired by [`react-transition-group`](https://github.com/reactjs/react-transition-group).

> since version 0.2 the component use react hooks so you'll need to upgrade react to version >=16.8

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

#### className (optional): string
className to apply on portal container

#### classNames (optional): { enter?: string; enterActive?: string; exit?: string; exitActive?: string }
classNames which are applied during mount and unmount of the component

#### style (optional): CSSProperties
style to apply on portal container

#### styles (optional): { enter?: CSSProperties; enterActive?: CSSProperties; exit?: CSSProperties; exitActive?: CSSProperties }
styles which are applied during mount and unmount of the component

#### timeout: number | { enter: number; exit: number }
duration of enter and exit animations

#### portalDidUpdate (optional): () => void
callback function launched when portal is render after an update

#### withoutLocalFocus (optional): boolean
by default focus will be restricted to elements in portal
you can disable this behavior by using this prop
