const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src', 'js', 'index.js'),
    game: path.resolve(__dirname, 'src', 'js', 'game.js'),
    room: path.resolve(__dirname, 'src', 'js', 'room.js'),
  },
  output: {
    clean: true,
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.webp$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[hash][ext][query]',
        },
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/audio/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/font/[hash][ext][query]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(__dirname, 'src', 'static', 'favicon.ico'),
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'game.html',
      template: path.resolve(__dirname, 'src', 'game.html'),
      favicon: path.resolve(__dirname, 'src', 'static', 'favicon.ico'),
      chunks: ['game'],
    }),
    new HtmlWebpackPlugin({
      filename: 'room.html',
      template: path.resolve(__dirname, 'src', 'room.html'),
      favicon: path.resolve(__dirname, 'src', 'static', 'favicon.ico'),
      chunks: ['room'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    })
  ],
};