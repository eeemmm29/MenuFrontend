"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

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
    <div className="flex items-center justify-center h-[50vh]">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Sign Up</h1>
        {Object.keys(errors).map((key) => (
          <p key={key} style={{ color: "red" }}>
            {errors[key]?.message?.toString()}
          </p>
        ))}
        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Username"
          labelPlacement="outside"
          placeholder="Enter your username"
          type="text"
          {...register("username", { required: "Username is required" })}
        />
        <Input
          isRequired
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password1", { required: "Password is required" })}
        />
        <Input
          isRequired
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password2", {
            required: "Confirm Password is required",
          })}
        />
        <Button type="submit" variant="bordered">
          Sign up
        </Button>
      </Form>
    </div>
  );
}
