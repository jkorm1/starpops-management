"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validateSale } from "@/lib/validation";

const employees = [
  "Joseph Korm",
  "Humphrey Obeng Mensah",
  "Daniel Mensah",
  "Alvin Asare",
  "Jackson Budu",
  "Jeffery Yeboah",
  "Caleb Sackey",
  "Diana Amano",
  "Mercy Tetteh",
  "Mavis Afriyie Sakyiwaa",
  "Ewura Beniti Darkoah",
  "Prince Asare",
];

// Define product types with their prices
const productTypes = [
  { name: "Starter Popcorn", price: 10, hasToppings: false },
  { name: "Salt Popcorn", price: 10, hasToppings: false },
  { name: "Deluxe Popcorn", price: 15, hasToppings: true },
  { name: "Ultimate Popcorn", price: 20, hasToppings: true },
];

export default function SalesForm({ onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    employee: employees[0],
    event: "Normal",
    eventName: "",
    quantities: {
      "Starter Popcorn": "",
      "Salt Popcorn": "",
      "Deluxe Popcorn": "",
      "Ultimate Popcorn": "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle quantity changes
    if (name.startsWith("quantity-")) {
      const productName = name.replace("quantity-", "");
      setFormData((prev) => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [productName]: value,
        },
      }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      // Handle other field changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Calculate total sales across all products
  const calculateTotalSales = () => {
    let total = 0;
    let totalQuantity = 0;

    productTypes.forEach((product) => {
      const quantity = Number(formData.quantities[product.name]) || 0;
      total += quantity * product.price;
      totalQuantity += quantity;
    });

    return { total: total.toFixed(2), quantity: totalQuantity };
  };

  const { total: totalSales, quantity: totalQuantity } = calculateTotalSales();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one product has a quantity
    const hasAnyQuantity = Object.values(formData.quantities).some(
      (qty) => qty && Number(qty) > 0,
    );

    if (!hasAnyQuantity) {
      toast({
        title: "Error",
        description: "Please enter quantities for at least one product",
        variant: "destructive",
      });
      return;
    }

    // Create separate sales records for each product with quantity > 0
    const salesToRecord = productTypes
      .map((product) => {
        const quantity = Number(formData.quantities[product.name]) || 0;
        if (quantity <= 0) return null;

        const productTotal = quantity * product.price;

        return {
          date: formData.date,
          employee: formData.employee,
          product: product.name,
          quantity: quantity,
          price: product.price,
          total: productTotal,
          event:
            formData.event === "Normal"
              ? "Normal"
              : formData.eventName || "Normal",
          productionCost: Number((productTotal * 0.6).toFixed(2)),
          investorShare: Number((productTotal * 0.12).toFixed(2)),
          salesPayroll: Number((productTotal * 0.1).toFixed(2)),
          packagingPayroll: Number((productTotal * 0.07).toFixed(2)),
          savings: Number((productTotal * 0.05).toFixed(2)),
          reinvestment: Number((productTotal * 0.05).toFixed(2)),
        };
      })
      .filter(Boolean);

    setLoading(true);
    try {
      // Send all sales records
      const promises = salesToRecord.map((saleData) =>
        fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        }),
      );

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        toast({
          title: "Success",
          description: `Successfully recorded ${salesToRecord.length} product sale(s)`,
          variant: "success",
        });
        setFormData({
          date: new Date().toISOString().split("T")[0],
          employee: employees[0],
          event: "Normal",
          eventName: "",
          quantities: {
            "Starter Popcorn": "",
            "Salt Popcorn": "",
            "Deluxe Popcorn": "",
            "Ultimate Popcorn": "",
          },
        });
        setErrors({});
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to record some sales",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record sales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate money split for each product
  const calculateProductSplit = (productName) => {
    const quantity = Number(formData.quantities[productName]) || 0;
    const product = productTypes.find((p) => p.name === productName);
    if (!product || quantity <= 0) return null;

    const total = quantity * product.price;
    return {
      total: total.toFixed(2),
      productionCost: ((total * 60) / 100).toFixed(2),
      investorShare: ((total * 12) / 100).toFixed(2),
      salesPayroll: ((total * 10) / 100).toFixed(2),
      packagingPayroll: ((total * 7) / 100).toFixed(2),
      savings: ((total * 5.5) / 100).toFixed(2),
      reinvestment: ((total * 5.5) / 100).toFixed(2),
    };
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Record a Sale</CardTitle>
          <CardDescription>Add a new sales transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-input border-border"
                required
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
              >
                {employees.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <Label>Product Quantities</Label>
              {productTypes.map((product) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`quantity-${product.name}`}>
                      {product.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      GHS {product.price} per unit{" "}
                      {product.hasToppings ? "(includes toppings)" : ""}
                    </p>
                  </div>
                  <Input
                    id={`quantity-${product.name}`}
                    name={`quantity-${product.name}`}
                    type="number"
                    step="1"
                    min="0"
                    value={formData.quantities[product.name]}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-24 bg-input border-border ${
                      errors[`quantity-${product.name}`]
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event Type</Label>
              <select
                name="event"
                value={formData.event}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    event: value,
                    eventName: value === "Normal" ? "" : prev.eventName,
                  }));
                }}
                className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
              >
                <option value="Normal">Normal Day Sales</option>
                <option value="Event">Event Sales</option>
              </select>
            </div>
            {formData.event === "Event" && (
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  type="text"
                  value={formData.eventName || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      eventName: e.target.value,
                    }));
                  }}
                  className="bg-input border-border"
                  placeholder="Enter event name"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {loading ? "Recording..." : "Record Sale"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Money Split</CardTitle>
          <CardDescription>Automatic allocation from this sale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Sales</p>
            <p className="text-2xl font-bold text-foreground">
              GHS {totalSales}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Quantity: {totalQuantity}
            </p>
          </div>

          {productTypes.map((product) => {
            const split = calculateProductSplit(product.name);
            if (!split) return null;

            return (
              <div
                key={product.name}
                className="border rounded-lg p-4 space-y-3"
              >
                <h3 className="font-semibold">{product.name}</h3>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">Total</span>
                  <span className="font-semibold text-foreground">
                    GHS {split.total}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Production Cost (60%)
                  </span>
                  <span className="font-semibold text-accent">
                    GHS {split.productionCost}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Investor Share (12%)
                  </span>
                  <span className="font-semibold text-purple-400">
                    GHS {split.investorShare}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Sales Payroll (10%)
                  </span>
                  <span className="font-semibold text-cyan-400">
                    GHS {split.salesPayroll}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Packaging Payroll (7%)
                  </span>
                  <span className="font-semibold text-cyan-400">
                    GHS {split.packagingPayroll}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Savings (5.5%)
                  </span>
                  <span className="font-semibold text-green-400">
                    GHS {split.savings}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded border border-border">
                  <span className="text-sm text-foreground">
                    Reinvestment (5.5%)
                  </span>
                  <span className="font-semibold text-green-400">
                    GHS {split.reinvestment}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
