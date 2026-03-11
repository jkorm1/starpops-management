import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { JWT } from "google-auth-library"

async function getSheetsClient() {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS
  if (!credentials) {
    throw new Error("Google Sheets credentials not configured")
  }

  const parsedCredentials = JSON.parse(credentials)
  const auth = new JWT({
    email: parsedCredentials.client_email,
    key: parsedCredentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth })
}

// Helper function to get sheet ID by name
async function getSheetId(sheets: any, spreadsheetId: string, sheetName: string): Promise<number> {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
  const sheet = spreadsheet.data.sheets?.find((s: any) => s.properties?.title === sheetName)
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`)
  }
  
  return sheet.properties.sheetId
}

export async function POST(request: NextRequest) {
  try {
    const { action, range, values } = await request.json()
    const sheets = await getSheetsClient()
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      throw new Error("Google Sheet ID not configured")
    }

    switch (action) {
      case 'append':
        const appendResponse = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values },
          insertDataOption: 'INSERT_ROWS',
        })
        return NextResponse.json(appendResponse.data)

      case 'read':
        const readResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        })
        return NextResponse.json({ values: readResponse.data.values || [] })

      case 'delete':
        // Extract sheet name and row number from range (e.g., "Sales!A2:O2")
        const [sheetName, cellRange] = range.split('!')
        // Extract row number from cell range (e.g., "A2:O2" -> 2)
        const rowNumber = parseInt(cellRange.match(/\d+/)?.[0] || '0')
        
        // Delete the row using batchUpdate
        const deleteResponse = await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: await getSheetId(sheets, spreadsheetId, sheetName),
                  dimension: 'ROWS',
                  startIndex: rowNumber - 1, // Convert to 0-based index
                  endIndex: rowNumber, // endIndex is exclusive
                },
              },
            }],
          },
        })
        return NextResponse.json({ success: true, data: deleteResponse.data })

      case 'setup':
       const sheetConfigs = [
  {
    name: "Sales",
    headers: [
      "ID",
      "Date",
      "Employee",
      "Product",
      "Quantity",
      "Price",
      "Total",
      "Business Fund",
      "Employee Share",
      "Investor Share",
    ],
  },
  { name: "Expenses", headers: ["ID", "Date", "Category", "Description", "Amount", "Notes"] },
  { name: "Withdrawals", headers: ["ID", "Date", "Type", "Amount", "Reason", "Notes"] },
  { name: "Summary", headers: ["Metric", "Value", "Last Updated"] },
]


        // Get existing sheets
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
        const existingSheetNames = spreadsheet.data.sheets?.map((s) => s.properties?.title) || []

        // Create or update sheets
        for (const config of sheetConfigs) {
          // Create sheet if it doesn't exist
          if (!existingSheetNames.includes(config.name)) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId,
              requestBody: {
                requests: [{
                  addSheet: {
                    properties: { title: config.name },
                  },
                }],
              },
            })
          }

          // Check if headers exist
          const headerResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${config.name}!A1:Z1`,
          })

          // Only add headers if the row is empty
          if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${config.name}!A1`,
              valueInputOption: "USER_ENTERED",
              requestBody: { values: [config.headers] },
            })
          }
        }

        return NextResponse.json({ 
          success: true, 
          message: existingSheetNames.length > 0 
            ? "Google Sheets updated successfully!" 
            : "Google Sheets setup completed successfully!",
          existingSheets: existingSheetNames
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Google Sheets API error:', error)
    return NextResponse.json(
      { error: 'Failed to perform Google Sheets operation' },
      { status: 500 }
    )
  }
}
