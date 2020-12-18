"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var node_opcua_1 = require("node-opcua");
var OpcuaServer = /** @class */ (function () {
    function OpcuaServer() {
        this.server = new node_opcua_1.OPCUAServer({
            port: 5050,
            resourcePath: "/opcua/server",
            allowAnonymous: true
        });
    }
    OpcuaServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endpointUrl, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.server.initialize()];
                    case 1:
                        _a.sent();
                        this.construct_my_address_space(this.server);
                        return [4 /*yield*/, this.server.start()];
                    case 2:
                        _a.sent();
                        endpointUrl = this.server.endpoints[0].endpointDescriptions()[0].endpointUrl;
                        console.log('OPCUA server started');
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error(err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpcuaServer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.server.shutdown(1000, function () {
                    process.exit(-1); //  add this line to stop the process
                });
                return [2 /*return*/];
            });
        });
    };
    OpcuaServer.prototype.construct_my_address_space = function (server) {
        var addressSpace = server.engine.addressSpace;
        var namespace = addressSpace.getOwnNamespace();
        // OBJECTS
        var device = namespace.addObject({
            nodeId: "ns=1;s=device",
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "WotDevice",
            targetName: {
                namespaceIndex: 1,
                name: "device"
            }
        });
        // VARIABLES
        var variable = 1;
        setInterval(function () { variable += 1; }, 1000);
        namespace.addVariable({
            componentOf: device,
            nodeId: "ns=1;b=9998FFAA",
            browseName: "Increment",
            dataType: "Double",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Double, value: variable });
                }
            }
        });
        namespace.addVariable({
            browseName: "RandomValue",
            nodeId: "ns=1;b=9998FF00",
            dataType: "Double",
            value: {
                get: function () {
                    return new node_opcua_1.Variant({ dataType: node_opcua_1.DataType.Double, value: Math.random() });
                },
                set: function (variant) {
                    variable = parseFloat(variant.value);
                    return node_opcua_1.StatusCodes.Good;
                }
            }
        });
        var method = namespace.addMethod(device, {
            nodeId: "ns=1;s=method",
            browseName: "DivideFunction",
            inputArguments: [
                {
                    name: "a",
                    description: { text: "specifies the first number" },
                    dataType: node_opcua_1.DataType.Double
                }, {
                    name: "b",
                    description: { text: "specifies the second number" },
                    dataType: node_opcua_1.DataType.Double
                }
            ],
            outputArguments: [{
                    name: "division",
                    description: { text: "the generated barks" },
                    dataType: node_opcua_1.DataType.Double,
                    valueRank: 1
                }]
        });
        method.bindMethod(function (inputArguments, context, callback) {
            var a = inputArguments[0].value;
            var b = inputArguments[1].value;
            var res = a / b;
            var callMethodResult = {
                statusCode: node_opcua_1.StatusCodes.Good,
                outputArguments: [{
                        dataType: node_opcua_1.DataType.Double,
                        value: res
                    }]
            };
            callback(null, callMethodResult);
        });
    };
    return OpcuaServer;
}());
exports.OpcuaServer = OpcuaServer;
