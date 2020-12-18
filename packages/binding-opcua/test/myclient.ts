import OpcuaClient from "../src/opcua-client";

let client: OpcuaClient = new OpcuaClient();

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


let inputVector2 = {
    op: ["writeProperty"],
    form: {
        href: "opc.tcp://localhost:5050/ns=1;b=9998FFAA",
        "opc:method": "WRITE"
    },
    payload: JSON.stringify(2)
};
let schema = {
    "opc:dataType": "Double"
}
client.writeResource(inputVector2.form, { type: 'application/x.opcua-binary', body: Buffer.from(inputVector2.payload) }).then(res => {
    console.log(res);
    return;
});
