"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MonthlySales {
  month: string;
  days: number;
  quantity: number;
  share: number;
}

export function MonthlyPerformance({
  monthlySales,
}: {
  monthlySales: MonthlySales[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
        <CardDescription>Your attendance and sales by month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlySales.map((month) => (
            <div
              key={month.month}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{month.month}</p>
                <p className="text-sm text-muted-foreground">
                  {month.days} working days
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {month.quantity || 0} units sold
                </p>
                <p className="text-sm text-muted-foreground">
                  Average:{" "}
                  {month.days > 0
                    ? (month.quantity / month.days).toFixed(1)
                    : "0.0"}{" "}
                  units/day
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
