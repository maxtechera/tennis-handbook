module.exports = function (context, options) {
  return {
    name: 'custom-webpack-config',
    configureWebpack(config, isServer, utils) {
      return {
        module: {
          rules: [
            {
              test: /\.ya?ml$/,
              use: 'js-yaml-loader',
            },
          ],
        },
      };
    },
  };
};