"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/api/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const [Login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const res = await Login(form).unwrap();
      console.log(res);
      localStorage.setItem("token", res.token);
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-background p-4">
      <Card className="w-full max-w-sm mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl uppercase">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-accent hover:underline"
                >
                  Forgot your password?
                </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {/* <Button variant="outline" className="w-full">
              Log in with Google
            </Button> */}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-accent">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
