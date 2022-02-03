<p align="center">
    <img style="width: 400px;" src="https://repository-images.githubusercontent.com/448071637/0d3befa7-1dfe-42b6-b360-637a9b00202a" alt="" />
</p>

# Meraki Script SDK

- [Meraki Script SDK](#meraki-script-sdk)
  - [Overview](#overview)
    - [Writing Scripts for Meraki](#writing-scripts-for-meraki)
    - [Creating A Project](#creating-a-project)
    - [Submitting your work](#submitting-your-work)
  - [SDK Overview](#sdk-overview)
    - [The `Meraki` class](#the-meraki-class)
      - [Properties](#properties)
        - [`canvas`](#canvas)
        - [`data`](#data)
        - [`utils`](#utils)
          - [`hash`](#hash)
          - [`chunkify()`](#chunkify)
        - [`random`](#random)
        - [`window`](#window)
      - [Methods](#methods)
        - [`registerScript()`](#registerscript)
        - [`tokenAgeInSeconds()`](#tokenageinseconds)
    - [The `Script` class](#the-script-class)
      - [Required Methods](#required-methods)
        - [`execute()`](#execute)
        - [`initialize()`](#initialize)
        - [`configure()`](#configure)
        - [`traits()`](#traits)
      - [Optional Methods](#optional-methods)
        - [`version()`](#version)
        - [`draw()`](#draw)
    - [The `ScriptTraits` class](#the-scripttraits-class)
    - [Creating Scripts for P5](#creating-scripts-for-p5)
    - [Animated Example Script](#animated-example-script)
  - [SDK Development](#sdk-development)
    - [Setup](#setup)
    - [Testing](#testing)
  - [Changelog](#changelog)
  - [Contributing](#contributing)
  - [Security Vulnerabilities](#security-vulnerabilities)
  - [Credits](#credits)
  - [License](#license)

---

## Overview

The [Meraki platform](https://mraki.io) requires that artists provide scripts created using a framework that we provide - this SDK.  At its core, a script is an ES2015+ class that extends a base class and implemented specific methods.

**Note: This SDK is a beta release and is subject to change.**

### Writing Scripts for Meraki

To create a script for Meraki, you must use the framework (SDK) we provide as an npm package. This allows for uniformity between scripts, regardless of what rendering library is in use. This makes it easier to create scripts as there's a single, documented way to write a valid Meraki script.

The core of your script will be a modern ECMAScript class named `Script` that extends a `MerakiScript` class, as shown below:

```js
class Script extends MerakiScript {
    //
}
```

See [below](#the-script-class) for more information on creating the `Script` class implementation.

### Creating A Project

The easiest way to get started is to use our [starter template](https://github.com/merakigenart/script-starter-template).  Click the "Use This Template" button to generate a new GitHub repository based on the template.

![image](https://user-images.githubusercontent.com/5508707/149585559-3145fa58-7b75-455c-a8d6-d8afc28645b3.png)

Or install the sdk into your existing project:

```bash
npm install meraki-js-sdk
```


### Submitting your work

The package you submit for review should contain a `Script.js` file that exports a [`Script`](#the-script-class) class, and a `ScriptTraits.js` file that exports a [`ScriptTraits`](#the-scripttraits-class) class.  Both files should use named exports (ESM).

**Do not submit minified or transpiled/compiled scripts.**

Please see the [Artist Application](https://mraki.io/application) on [mraki.io](https://mraki.io) for more information about applying.

## SDK Overview

### The `Meraki` class

#### Properties

##### `canvas`

The `Meraki.canvas` property provides information about the canvas you should create.  It has `width` and `height` properties:

```ts
interface Dimensions {
    height: number;
    width: number;
}
```

##### `data`

The `Meraki.data` property provides information about the image to generate, including a random entropy hash that **must** seed all random values generators in the script.

```ts
interface MerakiTokenData {
    tokenHash: string; // random 64-character hexadecimal value used for seeding RNGs, etc.; starts with '0x'.
    tokenId: string; // the specific token (NFT) identifier that the script is creating.
    mintedAt: number|string; // the unix timestamp that the minting of the token occurred.
}
```

While `Meraki` provides random number generation functions, if you choose to write your own you must seed it with the `tokenHash` value:

```js
function my_custom_rng(seed) {
    // do some work
}

const value = my_custom_rng(Meraki.data.tokenHash);
```

Writing your own RNG function is optional - see the [random documentation](#random) for information on the functions that the `Meraki` class provides.

##### `utils`

This `Meraki.utils` property provides access to common helper functions that you may choose to use when writing your script.

###### `hash`

The `Meraki.utils.hash` property provides common hash functions:

- `murmurhash3.hash32()`
- `murmurhash3.hash128()`
- `sha256()`

```js
const hash1 = Meraki.utils.hash.sha256('my string');
const hash2 = Meraki.utils.hash.murmurhash3.hash32('my string');
```

###### `chunkify()`

The `chunkify()` function separates string into chunks of the same size.

```ts
// function signature
function chunkify(str: string, size: number): string[];
```

```js
const hashChunks = Meraki.utils.chunkify(Meraki.data.tokenHash, 4);
```

##### `random`

The `Meraki.random` property provides access to random value generation functions using a `Random` class.

Your script may require random values (integers, decimals, etc.), but you're required to use the Meraki-provided value _(the "entropy hash")_ as the basis for all randomness.  To make it easier, the SDK provides helper methods to generate predictable random values based on the entropy hash.

You may access the helper methods via the `Meraki.random` class, which provides the following methods:

- `boolean(percent)`: random boolean, where optional `percent` is the percentage chance of a `true` result
- `decimal()`: returns a random decimal between 0 and 1.
- `element(array)`: returns a random element from the provided array
- `integer(min, max)`: random integer; `max` is an optional integer value
- `number(min, max)`: random number _(with a decimal value)_; `max` is an optional numeric value

```js
    // return true approxamtely 50% of the time
    for(let i = 0; i < 10; i++) {
        console.log(`loop ${i + 1}: `, Meraki.random.boolean());
    }

    // return true approxamtely 10% of the time
    for(let i = 0; i < 10; i++) {
        console.log(`loop ${i + 1}: `, Meraki.random.boolean(10));
    }

    const numberBelowTen = Meraki.random.element([1, 2, 3, 4, 5, 6, 7, 8, 9]);
```

##### `window`

The `Meraki.window` property provides information about the size of the browser window.  It has `width` and `height` properties:

```ts
interface MerakiWindowInformation {
    height: number;
    width: number;
}
```

#### Methods

##### `registerScript()`

The `Meraki.registerScript(instance)` method registers your script class to allow for automated rendering of your code.  You may call this method manually as the last line in your script, or omit it entirely _(it's called automatically)_.

##### `tokenAgeInSeconds()`

The `Meraki.tokenAgeInSeconds()` method returns the number of seconds since the token was originally minted.

### The `Script` class

The `Script` class you create must extend the `MerakiScript` class.


#### Required Methods

##### `execute()`

The `execute` method is where you place the code that renders the artwork.  It's equivalent to the `setup` function for `p5`.  If you have a `p5` script, you should extract the body of that function and place it in the `execute` method.

##### `initialize()`

Called before execution to allow for initial setup of class properties or other values and actions to prepare for rendering.  When using the `p5` library, it's equivalent to `preload()`.

##### `configure()`

Every script class must have a `configure` method that returns a `MerakiScriptConfiguration` type object with the following properties:

- `animation`: a boolean indicating if the generated image is an animation. _optional_.
- `sdkVersion`: a string containing the SDK version used when developing your script.  Valid values include '2', '2.0', '2.0.1', etc. _optional_.
- `renderTimeMs`: an integer value that indicates an approximate time in milliseconds for how long the script takes to render. _optional_.
- `library`: returns an object with `name` and `version` properties that specify the name and desired version of the rendering library to use. _optional_.

```js
    configure() {
        return {
            animation: false,
            sdkVersion: '2.0',
            renderTimeMs: 100,
            library: {
                name: 'p5',
                version: '1.4.0',
            }
        };
    }
```

If you are using plain javascript, set `library.name` to `'javascript'` and `library.version` to an empty string.

All properties are optional, so this would also be a valid `configure()` method:

```js
    configure() {
        return {};
    }
```

For reference, the `MerakiScriptConfiguration` interface definition is as follows:

```ts
interface MerakiScriptConfiguration {
    animation?: boolean;
    sdkVersion?: string;
    renderTimeMs?: number;
    library?: {
        name?: string;
        version?: string;
    };
}
```


##### `traits()`

Every script class must have a `traits` method that returns a an array of trait names and values that were used during the generation of the image based on the entropy hash.  There are different ways of storing this information, but you might choose to store the selected traits as properties on the `Script` class:

```js
traits() {
    return {
        color: this.selectedColorTrait,
        size: this.selectedSizeTrait,
    }
}
```

A more efficient way might be to calculate the traits selected within the method itself:

```js
traits() {
    const traits = new ScriptTraits();

    const color = Meraki.random.element(traits.color());
    const size = Meraki.random.element(traits.size());

    return {
        color,
        size,
    };
}
```

#### Optional Methods

##### `version()`

You may provide a `version` method that returns a [semantic version](https://github.com/semver/semver/blob/master/semver.md) string for the current version of your script.

```js
version() {
    return '1.2.0';
}
```

##### `draw()`

The `draw` method is where you place code that renders the artwork in a loop _(i.e., for animated images)_.  This is only relevant when using the `p5` rendering library.  This method is optional.

### The `ScriptTraits` class

Your script must define all possible trait names and values that may exist within a generated image.  This should be defined as a separate class named `ScriptTraits` that does not extend any other class.  Each feature name should be a method, should be **singular** and not plural, written in camelCase, and its return value should always be an array of all possible values for that feature.

The package you submit for review should contain a `ScriptTraits.js` file that exports a `ScriptTraits` class as a named export (ESM).

For example:

```js
export class ScriptTraits {
    color() {
        return ['red', 'blue', 'green', 'purple'];
    }

    size() {
        return ['small', 'medium', 'large'];
    }

    form() {
        return ['circle', 'hard', 'soft'];
    }

    speed() {
        return ['conceptual', 'meditative'];
    }

    palette() {
        return ['darkness', 'laguna', 'light', 'oracle', 'phoenix', 'sands'];
    }
}
```

### Creating Scripts for P5

When creating a script class to for rendering by the `p5` library, you may use the same code that you'd use when not using a framework.  The primary difference is that the code placed within `setup()` is now located in the `execute()` method in your `MerakiScript` class.

If you have a `draw()` function defined, you should instead add a `draw()` method to your script class and place the code there.

_Note: The `MerakiScript` class gets included automatically by the SDK browser bundle during rendering._

```js
// Sample script implementation using p5.js

import { MerakiScript } from 'meraki-js-sdk/sdk';

export class Script extends MerakiScript {
    randomFill = 0;

    execute() {
        createCanvas(Meraki.canvas.width, Meraki.canvas.height);

        fill(randomFill, 31, 81);
        noStroke();

        rect(55, 55, 250, 250);
        fill(255);

        textSize(14);
    }

    draw() {
        super.draw();
        text("hello world !", 50, 250);
    }

    initialize() {
        //called before execution
        super.initialize();
        this.randomFill = Meraki.random.integer(0, 200);
    }

    version() {
        return '1.0.0';
    }

    configure() {
        return {
            renderTimeMs: 100,
            library: {
                name: 'p5',
                version: '1.4.0',
            }
        }
    }

    traits() {
        const color = Meraki.random.element(new ScriptTraits().color());

        return { color, size: 'small' };
    }
}
```


### Animated Example Script

```js
import { MerakiScript } from 'meraki-js-sdk/sdk';

export class Script extends MerakiScript {
    randomFill = 0;

    redraw() {
        fill(this.randomFill, 31, 81);
        noStroke();

        rect(55, 55, 250, 250);
        fill(255);

        textSize(23);
        text("Counter: " + this.getSeconds(), 100, 250);
    }

    execute() {
        createCanvas(Meraki.canvas.width, Meraki.canvas.height);
        this.randomFill = Meraki.random.integer(1, 240);
        this.redraw();
    }

    getSeconds() {
        return new Date().getSeconds();
    }

    draw() {
        super.draw();
        this.redraw();
    }

    initialize() {
        super.initialize();
        console.log('init');
    }

    version() {
        return '1.1.0';
    }

    configure() {
        return {
            renderTimeMs: 50
        }
    }

    traits() {
        const color = Meraki.random.element(new ScriptTraits().color());

        return { color, size: 'small' };
    }
}
```

The resulting animated image renders in the browser:

<p align="center">
    <img style="width: 175px;" src="https://user-images.githubusercontent.com/5508707/149060364-5298974f-d1f1-4f4d-a430-7b51154b06d5.gif" alt="sample01" />
</p>

---

## SDK Development

### Setup

For development of the SDK, you must first install all dependencies, and then run the build script:

```bash
npm install
npm run build:dev
```

This process will create a file named `sdk.js` in the `dist` directory.  This is a valid javascript library that may be used within the browser environment for rendering generative art scripts.

### Testing

`meraki-js-sdk` uses Jest for unit tests.  To run the test suite:

```bash
npm run test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed between versions.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Patrick Organ](https://github.com/patinthehat)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
