import { io } from "socket.io-client";

export const socket = io("http://192.168.1.3:3000");

export function emitEvent(event, attr, value) {
  socket.emit(event, {
    room: localStorage.getItem("room"),
    [attr]: value,
  });
}
