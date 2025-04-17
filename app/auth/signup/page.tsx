"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const [error, setError] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/`,
        form
      );

      // Automatically sign in the user after successful registration
      await signIn("credentials", {
        username: form.username,
        password: form.password1,
        callbackUrl: "/",
      });
    } catch (err: any) {
      setError(err.response?.data || {});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      {Object.keys(error).map((key) => (
        <p key={key} style={{ color: "red" }}>
          {error[key]}
        </p>
      ))}
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password1"
          value={form.password1}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Confirm Password:
        <input
          type="password"
          name="password2"
          value={form.password2}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Register</button>
    </form>
  );
}
