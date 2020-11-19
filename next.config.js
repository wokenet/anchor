const { emoteSize } = require('./constants.json')

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /emotes\/.*\.png$/i,
      use: [
        {
          loader: 'webpack-image-resize-loader',
          options: {
            width: emoteSize * 2,
            format: 'webp',
            quality: 80,
            fileLoaderOptions: {
              publicPath: '/_next/static/emotes/',
              outputPath: 'static/emotes/',
            },
          },
        },
      ],
    })
    return config
  },
}
