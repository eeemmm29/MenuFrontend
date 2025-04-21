"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`,
        data
      );

      // Automatically sign in the user after successful registration
      await signIn("credentials", {
        username: data.username,
        password: data.password1,
        callbackUrl: "/",
      });
    } catch (err: any) {
      console.error(err.response?.data || {});
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign Up</h1>
      {Object.keys(errors).map((key) => (
        <p key={key} style={{ color: "red" }}>
          {errors[key]?.message?.toString()}
        </p>
      ))}
      <label>
        Username:
        <input
          type="text"
          {...register("username", { required: "Username is required" })}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          {...register("password1", { required: "Password is required" })}
        />
      </label>
      <br />
      <label>
        Confirm Password:
        <input
          type="password"
          {...register("password2", {
            required: "Confirm Password is required",
          })}
        />
      </label>
      <br />
      <button type="submit">Register</button>
    </form>
  );
}
