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
                    },
                    {
                        "from": "icon.png",
                        "to": "icon.png",
                    },
                    {
                        "from": "src/sequelize/config.json",
                        "to": "config.json",
                    }
                ]
            },
            directories: {
                buildResources: "resources"
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