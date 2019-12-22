module.exports={
    pages:{
        index:{
            template:'web/index.html',
            entry:'web/index.js',
            filename:'index.html',
            chunks:['chunk-vendors', 'chunk-common', 'index']
        }
    },
    devServer:{
        contentBase:'./',
        compress:true
    }
}
