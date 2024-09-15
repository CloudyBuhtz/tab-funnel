export const convertBytes = (bytes: number) => {
  if (bytes == 0) {
    return "0 Byte";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
};

export const hashString = async (s: string): Promise<string> => {
  const hashAsArrayBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s));
  const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
  return Array.from(uint8ViewOfHash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
