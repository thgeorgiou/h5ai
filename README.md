# h5ai

This fork of [h5ai](https://larsjung.de/h5ai/) includes a performance fix for large folders authored by [glubsy](https://github.com/glubsy). Check the original project or the related [pull request](https://github.com/lrsjng/h5ai/pull/771) for more info.

## Building

To make a build:

```sh
# Fixes an issue w/ WebPack, see https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

You will get the processed sources and a zip file inside `build/`.


## Configuration

For big folder trees, you might still get a timeout error even after applying this fix. Disabling `foldersize` in the configuration really helps. I also recommend disabling `download` to prevent someone from trying to download a giant folder as a zip file.
