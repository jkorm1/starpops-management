"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeeStats {
  totalDays: number;
  totalShare: number;
  ranking: number;
  totalEmployees: number;
}

export function StatsCards({ stats }: { stats: EmployeeStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Work Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Share</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            GHS {stats.totalShare.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Your Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            #{stats.ranking} of {stats.totalEmployees}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={stats.ranking <= 3 ? "default" : "secondary"}>
            {stats.ranking <= 3 ? "Top Performer" : "Keep Growing"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
