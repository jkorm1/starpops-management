"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmployeeProgressProps {
  employeeName: string;
  currentQuantity: number;
}

export function EmployeeProgress({
  employeeName,
  currentQuantity,
}: EmployeeProgressProps) {
  const QUANTITY_TARGET = 520; // Target quantity
  const DAILY_MINIMUM = 20; // Minimum pieces per day

  const quantityPercentage = Math.min(
    (currentQuantity / QUANTITY_TARGET) * 100,
    100,
  );

  const remainingQuantity = QUANTITY_TARGET - currentQuantity;
  const estimatedDaysRemaining = Math.ceil(remainingQuantity / DAILY_MINIMUM);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{employeeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quantity Target</span>
            <span className="font-medium">
              {currentQuantity} / {QUANTITY_TARGET} pieces
            </span>
          </div>
          <Progress value={quantityPercentage} className="w-full" />
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              {quantityPercentage.toFixed(1)}% - {remainingQuantity} pieces
              remaining
            </div>
            <div className="text-green-600">
              ~{estimatedDaysRemaining} days left (at 20 pieces/day minimum)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
