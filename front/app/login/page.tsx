"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  getSession,
  signInAtproto,
  useSession,
  type AtprotoUser,
} from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await signInAtproto({
        identifier: data.identifier,
        password: data.password,
      });
      return response;
    },
    onSuccess: async (response) => {
      setErrorMsg(null);
      reset();
      await getSession();
      const user = response.data?.user as AtprotoUser | undefined;
      if (user?.did) {
        console.log("Session ATProto persistée — did:", user.did);
      }
      router.replace("/");
    },
    onError: (error) => {
      setErrorMsg("Échec de connexion : " + error.message);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    setErrorMsg(null);
    loginMutation.mutate(data);
  };

  const user = session?.user as AtprotoUser | undefined;
  const isLoggedIn = !!user?.did;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow max-w-xs w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        <div>
          <label className="block mb-1 font-medium">Handle or Email</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            autoComplete="username"
            disabled={loginMutation.isPending}
            {...register("identifier", { required: "Identifier is required" })}
          />
          {errors.identifier && (
            <div className="text-red-600 text-sm">
              {errors.identifier.message}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            autoComplete="current-password"
            disabled={loginMutation.isPending}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <div className="text-red-600 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>
        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        {isLoggedIn && (
          <p className="text-sm text-gray-600 text-center">
            Session active ({user.handle ?? user.did}). Reconnectez-vous pour
            rafraîchir les tokens Bluesky.
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
