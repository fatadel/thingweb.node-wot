"use strict";
/********************************************************************************
 * Copyright (c) 2018 - 2019 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 *
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/
exports.__esModule = true;
var core_1 = require("@node-wot/core");
var opcua_client_1 = require("./opcua-client");
var opcua_codec_1 = require("./codecs/opcua-codec");
var OpcuaClientFactory = /** @class */ (function () {
    function OpcuaClientFactory(config) {
        if (config === void 0) { config = null; }
        this.scheme = "opc.tcp";
        this.config = null;
        this.contentSerdes = core_1.ContentSerdes.get();
        this.init = function () { return true; };
        this.destroy = function () { return true; };
        this.config = config;
        this.contentSerdes.addCodec(new opcua_codec_1["default"]());
    }
    OpcuaClientFactory.prototype.getClient = function () {
        console.debug("[binding-opcua]", "OpcuaClientFactory creating client for '" + this.scheme + "'");
        return new opcua_client_1["default"](this.config);
    };
    return OpcuaClientFactory;
}());
exports["default"] = OpcuaClientFactory;
