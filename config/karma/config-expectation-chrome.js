module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        browsers: ['ChromeHeadlessWithNoRequiredUserGesture'],

        concurrency: 1,

        customLaunchers: {
            ChromeHeadlessWithNoRequiredUserGesture: {
                base: 'ChromeHeadless',
                flags: ['--autoplay-policy=no-user-gesture-required']
            }
        },

        files: ['test/expectation/chrome/current/**/*.js'],

        frameworks: ['mocha', 'sinon-chai'],

        preprocessors: {
            'test/expectation/chrome/current/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });
};
