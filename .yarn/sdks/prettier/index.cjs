#!/usr/bin/env node

const { existsSync } = require(`fs`);
const { createRequire, register } = require(`module`);
const { resolve } = require(`path`);
const { pathToFileURL } = require(`url`);

const relPnpApiPath = "../../../.pnp.cjs";

const absPnpApiPath = resolve(__dirname, relPnpApiPath);
const absUserWrapperPath = resolve(__dirname, `./sdk.user.cjs`);
const absRequire = createRequire(absPnpApiPath);

const absPnpLoaderPath = resolve(absPnpApiPath, `../.pnp.loader.mjs`);
const isPnpLoaderEnabled = existsSync(absPnpLoaderPath);

if (existsSync(absPnpApiPath)) {
  if (!process.versions.pnp) {
    // Setup the environment to be able to require prettier
    let retries = 5;
    while (retries > 0) {
      try {
        require(absPnpApiPath).setup();
        break;
      } catch (e) {
        if (e.code === 'EINTR' && retries > 1) {
          delete require.cache[absPnpApiPath];
          retries--;
          continue;
        }
        throw e;
      }
    }
    if (isPnpLoaderEnabled && register) {
      register(pathToFileURL(absPnpLoaderPath));
    }
  }
}

const wrapWithUserWrapper = existsSync(absUserWrapperPath)
  ? (exports) => absRequire(absUserWrapperPath)(exports)
  : (exports) => exports;

// Defer to the real prettier your application uses
module.exports = wrapWithUserWrapper(absRequire(`prettier`));
