# Changelog

All notable changes to `meraki-js-sdk` will be documented in this file.

---

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
