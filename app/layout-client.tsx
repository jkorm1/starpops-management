"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InvestorLogin } from "@/components/investor-login";
import { useAuth } from "@/contexts/auth-context";
import { LogoutButton } from "@/components/logout-button";
import EmployeeDashboard from "@/components/employee-dashboard";
import {
  LayoutDashboard,
  Table,
  Users,
  ShoppingBag,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <InvestorLogin />;
  }

  if (userType === "employee") {
    return <EmployeeDashboard />;
  }

  return <>{children}</>;
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { userType } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show navigation for employees
  if (userType === "employee") {
    return (
      <div className="min-h-screen bg-background">
        <AuthGuard>{children}</AuthGuard>
      </div>
    );
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tables", label: "Tables", icon: Table },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/setup", label: "Setup", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full sticky top-0 z-50">
        <nav className="px-4 h-14 w-full flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="StarPops Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
              />
              <span className="hidden font-bold sm:inline-block">StarPops</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 hover:underline flex items-center gap-2 ${
                  pathname === item.href
                    ? "text-foreground border-b-2 border-primary"
                    : "text-foreground/60"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="hidden md:block">
              <LogoutButton />
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2 duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent flex items-center gap-3 ${
                    pathname === item.href
                      ? "text-foreground bg-accent"
                      : "text-foreground/60"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    // Trigger the logout functionality
                    const logoutButton = document.querySelector(
                      '[data-logout="true"]',
                    ) as HTMLButtonElement;
                    if (logoutButton) logoutButton.click();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent text-foreground/60"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto py-6">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  );
}
