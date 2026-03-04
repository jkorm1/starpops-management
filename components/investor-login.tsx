"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Lock, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InvestorLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    type: "investor" | "employee",
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(password, type);
    if (!result.success) {
      setError("Invalid password. Please try again.");
      setIsLoading(false);
      return;
    }

    toast({
      title: "Welcome back!",
      description: `Welcome, ${result.name}!`,
    });

    setError("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Main login card */}
      <Card className="w-[400px] shadow-2xl border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 relative">
        <CardHeader className="space-y-6 pb-8">
          {/* Logo and title section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="absolute" />
              <img
                src="/logo.png"
                alt="StarPops Logo"
                className="relative h-40 w-40"
              />
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              StarPops Management
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Select your access type to continue
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Security badge */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure Connection</span>
          </div>

          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employee
              </TabsTrigger>
              <TabsTrigger value="investor" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Investor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employee" className="space-y-4 mt-6">
              <form
                onSubmit={(e) => handleSubmit(e, "employee")}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="employee-password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Employee Password</span>
                  </label>
                  <Input
                    id="employee-password"
                    type="password"
                    placeholder="Enter your employee password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className={`h-12 ${
                      error ? "border-destructive focus:border-destructive" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2">
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Access Employee Portal"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="investor" className="space-y-4 mt-6">
              <form
                onSubmit={(e) => handleSubmit(e, "investor")}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="investor-password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Investor Password</span>
                  </label>
                  <Input
                    id="investor-password"
                    type="password"
                    placeholder="Enter your investor password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className={`h-12 ${
                      error ? "border-destructive focus:border-destructive" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2">
                      {error}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Access Investor Portal"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer decoration */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
            <div className="h-px bg-border flex-1" />
            <span>StarPops Management</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
