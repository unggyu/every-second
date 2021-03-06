const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals');
const pluginConfig = require('../pluginrc.js')
const distFolder = path.join(pluginConfig.destinationFolder, pluginConfig.extensionBundleId)
const srcFolder = pluginConfig.sourceFolder
const SESSION_DIST_PATH = path.join(distFolder, 'session')
const SESSION_SRC_PATH = path.join(srcFolder, 'session')
const ENTRY_POINT_SESSION_PATH = path.join(SESSION_SRC_PATH, 'src/index.ts')

module.exports = (env) => ({
    entry: ENTRY_POINT_SESSION_PATH,
    target: 'node',
    externals: [nodeExternals({modulesDir: path.join(SESSION_SRC_PATH, 'node_modules')})],
    module: {
        rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                plugins: ['@babel/plugin-transform-runtime']
            }
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: SESSION_DIST_PATH,
        publicPath: '',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    plugins: [
        // new CopyWebpackPlugin([
        //   { from: path.join(SESSION_SRC_PATH, 'node_modules'), to: '../node_modules' }
        // ])
    ],
    stats: {
        preset: 'normal',
        chunks: true
    }
});
