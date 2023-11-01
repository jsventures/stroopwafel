import { stringModulus } from "@/utils/string";

const colors = [
  "bg-red-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-lime-400",
  "bg-teal-400",
  "bg-purple-400",
];

export function avatarColor(handle) {
  const idx = stringModulus(handle, colors.length);
  return colors[idx];
}
