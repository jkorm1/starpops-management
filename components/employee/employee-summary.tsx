"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeSummary {
  name: string;
  totalQuantity: number;
  totalDays: number;
  totalAmount: number;
  totalShare: number;
}

export function EmployeeSummary({
  summaries,
}: {
  summaries: EmployeeSummary[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Summary</CardTitle>
        <CardDescription>Individual performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total Days</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Total Share (GHS)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.map((summary) => (
              <TableRow key={summary.name}>
                <TableCell>{summary.name}</TableCell>
                <TableCell>{summary.totalDays}</TableCell>
                <TableCell>{summary.totalQuantity}</TableCell>
                <TableCell>
                  GHS {(summary.totalShare || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
