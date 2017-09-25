/**
 * Created by wwj on 2017/5/11.
 */


var fs = require('fs');
var path = require("path")

var excluded = ['lib','test','/src/sub']

const newLine = '\r\n '

function FileWrite(path,data) {
    fs.open(path, 'w', function(err,fd){
        if(err){
            throw err;
        }
        var fileInfoArray = []
        /**IMPORT*/
        data.forEach(function (comp) {
            fileInfoArray.push('import ' +comp.name+' from '+ "\'" + '../components'+ comp.path + "\'")
        })

        /**export default*/
        fileInfoArray.push('export default [')
        data.forEach(function (comp) {
            fileInfoArray.push('{ path: \''+comp.path+'\'' +', name: \''+comp.name+'\', component:'+comp.name+ '},')
        });
        fileInfoArray.push(']')

        var result = fileInfoArray.join(newLine)
        fs.writeSync(fd, result, 0, 'UTF-8');
        fs.close(fd,function(err){
            if(err){
                throw err;
            }
            console.log('写入完毕');
        })
    })
}

module.exports = function(source) {

    var components = []

    var componentDirLength = getComponentDir().length

    function getComponentDir() {
        return path.resolve(__dirname, '../../components')
    }

    function getRoterDir() {
        return path.resolve(__dirname, '../../router')
    }

    function getRotePath(dirPath) {
        return dirPath.substring(componentDirLength , dirPath.indexOf('/src/',componentDirLength))
    }

    function pushCompInfo(dir) {
        var isExcluded = false
        excluded.forEach(function (exclude) {
            if(dir.indexOf(exclude,componentDirLength) > 0){
                console.log("排除扫描文件夹:"+dir)
                isExcluded = true
                return
            }
        })
        if(isExcluded){
            return
        }
        var files = fs.readdirSync(dir)
        files.forEach(function (file) {
            var tempDir = dir+'\/'+file;
            var stat = fs.lstatSync(tempDir);
            if(stat.isDirectory()){
                pushCompInfo(tempDir)
            }else{
                if(file.indexOf('.vue') > 0){
                    components.push({
                        name:file.split('.')[0],
                        path:getRotePath(tempDir)
                    })
                }
            }
        })
    }

    function listAllVue() {
        var compPath = getComponentDir()
        pushCompInfo(compPath)
    }

    function apply() {
        console.log("自定义组件插件开始读取组件目录信息")
        listAllVue()
        console.log("将需要路由的组件信息写入文件："+getRoterDir()+'/componentsRoute.js')
        FileWrite(getRoterDir()+'/componentsRoute.js',components)
    }

    return {
        apply: apply
    };
}
