"use strict";
exports.__esModule = true;
var opcua_client_1 = require("../src/opcua-client");
var client = new opcua_client_1["default"]();
// let inputVector = {
//     op: ["readProperty"],
//     form: {
//         href: "opc.tcp://localhost:5050/ns=1;b=9998FFAA",
//         "opc:method": "READ"
//     }
// };
// client.readResource(inputVector.form).then(res => {
//     let val = JSON.parse((Buffer.from(res.body)).toString()).value.value;
//     console.log(val);
//     return;
//     //console.log(val, val === 1);
// });
var inputVector2 = {
    op: ["writeProperty"],
    form: {
        href: "opc.tcp://localhost:5050/ns=1;b=9998FFAA",
        "opc:method": "WRITE"
    },
    payload: JSON.stringify(2)
};
var schema = {
    "opc:dataType": "Double"
};
client.writeResource(inputVector2.form, { type: 'application/x.opcua-binary', body: Buffer.from(inputVector2.payload) }).then(function (res) {
    console.log(res);
    return;
});
