"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSales } from "@/lib/transaction-store";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "./employee/stats-cards";
import { DailyRecords } from "./employee/daily-records";
import { EmployeeSummary } from "./employee/employee-summary";
import { MonthlyPerformance } from "./employee/monthly-performance";
import { EmployeeProgress } from "./employee/employee-progress";

interface DailyRecord {
  date: string;
  employeesPresent: string[];
  totalQuantity: number;
}

interface EmployeeSummary {
  name: string;
  totalQuantity: number;
  totalDays: number;
  totalAmount: number;
  totalShare: number;
}

interface EmployeeStats {
  totalDays: number;
  totalSales: number;
  totalShare: number;
  monthlySales: Array<{
    month: string;
    sales: number;
    days: number;
    share: number;
    quantity: number;
  }>;
  ranking: number;
  totalEmployees: number;
}

function LogoutButton() {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleClick = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="transition-colors hover:text-foreground/80 text-foreground/60"
    >
      Logout
    </Button>
  );
}

export default function EmployeeDashboard() {
  const { userName } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [employeeSummaries, setEmployeeSummaries] = useState<EmployeeSummary[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sales = await getSales();

        // Process daily records
        const dailyData = sales.reduce(
          (acc, sale) => {
            const date = sale.date;
            if (!acc[date]) {
              acc[date] = {
                date,
                employeesPresent: new Set(),
                totalQuantity: 0,
              };
            }
            acc[date].employeesPresent.add(sale.employee);
            acc[date].totalQuantity += sale.quantity;
            return acc;
          },
          {} as Record<
            string,
            {
              date: string;
              employeesPresent: Set<string>;
              totalQuantity: number;
            }
          >,
        );

        const records = Object.values(dailyData)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((record) => ({
            date: record.date,
            employeesPresent: Array.from(record.employeesPresent),
            totalQuantity: record.totalQuantity,
          }));

        // Process employee summaries
        const summaryData = sales.reduce(
          (acc, sale) => {
            if (!acc[sale.employee]) {
              acc[sale.employee] = {
                name: sale.employee,
                totalQuantity: 0,
                totalDays: new Set(),
                totalAmount: 0,
                totalShare: 0,
              };
            }
            acc[sale.employee].totalQuantity += sale.quantity;
            acc[sale.employee].totalDays.add(sale.date);
            acc[sale.employee].totalAmount += sale.total;
            acc[sale.employee].totalShare += sale.salesPayroll || 0;
            return acc;
          },
          {} as Record<string, EmployeeSummary>,
        );

        const summaries = Object.values(summaryData)
          .map((summary) => ({
            ...summary,
            totalDays: summary.totalDays.size,
          }))
          .sort((a, b) => b.totalShare - a.totalShare);

        setDailyRecords(records);
        setEmployeeSummaries(summaries);

        // Keep existing stats calculation
        const employeeSales = sales.filter(
          (sale) => sale.employee === userName,
        );
        const workDays = new Set(employeeSales.map((sale) => sale.date)).size;

        const monthlyData = employeeSales.reduce(
          (acc, sale) => {
            const month = format(new Date(sale.date), "MMM yyyy");
            if (!acc[month]) {
              acc[month] = { sales: 0, days: new Set(), share: 0, quantity: 0 };
            }
            acc[month].sales += sale.total;
            acc[month].days.add(sale.date);
            acc[month].share += sale.salesPayroll || 0;
            acc[month].quantity += sale.quantity;
            return acc;
          },
          {} as Record<
            string,
            {
              sales: number;
              days: Set<string>;
              share: number;
              quantity: number;
            }
          >,
        );

        const monthlySales = Object.entries(monthlyData).map(
          ([month, data]) => ({
            month,
            sales: data.sales,
            days: data.days.size,
            share: data.share,
            quantity: data.quantity,
          }),
        );

        const employeeShares = sales.reduce(
          (acc, sale) => {
            acc[sale.employee] =
              (acc[sale.employee] || 0) + (sale.salesPayroll || 0);
            return acc;
          },
          {} as Record<string, number>,
        );

        const sortedEmployees = Object.entries(employeeShares)
          .sort(([, a], [, b]) => b - a)
          .map(([name]) => name);

        const ranking = sortedEmployees.indexOf(userName!) + 1;
        const totalShare = employeeSales.reduce(
          (sum, sale) => sum + (sale.salesPayroll || 0),
          0,
        );

        setStats({
          totalDays: workDays,
          totalSales: employeeSales.reduce((sum, sale) => sum + sale.total, 0),
          totalShare,
          monthlySales,
          ranking,
          totalEmployees: sortedEmployees.length,
        });
      } catch (error) {
        console.error("Failed to load employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userName]);

  if (loading) {
    return <div className="text-center p-4">Loading your dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center p-4">Failed to load your data</div>;
  }

  const safeStats = {
    totalDays: stats?.totalDays || 0,
    totalShare: stats?.totalShare || 0,
    ranking: stats?.ranking || 0,
    totalEmployees: stats?.totalEmployees || 0,
    monthlySales: stats?.monthlySales || [],
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">
            Here's your performance overview
          </p>
        </div>
        <LogoutButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-muted border border-border rounded-lg p-1 mb-4">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-4 bg-transparent border-0 gap-1 auto-rows-min pb-2">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-xs md:text-sm">
              Daily
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs md:text-sm">
              Summary
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs md:text-sm">
              Monthly
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <StatsCards stats={safeStats} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employeeSummaries.map((summary) => (
                <EmployeeProgress
                  key={summary.name}
                  employeeName={summary.name}
                  currentQuantity={summary.totalQuantity}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <DailyRecords records={dailyRecords} />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <EmployeeSummary summaries={employeeSummaries} />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <MonthlyPerformance monthlySales={safeStats.monthlySales} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
