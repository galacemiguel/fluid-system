import { system } from "styled-system";

const stylePropFn = system({
  fontSize: {
    property: "fontSize",
    scale: "fontSizes",
    transform: (current, scale, { fontSize, theme }) => {
      if (current.index === 0 || current.index === fontSize.length - 1) {
        return scale[current.value];
      }

      const breakpoints = theme.breakpoints.map(b => parseInt(b));

      const minFontSize = current.value;
      const maxFontSize = fontSize[current.index + 1].value;

      const minBreakpoint = fontSize[current.index - 1].index;
      const maxBreakpoint = minBreakpoint + 1;

      return `calc(${scale[minFontSize]}px + (${scale[maxFontSize]} - ${scale[minFontSize]})*(100vw - ${breakpoints[minBreakpoint]}px)/(${breakpoints[maxBreakpoint]} - ${breakpoints[minBreakpoint]}))`;
    }
  }
});

export const fluidFontSize = props => {
  return stylePropFn({
    ...props,
    fontSize: props.fontSize.map((value, index) => ({
      value,
      index
    }))
  });
};
