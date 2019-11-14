const { resolve } = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');
const repoConfig = require('./conf.repo');

const {
  SRC,
  PUBLIC,
  VENDOR_CHUNK_NAME,
  entries,
} = repoConfig;
// https://webpack.js.org/configuration/mode/#usage
// `development` | Sets process.env.NODE_ENV on DefinePlugin to value development . Enables NamedChunksPlugin and NamedModulesPlugin .
// `production` | Sets process.env.NODE_ENV on DefinePlugin to value production . Enables FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin and TerserPlugin .
// `none` | Opts out of any default optimization options
const MODE = process.env.MODE || 'development';
const HASH_LENGTH = 5;
const stats = {
  chunks: false,
  colors: true,
  errors: true,
  errorDetails: true,
  modules: false,
};

const conf = {
  devtool: false, // partially minimizes code in development, maybe look into this later https://webpack.js.org/configuration/devtool/#development
  entry: entries,
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    noEmitOnErrors: true,
    runtimeChunk: {
      name: VENDOR_CHUNK_NAME,
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          chunks: 'initial',
          enforce: true,
          name: VENDOR_CHUNK_NAME,
          test: resolve(__dirname, 'node_modules'),
        },
      },
    },
  },
  output: {
    path: PUBLIC,
    // the URL path where bundle assets will be accessible 
    publicPath: './',
    // assigns the hashed name to the file
    filename: `[name]_[chunkhash:${ HASH_LENGTH }].js`,
    // filename: `[name].js`,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  plugins: [
    new TidyPlugin({
      dryRun: false,
      hashLength: HASH_LENGTH,
    }),
    
    // /**
    //  * Exposes variables for the Client
    //  */
    // new webpack.DefinePlugin({
    // 
    // }),
    
    new HtmlWebpackPlugin({
      title: 'Solar System Builder',
      template: `${ SRC }/index.html`,
    }),
    /**
     * Provides build progress in the CLI
     */
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  stats: stats,
};

module.exports = conf;
