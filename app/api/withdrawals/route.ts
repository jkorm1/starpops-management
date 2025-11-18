import { addWithdrawal } from "@/lib/transaction-store"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const withdrawal = addWithdrawal({
      date: data.date,
      purpose: data.purpose,
      amount: Number(data.amount),
      type: "withdrawal",
    })

    return Response.json({ success: true, data: withdrawal })
  } catch (error) {
    return Response.json({ error: "Failed to record withdrawal" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const { getWithdrawals } = await import("@/lib/transaction-store")
    const withdrawals = getWithdrawals().filter((w) => w.type === "withdrawal")
    return Response.json(withdrawals)
  } catch (error) {
    return Response.json({ error: "Failed to fetch withdrawals" }, { status: 500 })
  }
}
