const { withAppBuildGradle, withXcodeProject } = require("expo/config-plugins");

/**
 * Configuration plugin to remove some Expo defaults to ensure that re-pack works correctly.
 *
 * @param current Current expo configuration
 * @returns Modified expo configuration
 */
module.exports = (current) => {
	let res = current;

	// iOS
	// Replace CLI Path and Bundle Command in the Xcode project (this will ensure that the correct CLI is used in production builds)
	res = withXcodeProject(res, (configuration) => {
		const xcodeProject = configuration.modResults;
		const bundleReactNativeCodeAndImagesBuildPhase = xcodeProject.buildPhaseObject(
			"PBXShellScriptBuildPhase",
			"Bundle React Native code and images",
		);

		if (!bundleReactNativeCodeAndImagesBuildPhase)
			return configuration;

		const script = JSON.parse(bundleReactNativeCodeAndImagesBuildPhase.shellScript);
		const patched = script
			// eslint-disable-next-line style/max-len
			.replace(/if \[\[ -z "\$CLI_PATH" \]\]; then[\s\S]*?fi\n?/g, `export CLI_PATH="$("$NODE_BINARY" --print "require('path').dirname(require.resolve('@react-native-community/cli/package.json')) + '/build/bin.js'")"`)
			.replace(/if \[\[ -z "\$BUNDLE_COMMAND" \]\]; then[\s\S]*?fi\n?/g, "");

		bundleReactNativeCodeAndImagesBuildPhase.shellScript = JSON.stringify(patched);
		return configuration;
	});

	// Android
	// Replace CLI Path and Bundle Command in the build.gradle file (this will ensure that the correct CLI is used in production builds)
	res = withAppBuildGradle(res, (configuration) => {
		const buildGradle = configuration.modResults.contents;
		const patched = buildGradle.replace(/cliFile.*/, "").replace(/bundleCommand.*/, "bundleCommand = \"bundle\"");

		configuration.modResults.contents = patched;
		return configuration;
	});

	return res;
};
