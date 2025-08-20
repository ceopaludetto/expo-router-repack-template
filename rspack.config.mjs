import { resolve } from "node:path";

import * as Repack from "@callstack/repack";
import { DefinePlugin } from "@rspack/core";

export default ({ mode, platform, devServer }) => ({
  mode,
  devServer: !!devServer && {
    ...devServer,
    // Use the virtual metro entry point for Expo
    proxy: [
      {
        context: ["/.expo/.virtual-metro-entry"],
        pathRewrite: { "^/.expo/.virtual-metro-entry": "/index" },
      },
    ],
  },
  resolve: {
    ...Repack.getResolveOptions(),
    alias: {
      "~": resolve("src"),
    },
  },
  module: {
    rules: [
      ...Repack.getJsTransformRules(),
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    // Repack specific plugins
    new Repack.RepackPlugin(),

    // Inline some variables to support some expo and expo-router packages
    new DefinePlugin({
      "process.env.EXPO_BASE_URL": JSON.stringify(""),
      "process.env.EXPO_OS": JSON.stringify(platform),
      "process.env.EXPO_PROJECT_ROOT": JSON.stringify(resolve(".")),
      "process.env.EXPO_ROUTER_ABS_APP_ROOT": JSON.stringify(resolve("./src/screens")),
      "process.env.EXPO_ROUTER_APP_ROOT": JSON.stringify("~/screens"),
      "process.env.EXPO_ROUTER_IMPORT_MODE": JSON.stringify("sync"),
    }),
  ],
});
