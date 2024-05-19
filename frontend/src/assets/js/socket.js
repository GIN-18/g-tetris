import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");
// export const socket = io("http://192.168.1.5:3000");

export function socketEmit(event, attr, value) {
  socket.emit(event, {
    room: sessionStorage.getItem("room"),
    [attr]: value,
  });
}
