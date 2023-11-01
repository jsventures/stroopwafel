/* Module containing game logic shared across app */

import { transact, tx } from "@instantdb/react-native";
import { now } from "./utils/time";

export const GAME_IN_PROGRESS = "GAME_IN_PROGRESS";
export const GAME_COMPLETED = "GAME_COMPLETED";
export const MULTIPLAYER_SCORE_TO_WIN = 13;

export const colorStyleMap = {
  "text-red-400": { color: "rgb(248 113 113)" },
  "text-green-400": { color: "rgb(74 222 128)" },
  "text-blue-400": { color: "rgb(96 165 250)" },
  "text-yellow-400": { color: "rgb(250 204 21)" },
};

export function chooseRandomColor() {
  const colors = ["red", "green", "blue", "yellow"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function generateGameColors(length = MULTIPLAYER_SCORE_TO_WIN + 1) {
  return Array.from({ length }).map((_) => ({
    color: chooseRandomColor(),
    label: chooseRandomColor(),
  }));
}

export function leaveRoomTx(userId, room) {
  const { id: roomId, hostId } = room;
  const leaveRoom = tx.rooms[roomId].unlink({ users: userId });
  const deleteRoom = tx.rooms[roomId].update({
    code: null,
    deleted_at: now(),
  });
  const action = hostId === userId ? deleteRoom : leaveRoom;
  transact(action);
}
