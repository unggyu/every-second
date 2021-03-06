const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pluginConfig = require('../pluginrc.js');
// const distFolder = pluginConfig.destinationFolder
const distFolder = path.join(pluginConfig.destinationFolder, pluginConfig.extensionBundleId);
const srcFolder = pluginConfig.sourceFolder;
const CLIENT_DIST_PATH = path.resolve(distFolder, 'client');
const HTML_TEMPLATE_PATH = path.join(srcFolder, 'client/index.server.template.html');
const ENTRY_POINT_CLIENT_PATH = path.join(srcFolder, 'client/src/index.tsx');

module.exports = ({
    entry: ENTRY_POINT_CLIENT_PATH,
    target: 'web',
    module: {
        rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                plugins: ['@babel/plugin-transform-runtime']
            }
        },
        {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            loader: 'file-loader',
            options: {
                name: 'fonts/[name].[ext]'
            }
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: CLIENT_DIST_PATH,
        publicPath: '',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: CLIENT_DIST_PATH
    },
    plugins: [
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional https://github.com/webpack-contrib/mini-css-extract-plugin
          filename: '[name].css',
          chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            template: HTML_TEMPLATE_PATH,
            filename: 'index.html',
            inject: 'body',
            title: 'HTML Webpack Plugin',
            bar: 'bar'
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        })
    ],
    stats: {
        preset: 'minimal',
        chunks: true
    }
});
