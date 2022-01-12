# Meraki Script SDK

- [Meraki Script SDK](#meraki-script-sdk)
    - [Overview](#overview)
    - [Writing Scripts for Meraki](#writing-scripts-for-meraki)
      - [Required Methods](#required-methods)
        - [`execute()`](#execute)
        - [`initialize()`](#initialize)
        - [`version()`](#version)
        - [`configure()`](#configure)
      - [Creating Scripts for P5](#creating-scripts-for-p5)
      - [Random values](#random-values)
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

### Overview

THe Meraki platform requires that artists provide scripts created using a framework that we provide - this SDK.  At its core, a script is an ES2015+ class that extends a base class and implemented specific methods.

### Writing Scripts for Meraki

To create a script for Meraki, you must use the framework (SDK) we provide via an npm package. This allows for uniformity between scripts, regardless of what rendering library is in use. Additionally, this makes it easier to create scripts as there's a single, documented way to write a valid Meraki script.

The core of your script will be a modern ECMAScript class named `Script` that extends a `MerakiScript` class, as shown below:

```js
class Script extends MerakiScript {
    //
}
```

The `MerakiScript` class gets included automatically by the SDK browser bundle during rendering.

#### Required Methods

##### `execute()`

The `execute` method is where you place the code that renders the artwork.  It's equivalent to the `setup` function for `p5`.  If you have a `p5` script, you should extract the body of that function and place it in the `execute` method.

##### `initialize()`

Called before execution to allow for initial setup of class properties or other values and actions to prepare for rendering.  When using the `p5` library, it calls `preload()`.

##### `version()`

You must provide a `version` method that returns a [semantic version](https://github.com/semver/semver/blob/master/semver.md) string for the current version of your script.

```js
    version() {
        return '1.2.0';
    }
```

##### `configure()`

Every script class must have a `configure` method that returns a `MerakiScriptConfiguration` type object with the following properties:
- `renderTimeMs`: an integer value that indicates an approximate time in milliseconds for how long the script takes to render. _optional_.
- `library`: returns an object with `name` and `version` properties that specify the name and desired version of the rendering library to use. _optional_.

```js
    configure() {
        return {
            renderTimeMs: 100,
            library: {
                name: 'p5',
                version: '1.4.0',
            }
        };
    }
```

All properties are optional, so this would also be a valid `configure()` method:

```js
    configure() {
        return {};
    }
```

For reference, the `MerakiScriptConfiguration` interface definition is as follows:

```ts
interface MerakiScriptConfiguration {
    renderTimeMs?: number;
    library?: {
        name?: string;
        version?: string;
    };
}
```

#### Creating Scripts for P5

When creating a script class to for rendering by the `p5` library, you may use the same code that you'd use when not using a framework.  The primary difference is that the code placed within `setup()` is now located in the `execute()` method in your `MerakiScript` class.

If you have a `draw()` function defined, you should instead add a `draw()` method to your script class and place the code there.


```js
// Sample script implementation using p5.js

class Script extends MerakiScript {
    randomFill = 0;

    execute() {
        createCanvas(Meraki.canvas.width, Meraki.canvas.height);

        fill(randomFill, 31, 81);
        noStroke();

        rect(55, 55, 250, 250);
        fill(255);

        textSize(14);
    }

    draw = () => {
        text("hello world !", 50, 250);
    }

    initialize() {
        //called before execution
        this.randomFill = Meraki.random.integer(0, 200);
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
}

// You must call Meraki.registerScript() to properly setup the class instance
Meraki.registerScript(new Script());
```

#### Random values

Your script may require random values (integers, decimals, etc.), but is required to use the Meraki-provided value _(the "entropy hash")_ as the basis for all randomness.  To make it easier, the SDK provides helper methods to generate predictable random values based on the entropy hash.

You may access the helper methods via the `Meraki.random` class, which provides the following methods:

- `decimal()`: returns a random decimal between 0 and 1.
- `number(min, max)`: random number; both `min` and `max` are optional integer values
- `integer(min, max)`: random integer; both `min` and `max` are optional integer values
- `boolean(percent)`: random boolean, where optional `percent` is the percentage chance of a `true` result
- `element(array)`: returns a random element from the provided array

```js
    // return true approxamtely 50% of the time
    for(let i = 0; i < 10; i++) {
        console.log(`loop ${i + 1}: `, Meraki.random.boolean());
    }

    // return true approxamtely 10% of the time
    for(let i = 0; i < 10; i++) {
        console.log(`loop ${i + 1}: `, Meraki.random.boolean(10));
    }
```


### Animated Example Script

```js
class Script extends MerakiScript {
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

    draw = () => {
        this.redraw();
    }

    initialize() {
        super.initialize();
        console.log('init');
    }

    configure() {
        return {
            renderTimeMs: 50
        }
    }
}

// You must call createArtworkScript() to properly setup the class instance
registerScript(new Script());
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

---

Notes:

- `Meraki`
  - `data`
    - `tokenId` - token id
    - `hash` - platform-provided random value
  - `canvas` - canvas size to use when generating the image, determined by browser/window size
    - `width`
    - `height`

---

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
