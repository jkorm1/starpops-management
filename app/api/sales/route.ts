import { calculateSaleSplit } from "@/lib/financial-logic"
import { addSale } from "@/lib/transaction-store"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const total = Number(data.quantity) * Number(data.price)
    const split = calculateSaleSplit(total)

    const sale = await addSale({
      date: data.date,
      employee: data.employee, // Add employee tracking
      product: data.product,
      quantity: Number(data.quantity),
      price: Number(data.price),
      total: Math.round(total * 100) / 100,
      businessFund: split.businessFund,
      employeeShare: split.employeeShare,
      investorShare: split.investorShare,
    })

    return Response.json({ success: true, data: sale })
  } catch (error) {
    return Response.json({ error: "Failed to record sale" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { getSales } = await import("@/lib/transaction-store")
    const sales = await getSales()
    return Response.json(sales)
  } catch (error) {
    return Response.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}
