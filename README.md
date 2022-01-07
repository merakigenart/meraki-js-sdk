# meraki-sdk

---

Meraki Script SDK

The advantage in having an SDK is that there is a single, predictable way to write the scripts, regardless of whether it's using `p5`, `three`, or another library for image generation. It also improves the overall development experience, as long as the SDK is high-quality, easy to use, and has great documentation.


- `Meraki`
  - `data`
    - `tokenId`
    - `hash`
  - `random`
    - `integer()`
    - `decimal()`
    - `boolean()`
  - `canvas`
    - `width`
    - `height`

 - `MerakiScript`
   - `initialize()`
   - `execute()`
   - `configure()`
      ```js
        return {
            renderDelayMs: number;
            libraryName: string;
            libraryVersion: string;
        }
    ```


```js
class Script extends MerakiScript {
    execute() {
        const random1 = Meraki.random.integer();
        // generate image here
    }

    initialize() {
        //called prior to execution
    }

    configure() {
        return {
            renderDelayMs: 100,
            libraryName: 'p5',
            librarVersion: '1.4.0',
        }
    }
}
```


## Setup

```bash
npm install

npm run dev
```

## Testing

`meraki-sdk` uses Jest for unit tests.  To run the test suite:

`npm run test`

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
