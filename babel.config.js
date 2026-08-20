module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
    overrides: [
      {
        // Fix Hermes parser failing on RN 0.79.x Flow-typed private web API files
        test: /node_modules[\\/]react-native[\\/]src[\\/]private[\\/]/,
        plugins: [
          ['@babel/plugin-transform-flow-strip-types', { allowDeclareFields: true }],
        ],
      },
    ],
  };
};
