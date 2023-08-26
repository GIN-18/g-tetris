const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "src", "js", "index.js"),
    single: path.resolve(__dirname, "src", "js", "single.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "src", "js"),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.webp$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "audio",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src", "index.html"),
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "single.html",
      template: path.resolve(__dirname, "src", "single.html"),
      chunks: ["single"],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 75,
          },
        },
      ],
      overrideExtension: true,
    }),
  ],
  devServer: {
    port: 8000,
    static: path.resolve(__dirname, "dist"),
  },
};
