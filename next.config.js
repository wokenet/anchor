const path = require('path')
const { emoteSize } = require('./constants.json')

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolveLoader.modules.push(path.resolve(__dirname, 'src/loaders'))
    config.module.rules.push({
      test: /.*\.png$/i,
      include: /woke-content/,
      use: {
        loader: 'webpack-image-resize-loader',
        options: {
          width: emoteSize * 2,
          fileLoaderOptions: {
            publicPath: '/_next/static/emotes/',
            outputPath: 'static/emotes/',
          },
        },
      },
    })
    config.module.rules.push({
      test: /.*\.gif$/i,
      include: /woke-content/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/emotes/',
            outputPath: 'static/emotes/',
          },
        },
        {
          loader: 'resize-gif-loader',
          options: {
            size: emoteSize * 2,
          },
        },
      ],
    })
    config.module.rules.push({
      test: /.*\.mp4$/i,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/',
          outputPath: 'static/',
        },
      },
    })
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        defaultLoaders.babel,
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false,
              },
            },
          },
        },
      ],
    })
    return config
  },
}
