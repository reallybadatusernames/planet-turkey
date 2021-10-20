const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const webpack = require('webpack');
const exportsLoader = require('exports-loader');
const importsLoader = require('imports-loader');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    entry: {
        site: './src/styles/_scene.scss',
        game: './src/scripts/game.js',
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            importLoaders: 1
                        }
                    },
                    'sass-loader' // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, './src/'),
                options: {
                    presets: [['@babel/preset-env', { targets: "defaults" }],]
                }
            },
            {
                test: /\.css$/i,
                use: ['vue-style-loader', 'style-loader', 'css-loader'],
            },
            {
                test: /skin\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /content\.css$/i,
                use: ['css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
                exclude: [
                    path.join(__dirname, './src/styles/')
                ]
            },
            {
                test: [
                    path.join(__dirname, './src/styles/_scene.scss'),
                ],
                use: [
                    { loader: MiniCssExtractPlugin.loader, },

                    'css-loader',
                    { loader: 'resolve-url-loader' },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },

                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][ext]' }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: { filename: 'img/[name][ext]' }
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: './css/[name].css' }),
    ],
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js',
        //clean: true,
    }
};