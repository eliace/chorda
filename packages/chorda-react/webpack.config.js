const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        library: 'ChordaReact',
        libraryTarget: 'umd',
        filename: 'chorda-react.js'    
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }
        }]
    },
    plugins: [],
    resolve: {
        alias: {
            '@chorda/core': path.resolve('../chorda-core/src')
        }    
    },
    externals: {
        '@chorda/core': 'Chorda',
        'react': 'React',
        'create-react-class': 'createReactClass',
        'react-dom': 'ReactDOM'
    }
}