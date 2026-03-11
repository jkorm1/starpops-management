"use client";

import { useState, useEffect } from "react";
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
import { Trash2, CheckCircle, XCircle } from "lucide-react";

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

  const filteredAndSortedSales = sales
    .filter((sale) =>
      Object.values(sale).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {format(new Date(sale.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{sale.employee}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>GHS {sale.price.toFixed(2)}</TableCell>
                <TableCell>GHS {sale.total.toFixed(2)}</TableCell>
                <TableCell>{sale.event || "Normal"}</TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.productionCost?.toFixed(2) ||
                    (sale.total * 0.63).toFixed(2)}
                </TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.investorShare?.toFixed(2) ||
                    (sale.total * 0.12).toFixed(2)}
                </TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.salesPayroll?.toFixed(2) ||
                    (sale.total * 0.06944).toFixed(2)}
                </TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.packagingPayroll?.toFixed(2) ||
                    (sale.total * 0.06944).toFixed(2)}
                </TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.savings?.toFixed(2) ||
                    (sale.total * 0.05556).toFixed(2)}
                </TableCell>
                <TableCell>
                  GHS{" "}
                  {sale.reinvestment?.toFixed(2) ||
                    (sale.total * 0.05556).toFixed(2)}
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
