import { calculateFinancialSummary } from "@/lib/financial-logic"
import { getSales, getExpenses, getWithdrawals } from "@/lib/transaction-store"

export async function GET() {
  try {
    const sales = await getSales()
    const expenses = await getExpenses()
    const withdrawals = await getWithdrawals()

    // Calculate employee shares
    const employeeShares = sales.reduce((acc, sale) => {
      const existing = acc.find(e => e.employee === sale.employee)
      if (existing) {
        existing.totalShare += sale.employeeShare
        existing.salesCount += 1
      } else {
        acc.push({
          employee: sale.employee,
          totalShare: sale.employeeShare,
          salesCount: 1
        })
      }
      return acc
    }, [] as { employee: string; totalShare: number; salesCount: number }[])

    const summary = calculateFinancialSummary(sales, expenses, withdrawals)
    return Response.json({
      ...summary,
      employeeShares
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
