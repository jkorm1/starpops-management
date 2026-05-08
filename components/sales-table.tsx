"use client";

import React, { useState, useEffect } from "react";
import { Sale } from "@/lib/financial-logic";
import { getSales } from "@/lib/transaction-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Sale>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean;
    saleId: string;
  }>({
    show: false,
    saleId: "",
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const loadSales = async () => {
      try {
        const salesData = await getSales();
        setSales(salesData);
      } catch (error) {
        console.error("Failed to load sales:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  const handleSort = (field: keyof Sale) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteSale = async () => {
    try {
      const response = await fetch(`/api/sales?id=${deleteDialog.saleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sale");
      }

      // Update local state to remove the deleted sale
      setSales(sales.filter((sale) => sale.id !== deleteDialog.saleId));
      showNotification("Sale deleted successfully", "success");
      setDeleteDialog({ show: false, saleId: "" });
    } catch (error) {
      console.error("Failed to delete sale:", error);
      showNotification("Failed to delete sale", "error");
    }
  };

  const toggleRowExpansion = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Group sales by employee and date
  const groupedSales = sales.reduce(
    (acc, sale) => {
      const key = `${sale.employee}-${sale.date}`;
      if (!acc[key]) {
        acc[key] = {
          employee: sale.employee,
          date: sale.date,
          sales: [],
          totals: {
            quantity: 0,
            price: 0, // This will be a weighted average
            total: 0,
            productionCost: 0,
            investorShare: 0,
            salesPayroll: 0,
            packagingPayroll: 0,
            savings: 0,
            reinvestment: 0,
          },
        };
      }

      acc[key].sales.push(sale);

      // Calculate totals
      acc[key].totals.quantity += sale.quantity;
      acc[key].totals.total += sale.total;
      acc[key].totals.productionCost += sale.productionCost || sale.total * 0.6;
      acc[key].totals.investorShare += sale.investorShare || sale.total * 0.12;
      acc[key].totals.salesPayroll += sale.salesPayroll || sale.total * 0.1;
      acc[key].totals.packagingPayroll +=
        sale.packagingPayroll || sale.total * 0.07;
      acc[key].totals.savings += sale.savings || sale.total * 0.05;
      acc[key].totals.reinvestment += sale.reinvestment || sale.total * 0.05;

      return acc;
    },
    {} as Record<string, any>,
  );

  // Convert to array and sort
  const groupedSalesArray = Object.values(groupedSales).sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Filter based on search term
  const filteredGroupedSales = groupedSalesArray.filter((group) =>
    Object.values(group).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  if (loading) {
    return <div className="text-center p-4">Loading sales data...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Notification Component */}
      {notification.show && (
        <div
          className={`flex items-center gap-2 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("date")}
              >
                Date{" "}
                {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("employee")}
              >
                Employee{" "}
                {sortField === "employee" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("product")}
              >
                Product{" "}
                {sortField === "product" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("quantity")}
              >
                Quantity{" "}
                {sortField === "quantity" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("total")}
              >
                Total{" "}
                {sortField === "total" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("event")}
              >
                Event{" "}
                {sortField === "event" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>

              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("productionCost")}
              >
                Production Cost{" "}
                {sortField === "productionCost" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("investorShare")}
              >
                Investor Share{" "}
                {sortField === "investorShare" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("salesPayroll")}
              >
                Sales Payroll{" "}
                {sortField === "salesPayroll" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("packagingPayroll")}
              >
                Packaging Payroll{" "}
                {sortField === "packagingPayroll" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("savings")}
              >
                Savings{" "}
                {sortField === "savings" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("reinvestment")}
              >
                Reinvestment{" "}
                {sortField === "reinvestment" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroupedSales.map((group) => {
              const rowId = `${group.employee}-${group.date}`;
              const isExpanded = expandedRows.has(rowId);

              return (
                <React.Fragment key={rowId}>
                  <TableRow className="bg-muted/20">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRowExpansion(rowId)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {format(new Date(group.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{group.employee}</TableCell>
                    <TableCell className="font-semibold">
                      Multiple Products
                    </TableCell>
                    <TableCell className="font-semibold">
                      {group.totals.quantity}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.total.toFixed(2)}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.productionCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.investorShare.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.salesPayroll.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.packagingPayroll.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.savings.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      GHS {group.totals.reinvestment.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {isExpanded &&
                    group.sales.map((sale) => (
                      <TableRow key={sale.id} className="bg-muted/10">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{sale.product}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>GHS {sale.price.toFixed(2)}</TableCell>
                        <TableCell>GHS {sale.total.toFixed(2)}</TableCell>
                        <TableCell>{sale.event || "Normal"}</TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.productionCost?.toFixed(2) ||
                            (sale.total * 0.6).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.investorShare?.toFixed(2) ||
                            (sale.total * 0.12).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.salesPayroll?.toFixed(2) ||
                            (sale.total * 0.1).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.packagingPayroll?.toFixed(2) ||
                            (sale.total * 0.07).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.savings?.toFixed(2) ||
                            (sale.total * 0.05).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          GHS{" "}
                          {sale.reinvestment?.toFixed(2) ||
                            (sale.total * 0.05).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteDialog({ show: true, saleId: sale.id })
                            }
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.show}
        onOpenChange={(open) =>
          setDeleteDialog({ show: open, saleId: deleteDialog.saleId })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sale record from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteDialog({ show: false, saleId: "" })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSale}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
