import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  devtool: 'cheap-module-eval-source-map', // for production
  entry: './src/index.ts',

  module: {
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name][hash].[ext]',
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
    filename: '[name][hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default config;
