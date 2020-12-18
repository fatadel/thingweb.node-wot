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
var node_opcua_client_1 = require("node-opcua-client");
/** default implementation offering JSON de-/serialisation */
var OpcuaCodec = /** @class */ (function () {
    function OpcuaCodec() {
    }
    OpcuaCodec.prototype.getMediaType = function () {
        return 'application/x.opcua-binary';
    };
    OpcuaCodec.prototype.bytesToValue = function (bytes, schema, parameters) {
        //console.debug(`JsonCodec parsing '${bytes.toString()}'`);
        var parsed;
        try {
            parsed = JSON.parse(bytes.toString());
            parsed = parsed.value;
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                if (bytes.byteLength == 0) {
                    // empty payload -> void/undefined
                    parsed = undefined;
                }
                else {
                    parsed = bytes.value; //Variant instance then
                }
            }
            else {
                throw err;
            }
        }
        // TODO validate using schema
        // remove legacy wrapping and use RFC 7159
        // TODO remove once dropped from all PlugFest implementation
        if (parsed && parsed.value !== undefined) {
            console.warn("[binding-opcua]", "JsonCodec removing { value: ... } wrapper");
            parsed = parsed.value;
        }
        return parsed;
    };
    OpcuaCodec.prototype.valueToBytes = function (value, schema, parameters) {
        //console.debug("JsonCodec serializing", value);
        var body = "";
        if (value !== undefined) {
            var obj = {};
            obj.payload = value;
            var className = schema.constructor.name;
            var tmp_schema = schema;
            if (className === 'ConsumedThingProperty') {
                var dataType_string = this.dataTypetoString();
                if (!schema || !tmp_schema[dataType_string] || ((tmp_schema.properties) && !(dataType_string in tmp_schema.properties))) {
                    throw new Error("opc:dataType field not specified for property \"" + schema.title + "\"");
                }
                var dataType = tmp_schema[dataType_string] ? tmp_schema[dataType_string] : tmp_schema.properties[dataType_string];
                dataType = this.getOPCUADataType(dataType);
            }
            else if (className === 'ConsumedThingAction') {
                var inputArguments = this.getInputArguments(value, tmp_schema.input);
                obj.inputArguments = inputArguments;
            }
            body = JSON.stringify(obj);
        }
        return Buffer.from(body);
    };
    OpcuaCodec.prototype.dataTypetoString = function () {
        return "opc:dataType";
    };
    OpcuaCodec.prototype.getOPCUADataType = function (string_type) {
        switch (string_type) {
            default:
                console.warn("[binding-opcua]", "dataType \"" + string_type + "\" not found, using \"Double\" as default");
                return node_opcua_client_1.DataType.Double;
            case "Null": return node_opcua_client_1.DataType.Null;
            case "Boolean": return node_opcua_client_1.DataType.Boolean;
            case "Sbyte": return node_opcua_client_1.DataType.SByte;
            case "Byte": return node_opcua_client_1.DataType.Byte;
            case "Int16": return node_opcua_client_1.DataType.Int16;
            case "UInt16": return node_opcua_client_1.DataType.UInt16;
            case "Int32": return node_opcua_client_1.DataType.Int32;
            case "UInt32": return node_opcua_client_1.DataType.UInt32;
            case "Int64": return node_opcua_client_1.DataType.Int64;
            case "UInt64": return node_opcua_client_1.DataType.UInt64;
            case "Float": return node_opcua_client_1.DataType.Float;
            case "Double": return node_opcua_client_1.DataType.Double;
            case "String": return node_opcua_client_1.DataType.String;
            case "DateTime": return node_opcua_client_1.DataType.DateTime;
            case "Guid": return node_opcua_client_1.DataType.Guid;
            case "ByteString": return node_opcua_client_1.DataType.ByteString;
            case "XmlElement": return node_opcua_client_1.DataType.XmlElement;
            case "NodeId": return node_opcua_client_1.DataType.Guid;
            case "ExpandedNodeId": return node_opcua_client_1.DataType.ExpandedNodeId;
            case "StatusCode": return node_opcua_client_1.DataType.StatusCode;
            case "QualifiedName": return node_opcua_client_1.DataType.QualifiedName;
            case "LocalizedText": return node_opcua_client_1.DataType.LocalizedText;
            case "ExtensionObject": return node_opcua_client_1.DataType.ExtensionObject;
            case "DataValue": return node_opcua_client_1.DataType.DataValue;
            case "Variant": return node_opcua_client_1.DataType.Variant;
            case "DiagnosticInfo": return node_opcua_client_1.DataType.DiagnosticInfo;
        }
    };
    OpcuaCodec.prototype.getInputArguments = function (payload, schema) {
        var inputArguments = [];
        var tmp_schema = schema;
        if (!tmp_schema) {
            throw new Error("Mandatory \"input\" field missing in the TD");
        }
        if (tmp_schema.type === 'object' && !tmp_schema.properties) {
            throw new Error("Mandatory  \"properties\" field missing in the \"input\"");
        }
        var properties = tmp_schema.properties;
        var dataType_string = this.dataTypetoString();
        if (properties) { //multiple inputs
            for (var key in payload) {
                var tmp_obj = {};
                if (!(key in properties) || !(dataType_string in properties[key])) {
                    throw new Error("dataType field not specified for parameter \"" + key + "\"");
                }
                var tmp_dataType = properties[key][dataType_string];
                tmp_obj.dataType = this.getOPCUADataType(tmp_dataType);
                tmp_obj.value = payload[key];
                inputArguments.push(tmp_obj);
            }
        }
        else { //single input
            if (!(dataType_string in tmp_schema)) {
                throw new Error("dataType field not specified for input \"" + payload + "\"");
            }
            var tmp_obj = {};
            var tmp_dataType = tmp_schema[dataType_string];
            tmp_obj.dataType = this.getOPCUADataType(tmp_dataType);
            tmp_obj.value = payload;
            inputArguments.push(tmp_obj);
        }
        return inputArguments;
    };
    return OpcuaCodec;
}());
exports["default"] = OpcuaCodec;
