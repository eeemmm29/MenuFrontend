import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [authError, setAuthError] = useState<string>();

  const onSubmit = async (data: LoginForm) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      console.error("Authentication error:", result.error);
      setAuthError("Invalid username or password. Please try again.");
    } else {
      // Clear error on success and redirect
      setAuthError(undefined);
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Form
        className="w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid username"
          label="Username"
          labelPlacement="outside"
          placeholder="Enter your username"
          type="text"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p style={{ color: "red" }}>{errors.username.message?.toString()}</p>
        )}
        <Input
          isRequired
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message?.toString()}</p>
        )}
        {authError && <p style={{ color: "red" }}>{authError}</p>}
        <Button type="submit" variant="bordered">
          Sign In
        </Button>
      </Form>
    </div>
  );
}
