"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { validateExpense } from "@/lib/validation"

const expenseCategories = ["Maize", "Sugar", "Packaging", "Utilities", "Transport", "Other"]

export default function ExpensesForm({ onSuccess }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Maize",
    description: "",
    amount: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateExpense(formData)
    if (validationErrors.length > 0) {
      const errorMap = validationErrors.reduce(
        (acc, err) => {
          acc[err.field] = err.message
          return acc
        },
        {} as Record<string, string>,
      )
      setErrors(errorMap)
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense recorded successfully",
        })
        setFormData({
          date: new Date().toISOString().split("T")[0],
          category: "Maize",
          description: "",
          amount: "",
        })
        setErrors({})
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: "Failed to record expense",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record expense",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border max-w-2xl">
      <CardHeader>
        <CardTitle>Record an Expense</CardTitle>
        <CardDescription>Add a new business expense</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
              >
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-card">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Weekly supplies"
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className={`bg-input border-border ${errors.amount ? "border-destructive" : ""}`}
              required
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
            {loading ? "Recording..." : "Record Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
