# Expo Router + Re.Pack

An Expo Router + Re.Pack template

## Getting Started

Install dependencies:

```sh
bun install
```

Generate native directiores:

```sh
bun expo prebuild --clean
```

Build and install application on emulator/device:

```sh
bun run ios # for iOS
bun run android # for Android
```

Start Re.Pack development server:

```sh
bun run start
```

## Changing expo-router root directory

Change root in [app.json](./app.json):

```jsonc
{
  // ...
  "plugins": [["expo-router", { "root": "./src/routes" }]]
}
```

Change both `process.env.EXPO_ROUTER_ABS_APP_ROOT` and `process.env.EXPO_ROUTER_APP_ROOT` in [rspack.config.mjs](./rspack.config.mjs)

```js
export default () => ({
  plugins: [
    // ...
    new DefinePlugin({
      // ...
      "process.env.EXPO_ROUTER_ABS_APP_ROOT": JSON.stringify(resolve("./src/routes")),
      "process.env.EXPO_ROUTER_APP_ROOT": JSON.stringify("~/routes"),
    }),
  ],
});
```
