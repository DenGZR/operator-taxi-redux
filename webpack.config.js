var path = require('path')
var webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    devServer: {
        historyApiFallback: true,
        proxy: [{
            path: '/api/*',
            target: 'http://localhost:3001'
        }]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
              test: /\.(png|jpg)$/,
              include: /images/,
              loader: 'url'
            }
        ]
    },

    resolve: {
      modulesDirectories: ['node_modules'],
      extensions:         ['', '.js']
    },

    resolveLoader: {
      modulesDirectories: ['node_modules'],
      moduleTemplates:    ['*-loader', '*'],
      extensions:         ['', '.js']
    },

    plugins:[
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        NODE_ENV : JSON.stringify(NODE_ENV)
      })
      // new webpack.optimize.CommonsChunkPlugin(options)
    ]
}
