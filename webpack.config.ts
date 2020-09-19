import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map', // for development
  entry: './src/index.ts',

  module: {
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
              },
            },
          },
        ],
      },
      {
        test: /\(?<!\.module\)\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new CopyWebpackPlugin({ patterns: [{ from: 'src/assets/', to: 'assets/' }] }),
    new CleanWebpackPlugin(),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};

export default config;
