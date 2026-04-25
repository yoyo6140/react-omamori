import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const AUTH_EXPIRED_EVENT = "auth:expired";

function notifyAuthExpired(message?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_EXPIRED_EVENT, {
      detail: { message: message ?? "登入已過期，請重新登入。" },
    }),
  );
}

function isAuthExpiredError(err: unknown): { message?: string } | null {
  if (!axios.isAxiosError(err)) return null;
  const axErr = err as AxiosError<any>;
  const status = axErr.response?.status;
  if (status === 401) {
    const msg =
      axErr.response?.data?.message ??
      axErr.response?.data?.error?.message ??
      axErr.message ??
      undefined;
    return { message: typeof msg === "string" ? msg : undefined };
  }
  return null;
}

//  後台專用 - 每次後台操作時 會驗證
//  統一攔截 401，發出事件給 UI 顯示並導回登入
export const adminApi = axios.create();

adminApi.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    // API: Authorization 直接放 token 字串
    (config.headers as any).Authorization = token;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    const expired = isAuthExpiredError(err);
    if (expired) {
      notifyAuthExpired(expired.message);
    }
    return Promise.reject(err);
  },
);
