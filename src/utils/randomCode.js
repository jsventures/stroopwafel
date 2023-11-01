const chars = "ABCDEFGHJKMNPQRSTUVWXYZ3456789";

export default function generateRandomCode(length = 4) {
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}
