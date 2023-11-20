const {MakeRemoteDir, Shell, UploadDir, control} = require('./ssh')


const server = {host: "101.42.27.127", username: "root", password: "Wch961213!"};
//替换局部文档的文件
const studyModule = 'webpack5'

const {todoDir} = MakeRemoteDir(server, 'source', '/www/wwwroot/MyWeb/source/')
console.log('正在检查文件夹是否缺失，如果缺失进行创建...')
control.emit("donext", todoDir, function (err) {
    console.log('检查完毕')
    if (err) {
        throw err;
    } else {
        const localDirs = [`source/_posts/${studyModule}`, `source/image/${studyModule}`]
        localDirs.forEach((localDir, index) => {
            const dirName = index > 0 ? "图片" : "markdown"
            const remoteDir = `/www/wwwroot/MyWeb/${localDir}/`
            Shell(server, `rm -rf ${remoteDir}*\r\nexit\r\n`, e => {
                console.log(`已清空${dirName}文件夹内容，开始上传`)
                UploadDir(server, localDir, remoteDir, e => {
                    console.log(`${dirName}文件上传成功`)
                })
            })
        })
    }
});

//替换全部文件
/*const localDir = 'source';
const remoteDir = '/www/wwwroot/MyWeb/source/'
Shell(server, `rm -rf ${remoteDir}*\r\nexit\r\n`, e => {
    console.log('已清空原文件夹内容，开始上传文件')
    UploadDir(server, localDir, remoteDir, e => {
        console.log('所有文件上传成功')
    })
})*/
