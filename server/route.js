var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');


var http = require('http');


/**
 * 用来测试超时的API
 */
app.get('/timeout', function(req, res){

    setTimeout(function(){
        res.send('timeout' );
    },10000);

});

/**
 *mock数据代理
 */
function mock(req,res,next){
    console.log(req.url,req.method,'=========');
    fs.readFile(path.join(process.cwd() + '/mock/data') + req.url.split('?')[0], function(err,data){
        if(err != null){
            res.send(err.toString())
        }else{
            res.send(data.toString())
        }
    });
};

function appServer(){
    app.all('**/*.json',mock);

    return app
}

module.exports = appServer
