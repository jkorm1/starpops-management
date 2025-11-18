import { addExpense } from "@/lib/transaction-store"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const expense = addExpense({
      date: data.date,
      category: data.category,
      description: data.description,
      amount: Number(data.amount),
    })

    return Response.json({ success: true, data: expense })
  } catch (error) {
    return Response.json({ error: "Failed to record expense" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { getExpenses } = await import("@/lib/transaction-store")
    const expenses = getExpenses()
    return Response.json(expenses)
  } catch (error) {
    return Response.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}
