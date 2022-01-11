# Meraki Script SDK

---

### Writing Scripts for Meraki

To create a script for Meraki, you must use the framework (SDK) we provide via an npm package. This allows for uniformity between scripts, regardless of what rendering library is used. Additionally, this makes it easier to create scripts as there's only a single, documented way to write a valid Meraki script.

The core of your script will be a modern ECMAScript class named `Script` that extends a `MerakiScript` class, as shown below:

```js
class Script extends MerakiScript {
    //
}
```

### Creating Scripts for P5

When creating a script class to be rendered by the `p5` library, you may largely use the same code that you'd use when not using a framework.  The primary difference is that the code normally placed within `setup()` is now placed inside of the `execute()` method in your `MerakiScript` class.

If you have a `draw()` function defined, you should instead add a `draw()` method to your script class and place the code there.


```js
// Sample script implementation using p5.js

class Script extends MerakiScript {
    execute() {
        const random1 = Meraki.random.integer();
        const random2 = Meraki.random.integer();

        createCanvas(windowWidth, windowHeight);

        fill(234, 31, 81);
        noStroke();

        rect(55, 55, 250, 250);
        fill(255);

        textSize(14);
        text("hello world !", 50, 250);
    }

    initialize() {
        //called prior to execution
    }

    configure() {
        return {
            renderDelayMs: 100,
            libraryName: 'p5',
            libraryVersion: '1.4.0',
        }
    }
}

// You must call Meraki.registerScript() to properly setup the class instance
Meraki.registerScript(new Script());
```

### Random values

Your script may require random values (integers, decimals, etc.) but are required to use the Meraki-provided value _(the "token random hash")_ as the basis for all randomness.  To make it easier, the SDK provides several helper methods to generate random values that are based on the token random hash.

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

---

## Development Setup

For development of the SDK, you must first install all dependencies, and then run the build script:

```bash
npm install
npm run build:dev
```

This process will create a file named `sdk.js` in the `dist` directory.  This is a valid javascript library that may be used within the browser environment for rendering generative art scripts.

## Testing

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

- `MerakiScript` - abstract class that's extended by the script implementation
  - `initialize()` - called prior to execution/generation
  - `execute()` - generates the image
  - `configure()` - defines configuration info for the script

    ```js
    return {
        renderDelayMs: number; //time in ms needed to render the image; optional
        libraryName: string; //library used for rendering: p5, three, etc. required.
        libraryVersion: string; //library version; optional
    }
    ```

---

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Patrick Organ](https://github.com/patinthehat)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
