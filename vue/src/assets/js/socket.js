import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

export function socketEmit(event, attr, value) {
  socket.emit(event, {
    room: localStorage.getItem("room"),
    [attr]: value,
  });
}
