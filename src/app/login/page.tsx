"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Login, LoginFailResponse } from "@/hooks/useAuth";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.length > 0,
    [username, password],
  );

  async function handleLogin(e: any) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const res = await Login({ username, password });
      Cookies.set("access_token", res.token, { expires: res.expired });
      router.push("/products");
    } catch (err: any) {
      const data = err?.response?.data as LoginFailResponse | undefined;

      if (data?.success === false) {
        setIsError(true);
        setErrorMessage(data.error.message);
        return;
      }

      setIsError(true);
      setErrorMessage("登入失敗，請稍後再試。");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left visual */}
        <div className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-black/0 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(178,34,34,0.22),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(212,175,55,0.18),_transparent_55%)]" />

          <div className="relative h-full p-16 flex flex-col justify-center items-center">
            <div className="space-y-3 text-center">
              <img
                src="/icons/file.svg"
                alt="御守之緣"
                className="mx-auto mb-6 h-14 w-14 opacity-90 bg-transparent"
              />
              <div className="text-3xl font-bold tracking-widest text-[var(--torii-red)] font-serif">
                拾守
              </div>
              <p className="text-sm text-black/55 tracking-[0.35em] uppercase font-light">
                Omamori Connect
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="relative flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden space-y-2 text-center">
              <div className="text-3xl font-bold tracking-widest text-[var(--torii-red)] font-serif">
                拾守
              </div>
              <p className="text-xs text-black/50 tracking-[0.35em] uppercase font-light">
                Omamori Connect
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-black/5 p-7 sm:p-9">
              <div className="space-y-2 mb-7">
                <h2 className="text-2xl font-bold font-serif ">登入</h2>
                <p className="text-sm text-gray-500">請使用管理者帳號密碼登入。</p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--sumi-black)]/80">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="email"
                      autoComplete="email"
                      placeholder="admin@example.com"
                      className="w-full h-11 rounded-xl border border-black/10 bg-white pl-10 pr-3 text-sm outline-none focus:border-[var(--torii-red)] focus:ring-2 focus:ring-[var(--torii-red)]/15"
                      required
                    />
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-[var(--sumi-black)]/80">密碼</span>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="請輸入密碼"
                      className="w-full h-11 rounded-xl border border-black/10 bg-white pl-10 pr-10 text-sm outline-none focus:border-[var(--torii-red)] focus:ring-2 focus:ring-[var(--torii-red)]/15"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5 transition"
                      aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </label>
                {isError && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-black/20 accent-[var(--torii-red)]"
                    />
                    記住我
                  </label>

                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-[var(--torii-red)] transition"
                    onClick={() => alert("之後可接忘記密碼流程")}
                  >
                    忘記密碼？
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-11 rounded-xl bg-[var(--torii-red)] text-white cursor-pointer hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  登入
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-black/5 flex items-center justify-end text-sm">
                <Link
                  href="/homePage"
                  className="text-[var(--torii-red)] hover:underline underline-offset-4"
                >
                  回到首頁
                </Link>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-gray-500">
              僅供作品面試用途。請勿與他人分享登入資訊。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
