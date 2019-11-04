import {
  setDefaultBreakpoints,
  convertBreakpointsObject,
  checkBreakpointUnits,
  setDefaultFluidStart,
  checkFluidStartUnit
} from "./preflightChecks";
import {
  buildMediaQuery,
  isMeasurement,
  pipe,
  stripUnit,
  getUnit
} from "./utils";

const main = ([stylePropFn, props]) => {
  const styleObject = stylePropFn(props);
  const allInterpolatableValues = parseInterpolatableValues(
    getUnit(props.theme.breakpoints[0]),
    styleObject
  );
  const allTransitionGroups = buildTransitionGroups(allInterpolatableValues, [
    props.theme.breakpoints.fluidStart,
    ...props.theme.breakpoints
  ]);

  const fluidStyleObject = buildFluidStyleObject(allTransitionGroups, [
    props.theme.breakpoints.fluidStart,
    ...props.theme.breakpoints
  ]);
  const mergedStyleObject = mergeResponsiveStyles(
    styleObject,
    fluidStyleObject
  );

  return mergedStyleObject;
};

const parseInterpolatableValues = (breakpointUnit, styleObject) => {
  const responsiveCssProps = Object.entries(styleObject)
    .filter(
      ([cssProp, cssValue]) =>
        !cssProp.startsWith("@media") && isMeasurement(cssValue)
    )
    .map(([cssProp]) => cssProp);
  const mediaQueries = Object.keys(styleObject).filter(cssProp =>
    cssProp.startsWith("@media")
  );

  const allResponsiveValues = responsiveCssProps.map(cssProp => {
    const mediaQueryValues = mediaQueries.map(
      mediaQuery => styleObject[mediaQuery][cssProp]
    );
    const valuesWithUnits = [styleObject[cssProp], ...mediaQueryValues].map(
      value => (typeof value === "number" ? value + "px" : value)
    );

    return {
      property: cssProp,
      values: valuesWithUnits
    };
  });

  const allInterpolatableValues = allResponsiveValues.filter(
    responsiveValues => {
      const responsiveValuesUnits = responsiveValues.values
        .map(getUnit)
        .filter(Boolean);
      const singleUnit = new Set(responsiveValuesUnits).size === 1;
      const sameAsBreakpointUnit = responsiveValuesUnits[0] === breakpointUnit;

      return singleUnit && sameAsBreakpointUnit;
    }
  );

  return allInterpolatableValues;
};

const buildTransitionGroups = (allInterpolatableValues, breakpoints) =>
  allInterpolatableValues.reduce(
    (allTransitionGroups, interpolatableValues) => {
      // Use the delete operator to allow us to skip over undefined
      // values in a loop while still preserving the original order
      interpolatableValues.values.forEach((interpolatableValue, i) => {
        if (!interpolatableValue) {
          delete interpolatableValues.values[i];
        }
      });

      let transitionGroup = [];
      let actualCount = 0;

      interpolatableValues.values.forEach((interpolatableValue, i) => {
        transitionGroup.push({
          values: [interpolatableValue],
          breakpoints: [breakpoints[i]]
        });

        if (actualCount > 0) {
          transitionGroup[actualCount - 1].values.push(interpolatableValue);
          transitionGroup[actualCount - 1].breakpoints.push(breakpoints[i]);
        }

        actualCount++;
      });

      return {
        ...allTransitionGroups,
        [interpolatableValues.property]: transitionGroup.slice(
          0,
          transitionGroup.length - 1
        )
      };
    },
    {}
  );

const buildFluidStyleObject = (allTransitionGroups, breakpoints) => {
  const fluidStyles = Object.entries(allTransitionGroups).map(
    ([property, transitionGroups]) =>
      buildFluidStyle(property, transitionGroups)
  );
  const mediaQueries = breakpoints.map(breakpoint =>
    buildMediaQuery(breakpoint)
  );

  const fluidStyleObject = mediaQueries.reduce(
    (fluidStyleObject, mediaQuery) => ({
      ...fluidStyleObject,
      [mediaQuery]: fluidStyles
        .map(fluidStyle => fluidStyle[mediaQuery])
        .reduce(
          (breakpointStyles, fluidStyle) => ({
            ...breakpointStyles,
            ...fluidStyle
          }),
          {}
        )
    }),
    {}
  );

  return fluidStyleObject;
};

const buildFluidStyle = (property, transitionGroups) =>
  transitionGroups.reduce(
    (
      fluidStyle,
      {
        values: [minProp, maxProp],
        breakpoints: [minBreakpoint, maxBreakpoint]
      }
    ) => ({
      ...fluidStyle,
      [buildMediaQuery(minBreakpoint)]: {
        [property]: buildLerpCalc(
          [minProp, maxProp],
          [minBreakpoint, maxBreakpoint]
        )
      }
    }),
    {}
  );

const buildLerpCalc = ([minProp, maxProp], [minBreakpoint, maxBreakpoint]) =>
  `calc(${minProp} + (${stripUnit(maxProp)} - ${stripUnit(
    minProp
  )})*(100vw - ${minBreakpoint})/(${stripUnit(maxBreakpoint)} - ${stripUnit(
    minBreakpoint
  )}))`;

const mergeResponsiveStyles = (styleObject, fluidStyleObject) => {
  const baseStyles = Object.keys(styleObject)
    .filter(style => !style.startsWith("@media"))
    .reduce(
      (baseStyles, style) => ({
        ...baseStyles,
        [style]: styleObject[style]
      }),
      {}
    );
  const mediaQueries = [
    ...Object.keys(styleObject),
    ...Object.keys(fluidStyleObject)
  ]
    .filter(key => key.startsWith("@media"))
    .filter((mediaQuery, i, self) => self.indexOf(mediaQuery) === i);
  const sortedMediaQueries = mediaQueries.sort(
    (a, b) =>
      parseInt(a.match(/@media screen and \(min-width: (.*)\)/)[1]) -
      parseInt(b.match(/@media screen and \(min-width: (.*)\)/)[1])
  );

  const mergedStyleObject = sortedMediaQueries.reduce(
    (mergedStyleObject, mediaQuery) => {
      const mergedBreakpointStyles = {
        ...styleObject[mediaQuery],
        ...fluidStyleObject[mediaQuery]
      };

      if (!Object.entries(mergedBreakpointStyles).length) {
        return mergedStyleObject;
      }

      return {
        ...mergedStyleObject,
        [mediaQuery]: mergedBreakpointStyles
      };
    },
    { ...baseStyles }
  );

  return mergedStyleObject;
};

const fluid = stylePropFn =>
  pipe(
    props => [stylePropFn, props],
    setDefaultBreakpoints,
    convertBreakpointsObject,
    checkBreakpointUnits,
    setDefaultFluidStart,
    checkFluidStartUnit,
    main
  );

export default fluid;
