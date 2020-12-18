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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var opcua_client_1 = require("./opcua-client");
exports.OpcuaClient = opcua_client_1["default"];
var opcua_client_factory_1 = require("./opcua-client-factory");
exports.OpcuaClientFactory = opcua_client_factory_1["default"];
var td_tools_1 = require("@node-wot/td-tools");
__export(require("./opcua"));
__export(require("./opcua-client-factory"));
var OpcuaForm = /** @class */ (function (_super) {
    __extends(OpcuaForm, _super);
    function OpcuaForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OpcuaForm;
}(td_tools_1.Form));
exports.OpcuaForm = OpcuaForm;
