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
    const setupPnp = () => {
      let retries = 10;
      while (retries > 0) {
        try {
          require(absPnpApiPath).setup();
          if (isPnpLoaderEnabled && register) {
            register(pathToFileURL(absPnpLoaderPath));
          }
          return;
        } catch (e) {
          if (e.code === 'EINTR' && retries > 1) {
            console.error(`[Prettier SDK] EINTR detected during setup, retrying... (${retries} left)`);
            retries--;
            const start = Date.now();
            while (Date.now() - start < 10);
            continue;
          }
          console.error(`[Prettier SDK] Failed to setup PnP:`, e);
          throw e;
        }
      }
    };
    setupPnp();
  }
}

const wrapWithUserWrapper = existsSync(absUserWrapperPath)
  ? (exports) => absRequire(absUserWrapperPath)(exports)
  : (exports) => exports;

const loadPrettier = () => {
  let retries = 10;
  while (retries > 0) {
    try {
      return wrapWithUserWrapper(absRequire(`prettier`));
    } catch (e) {
      if (e.code === 'EINTR' && retries > 1) {
        console.error(`[Prettier SDK] EINTR detected during require, retrying... (${retries} left)`);
        retries--;
        const start = Date.now();
        while (Date.now() - start < 10);
        continue;
      }
      console.error(`[Prettier SDK] Failed to load prettier:`, e);
      throw e;
    }
  }
};

module.exports = loadPrettier();
