"use strict"
const util = require("util");
const events = require("events");
const Client = require("ssh2").Client;
const fs = require("fs");
const path = require('path');


/**
 * 描述：连接远程电脑
 * 参数：server 远程电脑凭证；then 回调函数
 * 回调：then(conn) 连接远程的client对象
 */
function Connect(server, then) {
    const conn = new Client();
    conn.on("ready", function () {
        then(conn);
    }).on('error', function (err) {
        //console.log("connect error!");
    }).on('end', function () {
        //console.log("connect end!");
    }).on('close', function (had_error) {
        //console.log("connect close");
    }).connect(server);
}

/**
 * 描述：运行shell命令
 * 参数：server 远程电脑凭证；cmd 执行的命令；then 回调函数
 * 回调：then(err, data) ： data 运行命令之后的返回数据信息
 */
function Shell(server, cmd, then) {
    Connect(server, function (conn) {
        conn.shell(function (err, stream) {
            if (err) {
                then(err);
            } else {// end of if
                let buf = "";
                stream.on('close', function () {
                    conn.end();
                    then(err, buf);
                }).on('data', function (data) {
                    buf = buf + data;
                }).stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });
                stream.end(cmd);
            }
        });
    });
}

/**
 * 描述：上传文件
 * 参数：server 远程电脑凭证；localPath 本地路径；remotePath 远程路径；then 回调函数
 * 回调：then(err, result)
 */
function UploadFile(server, localPath, remotePath, then) {
    Connect(server, function (conn) {
        conn.sftp(function (err, sftp) {
            if (err) {
                then(err);
            } else {
                sftp.fastPut(localPath, remotePath, function (err, result) {
                    conn.end();
                    then(err, result);
                });
            }
        });
    });
}

/**
 * 描述：下载文件
 * 参数：server 远程电脑凭证；remotePath 远程路径；localPath 本地路径；then 回调函数
 * 回调：then(err, result)
 */
function DownloadFile(server, remotePath, localPath, then) {
    Connect(server, function (conn) {
        conn.sftp(function (err, sftp) {
            if (err) {
                then(err);
            } else {
                sftp.fastGet(remotePath, localPath, function (err, result) {
                    if (err) {
                        then(err);
                    } else {
                        conn.end();
                        then(err, result);
                    }
                });
            }
        });
    });
}

/**
 * 描述：获取远程文件路径下文件列表信息
 * 参数：server 远程电脑凭证；
 *        remotePath 远程路径；
 *        isFile 是否是获取文件，true获取文件信息，false获取目录信息；
 *        then 回调函数
 * 回调：then(err, dirs) ： dir, 获取的列表信息
 */
function GetFileOrDirList(server, remotePath, isFile, then) {
    const cmd = "find " + remotePath + " -type " + (isFile == true ? "f" : "d") + "\r\nexit\r\n";
    Shell(server, cmd, function (err, data) {
        var arr = [];
        var remoteFile = [];
        arr = data.split("\r\n");
        arr.forEach(function (dir) {
            if (dir.indexOf(remotePath) == 0) {
                remoteFile.push(dir);
            }
        });
        then(err, remoteFile);
    });
}

/**
 * 描述：控制上传或者下载一个一个的执行
 */
function Control() {
    events.EventEmitter.call(this);
}

util.inherits(Control, events.EventEmitter); // 使这个类继承EventEmitter
const control = new Control();

control.on("donext", function (todos, then) {
    if (todos.length > 0) {
        var func = todos.shift();
        func(function (err, result) {
            if (err) {
                throw err;
                then(err);
            } else {
                control.emit("donext", todos, then);
            }
        });
    } else {
        then(null);
    }
});


/**
 * 描述：下载目录到本地
 * 参数：server 远程电脑凭证；
 *        remotePath 远程路径；
 *        localDir 本地路径，
 *        then 回调函数
 * 回调：then(err)
 */
function DownloadDir(server, remoteDir, localDir, then) {
    GetFileOrDirList(server, remoteDir, false, function (err, dirs) {
        if (err) {
            throw err;
        } else {
            GetFileOrDirList(server, remoteDir, true, function (err, files) {
                if (err) {
                    throw err;
                } else {
                    dirs.shift();
                    dirs.forEach(function (dir) {
                        const tmpDir = path.join(localDir, dir.slice(remoteDir.length + 1)).replace(/[//]\g/, '\\');
                        // 创建目录
                        fs.mkdirSync(tmpDir);
                    });
                    const todoFiles = [];
                    files.forEach(function (file) {
                        const tmpPath = path.join(localDir, file.slice(remoteDir.length + 1)).replace(/[//]\g/, '\\');
                        todoFiles.push(function (done) {
                            DownloadFile(server, file, tmpPath, done);
                            console.log("downloading the " + file);
                        });// end of todoFiles.push
                    });
                    control.emit("donext", todoFiles, then);
                }
            });
        }
    });
}

/**
 * 描述：获取windows上的文件目录以及文件列表信息
 * 参数：destDir 本地路径，
 *        dirs 目录列表
 *        files 文件列表
 */
function GetFileAndDirList(localDir, dirs, files) {
    const dir = fs.readdirSync(localDir);
    for (let i = 0; i < dir.length; i++) {
        const p = path.join(localDir, dir[i]);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            dirs.push(p);
            GetFileAndDirList(p, dirs, files);
        } else {
            files.push(p);
        }
    }
}

function MakeRemoteDir(server, localDir, remoteDir) {
    const dirs = [];
    const files = [];
    GetFileAndDirList(localDir, dirs, files);
    // 创建远程目录
    const todoDir = [];
    dirs.forEach(function (dir) {
        todoDir.push(function (done) {
            const to = path.join(remoteDir, dir.slice(localDir.length + 1)).replace(/[\\]/g, '/');
            const cmd = "mkdir -p " + to + "\r\nexit\r\n";
            Shell(server, cmd, done);
        })// end of push
    });
    return {todoDir, files}
}

/**
 * 描述：上传文件夹到远程目录
 * 参数：server 远程电脑凭证；
 *        localDir 本地路径，
 *        remotePath 远程路径；
 *        then 回调函数
 * 回调：then(err)
 */
function UploadDir(server, localDir, remoteDir, then) {
    const {todoDir, files} = MakeRemoteDir(server, localDir, remoteDir)
    // 上传文件
    const todoFile = [];
    files.forEach(function (file) {
        todoFile.push(function (done) {
            const to = path.join(remoteDir, file.slice(localDir.length + 1)).replace(/[\\]/g, '/');
            console.log("upload " + to);
            UploadFile(server, file, to, done);
        });
    });
    control.emit("donext", todoDir, function (err) {
        if (err) {
            throw err;
        } else {
            control.emit("donext", todoFile, then);
        }
    });
}
exports.Shell = Shell;
exports.UploadFile = UploadFile;
exports.DownloadFile = DownloadFile;
exports.GetFileOrDirList = GetFileOrDirList;
exports.DownloadDir = DownloadDir;
exports.UploadDir = UploadDir;
exports.MakeRemoteDir = MakeRemoteDir;
exports.control = control;
