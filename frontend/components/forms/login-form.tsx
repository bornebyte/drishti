"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginRequest } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@drishti.local",
      password: "password123"
    }
  });

  async function onSubmit(values: LoginValues) {
    const response = await loginRequest(values.email, values.password);
    setMessage(response.message);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Email</label>
        <Input {...register("email")} />
        {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Password</label>
        <Input type="password" {...register("password")} />
        {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm text-slate">{message || "Seed credentials are prefilled for local development."}</p>
    </form>
  );
}
