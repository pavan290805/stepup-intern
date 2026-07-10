const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = new Headers(options.headers || {});

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  console.log("API_URL =", API_URL);
console.log("Final URL =", `${API_URL}${normalizedEndpoint}`);
  const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`) as Error & {
      status?: number;
      data?: unknown;
    };

    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}