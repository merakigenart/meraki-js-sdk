/**
 * The base URL for all script assets, and must end with a trailing slash.
 */
const getMerakiCdnHost = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.host;
    }
    return `mraki.io`;
};

const getMerakiScriptDataAssetsUrl = () => `https://${getMerakiCdnHost()}/cdn/project-assets/data/`;
const getMerakiScriptFileAssetsUrl = () => `https://${getMerakiCdnHost()}/cdn/project-assets/files/`;

const ensureSuffix = (path: string, suffix: string) => {
    if (path.endsWith(suffix)) {
        return path;
    }

    return path + suffix;
};

export class Assets {
    protected sanitizeUrl(url: string) {
        if (!url.startsWith('/') && !url.startsWith('http')) {
            return url;
        }

        const parsed = new URL(url);
        return parsed.pathname.replaceAll('..', '');
    }

    public async loadStrings(path: string) {
        path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, '/data.txt'));

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadStrings(path);
        } catch (e) {
            //
        }

        return '';
    }

    public async loadXML(path: string) {
        path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, '/data.xml'));

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadXML(path);
        } catch (e) {
            //
        }

        return '';
    }

    /**
     * Loads a JSON file from a script asset URL, and returns an Object.
     * Note that even if the JSON file contains an Array, an Object will be returned with index numbers as keys.
     * @param path
     * @returns
     */
    public async loadJSON(path: string) {
        path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, '/data.json'));

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadJSON(path);
        } catch (e) {
            //
        }

        return {};
    }

    /**
     * Reads the contents of a script asset URL and creates a p5.Table object with its values.
     * @param {string} path
     * @param {string} extension
     * @param {string} header
     * @param {any} callback
     * @param {any} allback
     */
    public async loadTable(path: string, extension: string, header: string, callback: any, errorCallback: any) {
        path = getMerakiScriptDataAssetsUrl() + this.sanitizeUrl(ensureSuffix(path, '/data.csv'));

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadTable(path, extension, header, callback, errorCallback);
        } catch (e) {
            //
        }

        return {};
    }

    /**
     * Loads an image from the `path` script asset url and creates a p5.Image from it.
     * @param {string} path
     * @param {any} successCallback
     * @param {any} failureCallback
     */
    public async loadImage(path: string, successCallback, failureCallback) {
        if (!path.startsWith('data:image/png;base64')) {
            path = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(path);
        }

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadImage(path, successCallback, failureCallback);
        } catch (e) {
            //
        }

        return {};
    }

    /**
     * Loads a font from the `path` script asset url and creates a p5.Font from it.
     * @param {string} path
     * @param {any} callback
     * @param {any} onError
     */
    public async loadFont(path: string, callback: any, onError: any) {
        path = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(path);

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadFont(path, callback, onError);
        } catch (e) {
            //
        }

        return {};
    }

    /**
     * Creates a new p5.Shader object from the provided vertex and fragment shader script asset file urls.
     * @param {string} vertFilename
     * @param {string} fragFilename
     * @param {any} callback
     * @param {any} errorCallback
     */
    public async loadShader(vertFilename: string, fragFilename: string, callback, errorCallback) {
        vertFilename = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(vertFilename);
        fragFilename = getMerakiScriptFileAssetsUrl() + this.sanitizeUrl(fragFilename);

        try {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return loadShader(vertFilename, fragFilename, callback, errorCallback);
        } catch (e) {
            //
        }

        return {};
    }
}
