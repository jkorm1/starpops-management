"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface DailyRecord {
  date: string;
  employeesPresent: string[];
}

export function DailyRecords({ records }: { records: DailyRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Records</CardTitle>
        <CardDescription>
          View daily attendance and sales records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employees Present</TableHead>
              <TableHead>Number Present</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.date}>
                <TableCell>
                  {format(new Date(record.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {record.employeesPresent.map((emp) => (
                      <Badge key={emp} variant="secondary">
                        {emp}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{record.employeesPresent.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
