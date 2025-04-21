"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      console.error("Authentication error:", result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("username", { required: "Username is required" })}
        placeholder="Username"
      />
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message?.toString()}</p>
      )}
      <input
        type="password"
        {...register("password", { required: "Password is required" })}
        placeholder="Password"
      />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message?.toString()}</p>
      )}
      <button type="submit">Sign In</button>
    </form>
  );
}
