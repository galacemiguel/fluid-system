import { system } from "styled-system";

const stylePropFn = system({
  fontSize: {
    property: "fontSize",
    scale: "fontSizes",
    transform: (current, scale, { fontSize, theme }) => {
      if (current.index === 0 || current.index === fontSize.length - 1) {
        return scale[current.value];
      }

      const minFontSize = current.value;
      const maxFontSize = fontSize[current.index + 1].value;

      const minBreakpoint = fontSize[current.index - 1].index;
      const maxBreakpoint = minBreakpoint + 1;

      return lerpCalc(
        scaledRange(scale, [minFontSize, maxFontSize]),
        scaledRange(theme.breakpoints, [minBreakpoint, maxBreakpoint])
      );
    }
  }
});

const lerpCalc = ([minProp, maxProp], [minBreakpoint, maxBreakpoint]) => {
  return `calc(${minProp} +
    (${stripUnit(maxProp)} - ${stripUnit(minProp)})*
    (100vw - ${minBreakpoint})/
    (${stripUnit(maxBreakpoint)} - ${stripUnit(minBreakpoint)}))`;
};

const scaledRange = (scale, [min, max]) => {
  const scaledMin = applyScale(scale, min);
  const scaledMax = applyScale(scale, max);

  if (getUnit(scaledMin) !== getUnit(scaledMax)) {
    throw new TypeError(
      `Cannot interpolate between dissimilar units: '${scaledMin}' and '${scaledMax}'`
    );
  }

  return [scaledMin, scaledMax];
};

const applyScale = (scale, value) => {
  const measurement = scale[value];

  if (typeof measurement === "number") {
    return measurement + "px";
  }

  return measurement;
};

const stripUnit = measurement => parseInt(measurement);

const getUnit = measurement => {
  return measurement.match(/(?<=[0-9])[^0-9]+$/)[0];
};

export const fluidFontSize = props => {
  return stylePropFn({
    ...props,
    fontSize: props.fontSize.map((value, index) => ({
      value,
      index
    }))
  });
};
