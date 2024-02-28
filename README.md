# TwelveLabs Javascript SDK

## Internal Testing

Before releasing to the NPM, internal users can use this library through the command below. This installs and builds the package dependency and links the library so that it can be used locally.

```bash
yarn # or npm install
yarn build-local # or npm run build-local
```

You can now use the library linked via this command below in your project repository.

```bash
yarn link twelvelabs-js # or npm link twelvelabs-js
```

Additionally, you can test it in a development environment by setting `TWELVELABS_BASE_URL` in the environment variable. It will automatically recognize and change the API URL.

Below is a simple example using Javascript (You can also use Typescript)

```js
const { TwelveLabs } = require('twelvelabs-js');

(async () => {
  const client = new TwelveLabs({ apiKey: process.env.TL_API_KEY });
  const engines = await client.engine.list();
  console.log(engines);
})();
```

For other examples, please refer to the `examples` folder in the repository.
