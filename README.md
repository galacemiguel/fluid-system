# 💧 Fluid System
![npm](https://img.shields.io/npm/v/fluid-system?label=npm) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Fluid System is a style props function transformer for turning the static values of ordinal scales into fluid measurements that smoothly transition across breakpoints.

It is designed to be used with libraries built upon [the System UI specification](https://system-ui.com/) like [Styled System](https://styled-system.com/) or [Rebass](https://rebassjs.org/), and a CSS-in-JS library such as [styled-components](https://styled-components.com/) or [Emotion](https://emotion.sh/).

## What is Fluid Design? ⛲️

> Fluid design is to responsive design what responsive design was to fixed layouts.

There is a greater need now, more than ever, for websites to adapt their designs to the plethora of devices existing in the market today.

And to do so most responsive websites might follow a type size specification like below:

|              | Phone | Tablet | Desktop |
| ------------ | ----: | -----: | ------: |
| Screen width | 320px |  768px |  1024px |
| Font size    |  16px |   19px |    23px |

The approach to implementing this with _responsive_ design has been to create a breakpoint at each point of transition. But such an approach alienates a likely majority of your users whose screen sizes do not align exactly with those sweet spots.

Take for example, a device having a viewport width of 767px. With a responsive design approach, such a screen would be served a font size of 16px when—being just 1 pixel away from our 768px breakpoint—it should be getting something much closer to 19px.

Fluid design aims to bridge that gap by interpolating between those defined size measurements based on the width of your user's screen.

The graph below (red line) illustrates a fluid design implementation for the type size specification above:

<p align="center">
  <img src="https://user-images.githubusercontent.com/7394331/64905228-9566ff00-d6c4-11e9-9a07-25a796d9777d.png" width="75%" />
</p>

This technique extends beyond just font sizes and can be used with any ordinal scale in your design, like a space scale for margin and padding, or even a scale for sizes to control width and height.

You can read more about the technique [here](https://css-tricks.com/between-the-lines/).

## Quick Start 🏊‍♀️

Convinced? Install Fluid System onto your project.

```
yarn add fluid-system
```

Make sure your `breakpoints` and the scales you wish to use in your design are defined in your [theme object](https://github.com/system-ui/theme-specification). Then, define a `fluidStart` alias on your `breakpoints`.

```javascript
// theme.js
const theme = {
  breakpoints: ["40em", "52em", "64em"],
  fontSizes: [13, 16, 19, 23, 27, 33, 39, 47]
};

theme.breakpoints.fluidStart = "20em";

export default theme;
```

This will define the viewport width at which your styles will begin to become fluid. Below that, they will remain fixed at the smallest sizes they have defined.

> `fluidStart` is set to `320px` by default (or `20em`/`rem` depending on what units your `breakpoints` are defined in).

Then, make sure your theme is available to your component tree via a `ThemeProvider`, otherwise Styled System will not be able to pick up on your theme values.

```javascript
import React from "react";
import { ThemeProvider } from "styled-components";
import theme from "./theme";

const App = () => (
  <ThemeProvider theme={theme}>{/* Your component tree */}</ThemeProvider>
);

export default App;
```

Now, in your base components, wrap the Styled System functions (or your custom style prop functions) that you want to make fluid with the `fluid` function.

`fluid` transforms style prop functions to make all the responsive styles they have defined in [CSS lengths](https://css-tricks.com/the-lengths-of-css/) fluid.

```javascript
import React from "react";
import styled from "styled-components";
import { typography } from "styled-system";
import fluid from "fluid-system";

const Text = styled("p")(
  fluid(typography)
);

const FluidText = () => <Text fontSize={[1, 2, 3]} />;
```

`FluidText`'s `fontSize` will now fluidly scale between `16px`, `19px`, and `23px` in line with your theme's `breakpoints`.


|                     | < `20em`* |   ≥ `20em`* |    ≥ `40em` | ≥ `52em` |
| ------------------- | --------: | ----------: | ----------: | -------: |
| `typography`        |    `16px` |      `16px` |      `19px` |   `23px` |
| `fluid(typography)` |    `16px` | `16`–`19px` | `19`–`23px` |   `23px` |

\* `theme.breakpoints.fluidStart`

> Note though that each value in your responsive styles array will all need to resolve to the same unit, otherwise Fluid System will not be able to create fluid styles for them.

That's it! Even if you began a Styled System project without Fluid System in mind, it can be very easily integrated at almost no cost. No part of the code where your components are being used needs changing!

## Interpolating Across Breakpoints 🚣‍♀️

Fluid System follows the Styled System syntax for skipping breakpoints. For fluid styles, it can also be used to interpolate styles _across_ breakpoints. Just set `null` between two values in your array and Fluid System will skip over defining a new size at that breakpoint and instead smoothly scale between them as if the middle breakpoint had not been defined.

```javascript
<Text fontSize={[1, null, 2]} />
```

|                     | < `20em`* |   ≥ `20em`* | ≥ `40em` | ≥ `52em` |
| ------------------- | --------: | ----------: | -------: | -------: |
| `typography`        |    `16px` |      `16px` |          |   `19px` |
| `fluid(typography)` |    `16px` | `16`–`19px` |          |   `19px` |

\* `theme.breakpoints.fluidStart`

## Usage with Rebass 🤽‍♂️

Fluid System works just the same with Rebass, though you may need to install Styled System separately, or some of its base style prop functions, if you haven't already.

```
yarn add @styled-system/typography
```

```javascript
import styled from "@emotion/styled";
import { Text } from "rebass";
import typography from "@styled-system/typography";
import fluid from "fluid-system";

export const FluidText = styled(Text)(fluid(typography));
```

## Prior Art 🌊

- [Responsive And Fluid Typography With vh And vw Units](https://www.smashingmagazine.com/2016/05/fluid-typography/)
- [Fluid Responsive Typography With CSS Poly Fluid Sizing](https://www.smashingmagazine.com/2017/05/fluid-responsive-typography-css-poly-fluid-sizing/)
