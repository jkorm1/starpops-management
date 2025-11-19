"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/dashboard";
import SalesForm from "@/components/sales-form";
import ExpensesForm from "@/components/expenses-form";
import WithdrawalsForm from "@/components/withdrawals-form";
import FinancialStatements from "@/components/financial-statements";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { investorName } = useAuth();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Star Pops Financial Dashboard
            {investorName && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Welcome, {investorName})
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your popcorn business finances in real-time
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Quick Stats */}
        {data && (
          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  GHS {data.totalSales || 0}
                </div>
                <p className="text-xs text-green-500 mt-1">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Business Fund
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  GHS {data.businessFund || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  7 GHS per sale
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  GHS {data.totalExpenses || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Running costs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Owner's Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  GHS {data.ownerWithdrawals || 0}
                </div>
                <p className="text-xs text-red-500 mt-1">
                  Amount owed to business
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted border border-border">
            <TabsTrigger value="dashboard" className="text-xs md:text-sm">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-xs md:text-sm">
              Sales
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs md:text-sm">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-xs md:text-sm">
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="statements" className="text-xs md:text-sm">
              Statements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard data={data} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="sales" className="mt-6">
            <SalesForm onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <ExpensesForm onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="withdrawals" className="mt-6">
            <WithdrawalsForm onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="statements" className="mt-6">
            <FinancialStatements data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
