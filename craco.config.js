const path = require('path')

module.exports = {
  babel: {
    plugins: [
      [
        'babel-plugin-styled-components',
        {
          fileName: false,
        },
      ],
    ],
  },
  webpack: {
    configure: webpackConfig => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        process: require.resolve('process/browser'),
      }
      return webpackConfig
    },
  },
}
