"use strict";
exports.__esModule = true;
var opcua_server_1 = require("./opcua-server");
var server;
try {
    server = new opcua_server_1.OpcuaServer();
}
catch (err) {
    console.log(err);
    throw new Error(err);
}
try {
    server.start();
}
catch (err) {
    throw new Error(err);
}
