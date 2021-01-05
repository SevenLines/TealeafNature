module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    },
    // configureWebpack: {
    //     output: {
    //         libraryTarget: 'commonjs'
    //     },
    //     externals: [
    //         {pg: {commonjs: 'pg'}}
    //     ],
    // }
    //     // externals: [
    //     //     {pg: {commonjs: 'pg'}},
    //     // ],
    //     //  node: {
    //     //     __filename: false,
    //     //     __dirname: false,
    //     //   }
    //     // resolve: {
    //     //     alias: {
    //     //         'pg-native': 'noop2',
    //     //         'sequelize': 'noop2',
    //     //     },
    //     // },
    // },

};