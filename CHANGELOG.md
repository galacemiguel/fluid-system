# Changelog

## 1.0.12 - 2021/05/23

- Upgrade vulnerable dependencies

## 1.0.11 - 2021/03/20

- Upgrade vulnerable dependencies

## 1.0.10 - 2020/09/12

- Update dependencies

## 1.0.9 - 2020/03/15

- Update dependencies

## 1.0.8 - 2020/02/06

- Fixed errors with shorthand style declarations ([#8](https://github.com/galacemiguel/fluid-system/issues/8))
- Fixed errors with irregular fluidStart values ([#6](https://github.com/galacemiguel/fluid-system/issues/6))
- Fixed error in README code example
- Added comment to README code example describing object breakpoints support

## 1.0.7 - 2019/12/15

- Miscellaneous README fixes
- Fix npm–repository link

## 1.0.5 - 2019/11/30

- Replace lookbehind regex for better cross-browser support ([#3](https://github.com/galacemiguel/fluid-system/issues/3))

## 1.0.3 - 2019/10/16

- Removed non-production files from package tarball

## 1.0.2 - 2019/10/16

- Update phrasing in some sections of the README

## 1.0.1 - 2019/10/13

- Exclude generating of fluid styles for styles that do not meet the same-unit requirements
- Added integration test for same-unit requirements
- New README section on same-unit requirements

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
