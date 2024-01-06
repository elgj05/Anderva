module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@pages': './src/pages',
          '@components': './src/components',
          '@helpers': './src/helpers',
          '@icons': './src/assets/icons',
        },
      },
    ],
  ],
};
