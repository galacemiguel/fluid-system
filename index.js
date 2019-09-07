import { system } from "styled-system";

const stylePropFn = (cssProp, scale, propName) =>
  system({
    [propName]: {
      property: cssProp,
      scale,
      transform: (current, scale, props) => {
        const prop = props[propName];

        if (current.index === 0 || current.index === prop.length - 1) {
          return scale[current.value];
        }

        const minProp = current.value;
        const maxProp = prop[current.index + 1].value;

        const minBreakpoint = prop[current.index - 1].index;
        const maxBreakpoint = minBreakpoint + 1;

        return lerpCalc(
          scaledRange(scale, [minProp, maxProp]),
          scaledRange(props.theme.breakpoints, [minBreakpoint, maxBreakpoint])
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

const fluid = (cssProp, scale, propName = cssProp) => props => {
  return stylePropFn(cssProp, scale, propName)({
    ...props,
    [propName]: props[propName].map((value, index) => ({
      value,
      index
    }))
  });
};

export default fluid;
