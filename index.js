"use strict"

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const _ = require('underscore');
const qs = require('querystring');


const musicList = [{
        id: '1',
        name: '演员',
        singer: '薛之谦',
        isHightRate: true
    },
    {
        id: '2',
        name: '丑八怪',
        singer: '薛之谦',
        isHightRate: false
    },
    {
        id: '3',
        name: 'Fade',
        singer: 'Alan Walker',
        isHightRate: true
    },
    {
        id: '4',
        name: '想着你的感觉',
        singer: '容祖儿',
        isHightRate: true
    },
    {
        id: '5',
        name: '叽咕叽咕',
        singer: '徐佳莹',
        isHightRate: false
    }
];


const server = http.createServer(function(req, res) {
    if (req.url == "/") {
        fs.readFile("./public/index.html", "utf8", function(err, data) {
            if (err) {
                console.log(err.message);
                return;
            }
            let complied = _.template(data);
            let htmlStr = complied({
                musicList: musicList
            })
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(htmlStr);

        });
    } else if (req.url.startsWith("/node_modules")) {
        fs.readFile("./" + req.url, function(err, data) {
            if (req.url.endsWith(".css")) {
                res.writeHead(200, { "Content-Type": "text/css" });
            } else if (req.url.endsWith(".js")) {
                res.writeHead(200, { "Content-Type": "application/x-javascript" });
            }
            res.end(data);
        });
    } else if (req.url == "/add") {
        fs.readFile("./public/add.html", "utf8", function(err, data) {
            if (err) {
                console.log(err.message);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (req.url == "/doAdd") {

        getPostData(req, function(data) {
            let dataObj = qs.parse(data);
            let id = dataObj.id;
            let name = dataObj.name;
            let singer = dataObj.singer;
            let isHightRate = dataObj.isHightRate;

            if (id != '' && name != '' && singer != '' && isHightRate != '') {

                let musicInfo = musicList.find(item => item.id == id);
                if (musicInfo) {
                    res.writeHead(200, { "Content-Type": "text/plain; charset=utf8" });
                    res.write("音乐编号已经存在");
                    return res.end();
                }
                musicList.push({
                    id,
                    name,
                    singer,
                    isHightRate
                })
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf8" });
                res.end("信息提交成功");

            } else {
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf8" });
                res.end("信息填写完整");
            }

        });

    }


});


server.listen(4000, '127.0.0.1', function() {
    console.log('listening 4000');
})


function getPostData(req, callback) {
    let data = '';
    req.on("data", function(chunk) {
        data += chunk;
    });
    req.on("end", function() {
        callback(data);
    });
}