module.exports = {
  root: true,
  plugins: ['react', 'react-native'],
  extends: [
    '@react-native-community',
    'plugin:react',
    'plugin:react-native',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    'no-unused-vars': 0,
    'react-native/no-inline-styles': 0,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
