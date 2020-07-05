module.exports = function (api) {
    api.cache(true);

    const presets = [
        ['@babel/env', {
            modules: true,
            targets: {
                browsers: ['last 2 Chrome versions'],
                node: 'current'
            }
        }]
    ];

    const plugins = [
        ['@babel/plugin-proposal-decorators', {legacy: true}],
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-transform-typescript',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        ['@babel/plugin-proposal-class-properties', {loose: false}],
        '@babel/plugin-proposal-json-strings',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator'
    ];

    const env = {
        test: {
            presets: ['@babel/env'],
            plugins: ['dynamic-import-node']
        }
    };

    return {presets, plugins, env};
};
