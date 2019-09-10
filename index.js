import { system } from "styled-system";

const stylePropFn = (cssProp, scale, propName) =>
  system({
    [propName]: {
      property: cssProp,
      scale,
      transform: (current, scale, props) => {
        const prop = props[propName];

        if (current.index === prop.length - 1) {
          return scale[current.value];
        }

        const minIndex = findMinIndex(current, prop);
        const maxIndex = findMaxIndex(current, prop);

        const minProp = prop[minIndex].value;
        const maxProp = prop[maxIndex].value;

        const minBreakpoint =
          minIndex > 0 ? minIndex - 1 : props.theme._fluidSystem.startingWidth;
        const maxBreakpoint = maxIndex - 1;

        return lerpCalc(
          scaledRange(scale, [minProp, maxProp]),
          scaledRange(props.theme.breakpoints, [minBreakpoint, maxBreakpoint])
        );
      }
    }
  });

const findMinIndex = (current, prop) => {
  for (let i = current.index; i >= 0; i--) {
    if (prop[i].value !== "-") {
      return i;
    }
  }
};

const findMaxIndex = (current, prop) => {
  for (let i = current.index + 1; i < prop.length; i++) {
    if (prop[i].value !== "-") {
      return i;
    }
  }
};

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
  if (typeof value === "string") {
    return value;
  }

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

const fluid = (cssProp, scale, propName = cssProp) => props => {
  const head = startAnchor(cssProp, scale)(props);
  const tail = stylePropFn(cssProp, scale, propName)({
    ...props,
    [propName]: props[propName].map((value, index) => ({
      value,
      index
    }))
  });

  return {
    ...head,
    ...tail
  };
};

const startAnchor = (cssProp, scale) => ({ theme }) => ({
  [`@media screen and (max-width: ${theme._fluidSystem.startingWidth})`]: {
    [cssProp]: applyScale(theme[scale], 0)
  }
});

export default fluid;
