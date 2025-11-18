import { addWithdrawal } from "@/lib/transaction-store"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const repayment = addWithdrawal({
      date: data.date,
      purpose: data.purpose,
      amount: Number(data.amount),
      type: "repayment",
    })

    return Response.json({ success: true, data: repayment })
  } catch (error) {
    return Response.json({ error: "Failed to record repayment" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { getWithdrawals } = await import("@/lib/transaction-store")
    const repayments = getWithdrawals().filter((w) => w.type === "repayment")
    return Response.json(repayments)
  } catch (error) {
    return Response.json({ error: "Failed to fetch repayments" }, { status: 500 })
  }
}
