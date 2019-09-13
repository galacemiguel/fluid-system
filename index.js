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
  if (typeof measurement === "number") {
    return "px";
  }

  return measurement.match(/(?<=[0-9])[^0-9]+$/)[0];
};

const fluid = ({ cssProp, scale, propName, props }) => {
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

const checkIfStartingWidthDefined = arg => {
  const theme = arg.props.theme;

  if (!("startingWidth" in theme._fluidSystem)) {
    throw new ReferenceError(
      `"_fluidSystem.startingWidth is not defined in the theme object"`
    );
  }

  return arg;
};

const checkIfHaveSameUnit = arg => {
  const { scale, propName, props } = arg;
  const scales = [
    props[propName].map(value => applyScale(props.theme[scale], value)),
    props.theme[scale],
    [props.theme._fluidSystem.startingWidth, ...props.theme.breakpoints]
  ];

  scales.forEach(scale => {
    const scaleUnits = scale.map(getUnit);

    if (new Set(scaleUnits).size > 1) {
      throw new TypeError(
        `Cannot interpolate between dissimilar units in scale: [${scale}]`
      );
    }
  });

  return arg;
};

const _pipe = (f, g) => (...args) => g(f(...args));
const pipe = (...fns) => fns.reduce(_pipe);

const fluidWithChecks = pipe(
  checkIfStartingWidthDefined,
  checkIfHaveSameUnit,
  fluid
);

const parseArgs = (...args) => {
  if (args.length === 1) {
    return {
      cssProp: args[0].cssProp,
      scale: args[0].scale,
      propName: args[0].propName ? args[0].propName : args[0].cssProp
    };
  } else {
    return {
      cssProp: args[0],
      scale: args[1],
      propName: args[2] ? args[2] : args[0]
    };
  }
};

export default pipe(
  parseArgs,
  ({ cssProp, scale, propName }) => props =>
    fluidWithChecks({
      cssProp,
      scale,
      propName,
      props
    })
);
