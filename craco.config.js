module.exports = {
  webpack: {
    configure: webpackConfig => {
      // Remove fallback block, not supported in webpack v4
      return webpackConfig
    },
  },
}
