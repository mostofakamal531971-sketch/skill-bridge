"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthHandlers } from "../auth-handler";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Schema Definition ---
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  // Disallows empty string, ensuring user must pick one
  role: z.enum(["STUDENT", "TUTOR"], {
    message: "Please select a role to continue" 
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpForm() {

  const { signUp } = useAuthHandlers();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "" as any, // Default is empty so no role is pre-selected
      password: "",
      confirmPassword: "",
    },
   validators: {
      onChange: signUpSchema, 
    },
    onSubmit: async ({ value }) => {
      const payload = {
        email:value.email,
        name:value.name,
        password:value.password,
        role:value.role,
      }
      await signUp(payload);
    },
  });

  return (
    <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-2xl border border-zinc-200 dark:border-zinc-800 sm:rounded-2xl sm:px-10">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Role Selection */}
        <form.Field
          name="role"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Register as
              </label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as any)}
              >
                <SelectTrigger className={`w-full h-12 bg-zinc-50 dark:bg-zinc-800 border ${
                  field.state.meta.errors.length ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all`}>
                  <SelectValue placeholder="Pick your role..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <SelectItem value="STUDENT" className="py-3 rounded-lg cursor-pointer">
                    Student (Learning)
                  </SelectItem>
                  <SelectItem value="TUTOR" className="py-3 rounded-lg cursor-pointer">
                    Tutor (Teaching)
                  </SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">
                  {field.state.meta.errors.map((e)=> e?.message)}
                </p>
              )}
            </div>
          )}
        />

        {/* Full Name */}
        <form.Field
          name="name"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border ${
                  field.state.meta.errors.length ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">
                  {field.state.meta.errors.map((e)=> e?.message)}
                </p>
              )}
            </div>
          )}
        />

        {/* Email */}
        <form.Field
          name="email"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
              <input
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border ${
                  field.state.meta.errors.length ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                } rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all`}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">
                  {field.state.meta.errors.map((e)=> e?.message)}
                </p>
              )}
            </div>
          )}
        />

        {/* Password Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border ${
                    field.state.meta.errors.length ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                  } rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all`}
                />
              </div>
            )}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border ${
                    field.state.meta.errors.length ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                  } rounded-xl text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all`}
                />
              </div>
            )}
          />
        </div>

        {/* Confirm Password Mismatch logic */}
        <form.Subscribe
          selector={(state) => state.fieldMeta.confirmPassword?.errors}
          children={(errors) => 
            errors?.length ? <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">password not match</p> : null
          }
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-lg text-sm font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </button>
          )}
        />
      </form>
    </div>
  );
}
