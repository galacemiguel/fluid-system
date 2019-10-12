# Changelog

## 1.0.0 - 2019/10/12

### Changes

- The default `fluid` export now transforms existing style prop functions (e.g., `typography` and `space` from `styled-system`) to make their output styles fluid where appropriate
- `_fluidSystem.startingWidth` is now defined via a `fluidStart` alias on the theme `breakpoints` array
- Skipping breakpoints is done now with `null` instead of `"-"` as before to align with the Styled System syntaax

### Additions

- A default `fluidStart` value is set at `320px` (or `20em/rem` depending on what units your `breakpoints` are defined in)
- There is now also `breakpoints` default of `["40em", "52em", "64em"]`
- Object `breakpoints` support
- Integration tests
- Continuous integration via `TravisCI`
- Test coverage reports via `Codecov`
- Code linting via `eslint`
