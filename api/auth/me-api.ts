import { API_URL } from "@/config/constants";
import { MeResponse } from "@/data/interface/auth";
import { UserResponse } from "@/data/interface/user";

export async function meApi(): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/v1/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get me failed");
  const json: MeResponse = await res.json();
  return json.data!.user;
}
