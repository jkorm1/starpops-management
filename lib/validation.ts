// Form validation utilities

export interface ValidationError {
  field: string
  message: string
}

export function validateSale(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.date) {
    errors.push({ field: "date", message: "Date is required" })
  }

  if (!data.product || data.product.trim() === "") {
    errors.push({ field: "product", message: "Product name is required" })
  }

  const quantity = Number.parseFloat(data.quantity)
  if (!data.quantity || isNaN(quantity) || quantity <= 0) {
    errors.push({ field: "quantity", message: "Quantity must be a positive number" })
  }

  const price = Number.parseFloat(data.price)
  if (!data.price || isNaN(price) || price <= 0) {
    errors.push({ field: "price", message: "Price must be a positive number" })
  }

  return errors
}

export function validateExpense(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.date) {
    errors.push({ field: "date", message: "Date is required" })
  }

  if (!data.category) {
    errors.push({ field: "category", message: "Category is required" })
  }

  const amount = Number.parseFloat(data.amount)
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.push({ field: "amount", message: "Amount must be a positive number" })
  }

  return errors
}

export function validateWithdrawal(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.date) {
    errors.push({ field: "date", message: "Date is required" })
  }

  const amount = Number.parseFloat(data.amount)
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.push({ field: "amount", message: "Amount must be a positive number" })
  }

  return errors
}
