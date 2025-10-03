export function extractOtp(token: string, preLen = 16, postLen = 10): string {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token: must be a non-empty string");
  }
  if (token.length <= preLen + postLen) {
    throw new Error("Invalid token format: too short");
  }
  const mid = token.substring(preLen, token.length - postLen);
  let decoded = "";
  if (typeof window !== "undefined" && typeof atob === "function") {
    decoded = atob(mid);
  } else {
    decoded = Buffer.from(mid, "base64").toString("utf8");
  }
  if (!/^\d{6}$/.test(decoded)) {
    throw new Error("Invalid OTP extracted");
  }
  return decoded;
}


