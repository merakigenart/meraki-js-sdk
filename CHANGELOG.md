# Changelog

All notable changes to `meraki-js-sdk` will be documented in this file.


---

## v1.3.0 - 2022-12-07

### What's Changed

- Bump various dependencies
- Add log function by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/57
- Update documentation by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/58
- Add shuffle method by @patinthehat in https://github.com/merakigenart/meraki-js-sdk/pull/59

**Full Changelog**: https://github.com/merakigenart/meraki-js-sdk/compare/v1.2.0...v1.3.0

## 1.3.0 - 2022-Dec-06

- Add `Meraki.random.shuffle()` method
- Add `Meraki.log()` method
- Update documentation

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
