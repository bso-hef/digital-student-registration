import { EventEmitter } from "events";

class SocketServerEmitter extends EventEmitter {}

const userEvents = new SocketServerEmitter();

export { userEvents };
