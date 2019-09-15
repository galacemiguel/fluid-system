# 💧 Fluid System
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fluid System is a style props function creator for transforming the static values of ordinal scales into fluid measurements that smoothly transition across breakpoints.

It is designed to be used with libraries built upon [the System UI specification](https://system-ui.com/) like [Styled System](https://styled-system.com/), and a CSS-in-JS library such as [styled-components](https://styled-components.com/) or [Emotion](https://emotion.sh/).

## What is Fluid Design? ⛲️

Fluid design is to responsive design what responsive design was to fixed layouts.

With no decreasing number of devices opening access to the internet, the need for websites to adapt their designs to all sorts of shapes and sizes has grown exponentially.

Most responsive websites might follow a type size specification like below:

| Primary Target | Phone | Tablet | Desktop |
| -------------- | ----: | -----: | ------: |
| Screen width   | 320px |  768px |  1024px |
| Font size      |  16px |   19px |    23px |

The approach to implementing this with responsive design has been to create a breakpoint at each point of transition. But such an approach leaves out a likely majority of your users whose screen sizes do not exactly align with those sweet spots.

In an extreme case, a device having a browser width of 767px will be served a font size of 16px when it ought to be given something much closer to 19px.

Fluid design aims to bridge that gap by interpolating between those defined size measurements based on the width of your user's screen. For the size specification above, it is illustrated by the red line in the graph below:

<p align="center">
  <img src="https://user-images.githubusercontent.com/7394331/64905228-9566ff00-d6c4-11e9-9a07-25a796d9777d.png" width="75%" />
</p>

This technique extends beyond just font sizes and can be used with any ordinal scale in your design, like a space scale for margin and padding, or even a scale for sizes to control width and height.

You can read more about the technique [here](https://css-tricks.com/between-the-lines/).

## Quick Start 🏊‍♀️

Convinced? Add Fluid System to your project's list of dependencies.

```
yarn add fluid-system
```

Make sure your `breakpoints` and the scales you wish to use in your design are defined in your [theme object](https://github.com/system-ui/theme-specification). And specific to Fluid System, define a `_fluidSystem` key at the top-level, pointing to an object with a `startingWidth` property.

This will define the viewport width at which your styles will begin to become fluid. Below that, they will remain fixed at their respective sizes for that breakpoint.

```javascript
// theme.js
export default {
  breakpoints: [768, 1024],
  fontSizes: [13, 16, 19, 23, 27, 33, 39, 47],
  _fluidSystem: {
    startingWidth: 320
  }
};
```

Now, make them available to your component tree via a `ThemeProvider`.

```javascript
import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "./theme";

const App = () => (
  <ThemeProvider theme={theme}>{/* Your component tree */}</ThemeProvider>
);

export default App;
```

Then, like you would any other Styled System function, call `fluid` as an argument to the component you wish to make fluid.

```javascript
import React from "react";
import styled from "styled-components";
import fluid from "fluid-system";

const Text = styled("p")(
  fluid({
    cssProperty: "fontSize",
    scale: "fontSizes"
  })
);

const FluidText = () => <Text fontSize={[1, 2, 3]} />;
```

`<Text>` will now fluidly transition from `fontSize` 1, 2, then 3—defined in your theme's `fontSizes`—between your `breakpoints`.

Just take note that each value in your scale will all need to resolve to the same unit, otherwise Fluid System will throw an error.

That's it! Even if you began a Styled System project without Fluid System in mind, it can be very easily integrated at almost no cost. No part of the code where your components are being used needs changing!

## Interpolating Across Breakpoints 🚣‍♀️

Fluid System provides a special syntax for interpolating between values across breakpoints. Just place a hyphen (`"-"`) between the two values in your array and Fluid System will skip over defining a new size at that breakpoint and instead smoothly scale between your endpoints as if that breakpoint had not been defined.

```javascript
<Text fontSize={[1, "-", 2]} />
```

You can also use it in succession to skip consecutive breakpoints or in different places in the same array—just as long as they are not at the start or end.

## API 🏄‍♂️

```typescript
// Object syntax
fluid({ cssProperty: string, scale: string, propName: string? }) => styleFn

// Shorthand
fluid(cssProperty: string, scale: string, propName: string?) => styleFn
```

### `cssProperty`
- CSS property written in [DOM Notation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)

### `scale`
- Key referencing a scale in your theme object

### `propName` (optional)
- String to be used as the prop name on your component for declaring fluid values
- Default: value assigned to `cssProperty`

## Prior Art 🌊

- [Responsive And Fluid Typography With vh And vw Units - Smashing Magazine](https://www.smashingmagazine.com/2016/05/fluid-typography/)
- [Fluid Responsive Typography With CSS Poly Fluid Sizing - Smashing Magazine](https://www.smashingmagazine.com/2017/05/fluid-responsive-typography-css-poly-fluid-sizing/)
