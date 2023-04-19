const {Shell, UploadDir} = require('./ssh')

//服务器信息
const server = {host: "10.168.151.45", username: "root", password: "root"};
//本地地址
const localDir = 'source';
//远程地址
const remoteDir = '/www/wwwroot/MyWeb/source/'
//编写清空文件夹的shell命令
Shell(server, `rm -rf ${remoteDir}*\r\nexit\r\n`, e => {
    console.log('已清空原文件夹内容，开始上传文件')
    UploadDir(server, localDir, remoteDir, e => {
        console.log('所有文件上传成功')
    })
})
