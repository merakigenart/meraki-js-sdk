# Changelog

All notable changes to `meraki-js-sdk` will be documented in this file.


---

## v1.4.4 - 2023-03-15

- add `loadBytes()` support
- fix implementation of `loadStrings()` and `loadXML()`
- documentation updates

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.4.3...v1.4.4

## v1.4.3 - 2023-03-14

### What's Changed

- Bump actions/cache from 3.3.0 to 3.3.1 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/75
- Add features by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/76

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.4.1...v1.4.3

## v1.4.2 - 2023-03-13

- bug fixes

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.4.1...v1.4.2

## v1.4.1 - 2023-03-13

### What's Changed

- Add remote script asset loading functionality by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/74
- fix library build

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.3.0...v1.4.1

## v1.4.0 - 2023-03-13

### What's Changed

- Added script assets support
- npm(deps-dev): bump esbuild from 0.15.18 to 0.16.4 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/60
- Bump actions/cache from 3.0.11 to 3.2.0 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/61
- Bump actions/cache from 3.2.0 to 3.2.1 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/62
- Bump actions/cache from 3.2.1 to 3.2.2 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/63
- Bump actions/setup-node from 3.5.1 to 3.6.0 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/64
- Bump actions/cache from 3.2.2 to 3.2.3 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/65
- npm(deps-dev): bump esbuild from 0.16.17 to 0.17.1 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/66
- Bump dependabot/fetch-metadata from 1.3.5 to 1.3.6 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/67
- Bump actions/cache from 3.2.3 to 3.2.4 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/70
- Bump actions/cache from 3.2.4 to 3.2.5 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/71
- Bump actions/cache from 3.2.5 to 3.2.6 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/72
- Bump actions/cache from 3.2.6 to 3.3.0 by @dependabot in https://github.com/merakigenart/meraki-js-sdk/pull/73

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.3.0...v1.4.0

## v1.3.0 - 2022-12-06

### What's Changed

- Bump various dependencies
- Add log function by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/57
- Update documentation by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/58
- Add shuffle method by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/59

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.2.0...v1.3.0

## 1.2.0 - 2022-Feb-17

- Bump dependency versions
- Add parameter to pass a custom hash to `generateRandomTokenData()`
- Minor SDK template adjustments
- Code cleanup

## 1.1.2 - 2022-Feb-02

- fix issue with `BaseRandom` class

## 1.1.1 - 2022-Feb-02

- fix typo in `Meraki.random.element()`

## 1.1.0 - 2022-Feb-02

- refactored `Meraki.random.*` methods to always return same series of numbers based on the entropy hash
- removed `Meraki.random.shuffle()`
- updated `generateNewSdkTemplate()`
- code cleanup
- minor readme updates

## 1.0.0 - 2022-Jan-17

- initial release
