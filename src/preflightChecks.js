import { getUnit, stripUnit } from "./utils";

export const setDefaultBreakpoints = ([stylePropFn, props]) => {
  if (!props.theme.breakpoints) {
    props.theme.breakpoints = ["40em", "52em", "64em"];
  }

  return [stylePropFn, props];
};

export const convertBreakpointsObject = ([stylePropFn, props]) => {
  const breakpoints = props.theme.breakpoints;

  if (breakpoints.constructor === Object) {
    const breakpointsArray = Object.entries(breakpoints)
      .filter(([key]) => key !== "fluidStart")
      .map(([, value]) => value)
      .sort((a, b) => stripUnit(a) - stripUnit(b));
    const fluidStart = breakpoints.fluidStart;

    props.theme.breakpoints = breakpointsArray;
    props.theme.breakpoints.fluidStart = fluidStart;
  }

  return [stylePropFn, props];
};

export const checkBreakpointUnits = ([stylePropFn, props]) => {
  const breakpoints = props.theme.breakpoints;
  const breakpointUnits = breakpoints.map(getUnit);

  if (new Set(breakpointUnits).size > 1) {
    throw new TypeError(
      `Cannot interpolate between dissimilar units in the theme breakpoints: [${breakpoints
        .map(breakpoint => `"${breakpoint}"`)
        .join(", ")}]`
    );
  }

  return [stylePropFn, props];
};

export const setDefaultFluidStart = ([stylePropFn, props]) => {
  if (!props.theme.breakpoints.fluidStart) {
    const breakpointUnit = getUnit(props.theme.breakpoints[0]);

    switch (breakpointUnit) {
      case "em":
        props.theme.breakpoints.fluidStart = "20em";
        break;
      case "rem":
        props.theme.breakpoints.fluidStart = "20rem";
        break;
      case "px":
        props.theme.breakpoints.fluidStart = "320px";
        break;
      default:
        throw new TypeError(
          `Cannot define a default fluid starting width for "${breakpointUnit}" unit breakpoints; manually set the alias on the theme object instead`
        );
    }
  }

  return [stylePropFn, props];
};

export const checkFluidStartUnit = ([stylePropFn, props]) => {
  const fluidStartUnit = getUnit(props.theme.breakpoints.fluidStart);
  const breakpointUnit = props.theme.breakpoints.length
    ? getUnit(props.theme.breakpoints[0])
    : null;

  if (breakpointUnit && fluidStartUnit !== breakpointUnit)
    throw new TypeError(
      `"The fluid starting width must be defined in the same unit as the theme breakpoints"`
    );

  return [stylePropFn, props];
};
