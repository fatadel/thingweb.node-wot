import { OpcuaServer } from './opcua-server';

let server: OpcuaServer;
try {
	server = new OpcuaServer();
} catch(err) {
	console.log(err);
	throw new Error(err);
}

try {
	server.start();
} catch (err) {
	throw new Error(err);
}