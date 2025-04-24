import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SignUpForm {
  username: string;
  password1: string;
  password2: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpForm>();
  const [authError, setAuthError] = useState<string>();

  const onSubmit = async (data: SignUpForm) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`,
        data
      );

      setAuthError(undefined); // Clear error on success

      // Automatically sign in the user after successful registration
      await signIn("credentials", {
        username: data.username,
        password: data.password1,
        callbackUrl: "/",
      });
    } catch (err: any) {
      console.error(err.response?.data || {});
      setAuthError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Sign Up</h1>
        {/* Display form validation errors */}
        {(Object.keys(errors) as (keyof SignUpForm)[]).map((key) => (
          <p key={key} style={{ color: "red" }}>
            {errors[key]?.message?.toString()}
          </p>
        ))}

        <Input
          isRequired
          errorMessage={
            errors.username?.message?.toString() ||
            "Please enter a valid username"
          }
          label="Username"
          labelPlacement="outside"
          placeholder="Enter your username"
          type="text"
          {...register("username", { required: "Username is required" })}
        />
        <Input
          isRequired
          errorMessage={
            errors.password1?.message?.toString() ||
            "Please enter a valid password"
          }
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password1", { required: "Password is required" })}
        />
        <Input
          isRequired
          errorMessage={
            errors.password2?.message?.toString() ||
            "Please confirm your password"
          }
          label="Confirm Password"
          labelPlacement="outside"
          placeholder="Confirm your password"
          type="password"
          {...register("password2", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues("password1") || "Passwords do not match",
          })}
        />
        {authError && <p style={{ color: "red" }}>{authError}</p>}
        <Button type="submit" variant="bordered">
          Sign up
        </Button>
      </Form>
    </div>
  );
}
