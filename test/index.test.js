import typography from "@styled-system/typography";

import fluid from "../src";
import { buildMediaQuery } from "../src/utils";

const themeFactory = theme => ({
  disableStyledSystemCache: true,
  breakpoints: ["40em", "52em", "64em"],
  ...theme
});

describe("main", () => {
  test("preserves non-responsive styles", () => {
    expect(
      fluid(typography)({
        theme: themeFactory(),
        fontFamily: "sans-serif"
      })
    ).toEqual({ fontFamily: "sans-serif" });
  });

  test("preserves non-interpolatable styles", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: ["40em"]
        }),
        textAlign: ["left", "center"]
      })
    ).toEqual({
      textAlign: "left",
      [buildMediaQuery("40em")]: {
        textAlign: "center"
      }
    });
  });

  test("generates fluid styles for px units", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: {
            0: "40em",
            fluidStart: "20em"
          }
        }),
        fontSize: ["16px", "21px"]
      })
    ).toEqual({
      fontSize: "16px",
      [buildMediaQuery("20em")]: {
        fontSize: "calc(16px + (21 - 16)*(100vw - 20em)/(40 - 20))"
      },
      [buildMediaQuery("40em")]: {
        fontSize: "21px"
      }
    });
  });

  test("generates fluid styles for em units", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: {
            0: "40em",
            fluidStart: "20em"
          }
        }),
        fontSize: ["1em", "1.33em"]
      })
    ).toEqual({
      fontSize: "1em",
      [buildMediaQuery("20em")]: {
        fontSize: "calc(1em + (1.33 - 1)*(100vw - 20em)/(40 - 20))"
      },
      [buildMediaQuery("40em")]: {
        fontSize: "1.33em"
      }
    });
  });

  test("generates fluid styles for % units", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: {
            0: "40em",
            fluidStart: "20em"
          }
        }),
        lineHeight: ["100%", "150%"]
      })
    ).toEqual({
      lineHeight: "100%",
      [buildMediaQuery("20em")]: {
        lineHeight: "calc(100% + (150 - 100)*(100vw - 20em)/(40 - 20))"
      },
      [buildMediaQuery("40em")]: {
        lineHeight: "150%"
      }
    });
  });

  test("generates fluid styles and preserves other styles", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: {
            0: "40em",
            fluidStart: "20em"
          }
        }),
        fontSize: ["16px", "21px"],
        fontFamily: "sans-serif",
        textAlign: ["left", "center"]
      })
    ).toEqual({
      fontSize: "16px",
      fontFamily: "sans-serif",
      textAlign: "left",
      [buildMediaQuery("20em")]: {
        fontSize: "calc(16px + (21 - 16)*(100vw - 20em)/(40 - 20))"
      },
      [buildMediaQuery("40em")]: {
        fontSize: "21px",
        textAlign: "center"
      }
    });
  });

  test("accepts a custom fluidStart", () => {
    const styleObject = fluid(typography)({
      theme: themeFactory({ breakpoints: { 0: "40em", fluidStart: "27em" } }),
      fontSize: [16, 21]
    });
    const firstMediaQuery = Object.keys(styleObject).find(key =>
      key.startsWith("@media")
    );

    expect(firstMediaQuery).toMatch(/27em/);
  });

  test("skips breakpoints for null values", () => {
    expect(
      fluid(typography)({
        theme: themeFactory({
          breakpoints: {
            0: "40em",
            1: "52em",
            fluidStart: "20em"
          }
        }),
        fontSize: ["16px", null, "21px"]
      })
    ).toEqual({
      fontSize: "16px",
      [buildMediaQuery("20em")]: {
        fontSize: "calc(16px + (21 - 16)*(100vw - 20em)/(52 - 20))"
      },
      [buildMediaQuery("52em")]: {
        fontSize: "21px"
      }
    });
  });
});

describe("preflight checks", () => {
  test("sets default breakpoints when none are given", () => {
    const styleObject = fluid(typography)({
      theme: themeFactory({ breakpoints: undefined }),
      fontSize: [16, 21]
    });
    const hasMediaQuery = Object.keys(styleObject).some(key =>
      key.startsWith("@media")
    );

    expect(hasMediaQuery).toBe(true);
  });

  test("handles object breakpoints", () => {
    const styleObject = fluid(typography)({
      theme: themeFactory({ breakpoints: { sm: "40em", fluidStart: "20em" } }),
      fontSize: [16, 21]
    });
    const hasFluidStartMediaQuery = Object.keys(styleObject).some(
      key => key.startsWith("@media") && key.includes("20em")
    );
    const hasSmMediaQuery = Object.keys(styleObject).some(
      key => key.startsWith("@media") && key.includes("40em")
    );

    expect(hasFluidStartMediaQuery && hasSmMediaQuery).toBe(true);
  });

  test("throws an error if breakpoints are defined in different units", () => {
    expect(() =>
      fluid(typography)({
        theme: themeFactory({ breakpoints: ["640px", "52em", "64rem"] })
      })
    ).toThrow(TypeError);
  });

  describe("given no fluidStart", () => {
    test('sets an "em" unit fluidStart for "em" unit breakpoints', () => {
      const styleObject = fluid(typography)({
        theme: themeFactory({ breakpoints: ["40em"] }),
        fontSize: [16, 21]
      });
      const fluidStartMediaQuery = Object.keys(styleObject).find(
        key => key.startsWith("@media") && !key.includes("40em")
      );

      expect(fluidStartMediaQuery).toMatch(/[0-9]+em/);
    });

    test('sets a "rem" unit fluidStart for "rem" unit breakpoints', () => {
      const styleObject = fluid(typography)({
        theme: themeFactory({ breakpoints: ["40rem"] }),
        fontSize: [16, 21]
      });
      const fluidStartMediaQuery = Object.keys(styleObject).find(
        key => key.startsWith("@media") && !key.includes("40rem")
      );

      expect(fluidStartMediaQuery).toMatch(/[0-9]+rem/);
    });

    test('sets a "px" unit fluidStart for "px" unit breakpoints', () => {
      const styleObject = fluid(typography)({
        theme: themeFactory({ breakpoints: ["640px"] }),
        fontSize: [16, 21]
      });
      const fluidStartMediaQuery = Object.keys(styleObject).find(
        key => key.startsWith("@media") && !key.includes("640px")
      );

      expect(fluidStartMediaQuery).toMatch(/[0-9]+px/);
    });

    test("throws an error for breakpoints declared with other units", () => {
      expect(() =>
        fluid(typography)({
          theme: themeFactory({ breakpoints: ["640pt"] }),
          fontSize: [16, 21]
        })
      ).toThrow(TypeError);
    });
  });
});
