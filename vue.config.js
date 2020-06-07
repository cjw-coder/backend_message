const path = require('path');
function resolve(dir){
    return path.join(__dirname,dir)
}
module.exports={
    chainWebpack:(config)=>{
        config.resolve.alias
        .set('components',resolve('src/components'))
        .set('views',resolve('src/views'))
        .set('assets',resolve('src/assets'))
        .set('network',resolve('src/network'))
        .set('common',resolve('src/common'))
        .set('plugins',resolve('src/plugins'))

        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals',{
                vue:"Vue",
                'vue-router':'VueRouter',
                axios:"axios",
                lodash:"_",
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}