module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            enableRemoteModule: true,
            builderOptions: {
                extraFiles: [
                    {
                        "from": "fabfile.py",
                        "to": "fabfile.py",
                    },
                    {
                        "from": "fabric.yaml",
                        "to": "fabric.yaml",
                    }
                ]
            }
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