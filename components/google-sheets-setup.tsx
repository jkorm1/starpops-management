"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function GoogleSheetsSetup() {
  const [sheetId, setSheetId] = useState(
    "1jxnOIYWWLz2GfGNmdntxHr30UD6o94cWZP2X73hFalw"
  );

  const credentials = {
    type: "service_account",
    project_id: "starpops-management",
    private_key_id: "225bb7809aad1923f0742267aa5e0657491209fd",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOOAL45+kcck9+\nMlAFSAP66hOKPNqTCYv1s3zb1oJ7w9YSp6zvcNJ7Ych7kfLIocJeC7kYUn0AOaCL\nN24MH67iY95VSjyUnaAe+g4qNDwGB9TM1hQQVYRptqKT+eHNJrHB4T+ssiZa2GBh\nBPPBkwy/njE1huiWkgDaqPzNxGnbO4Uxfdz6aDiqP4SsxJmKn6Mtd4kpzh+IZ6gJ\nTq58BgB8LDw9Qoq+dnWiK2G8NJ7uux149VK85x3UpeDifdOHvxQthcU1B8+Etl7j\nXSip4pvLMjTTSAqgHa9Q2Z8rJjk6UZm/2AOWuE5CcKShlrgidUJBZcYoiB/RLO9x\n1vbCoFkxAgMBAAECggEAAw129MyJCbni9Zskzlk1LuALa0DQmvvZkajnJKFxo8ef\nuf23rIEy6m7lfvfHfGMRm58IjcS90zSnLNxkkYMgDXudOU28pRYKvl6k+ki06UFx\nK9mQ6Td82uxATpi0uBrWJ4iwLrwh33cjwRfnzFIjDoyWzaQqOf1eDB6ThG+/geZi\nMemieb1f06IUCw0CSpUIbvW8FvfUArQ9Eiqnvkb+604hSssxT09XvVLv8RQqhtVF\nbffDL9R0sD0XGzcs55kpooNJ1iPP9a73WpPFwWNQqcpUm9X8j3o2iWzszUH/T4OF\nm6vbduKPt0ZteoQfODiC4IDncbIh+8XJr8eh5pkRQQKBgQD9extg0DcZpvfSfQ3/\nHgk/IxNV4vkKNm6ahT691sMM+a5mNRIuniHtrbXmO66kRZVdjbPvInIfO4CdILaz\nb/tT/U4baBXr3ISOvhNugUVNJ+vxt19iDurdY8jzfTAn7xOG4Lj+wE2SVkZSAfav\nzW3njT/BnEO+W00lWQj3bWgroQKBgQDQRKmydYEX4tCBkJPpRLA/S/R/nhFJj4Yf\n+tDtukaxU9ZPcEMResTdzhVK8XhUDS3+IeUFou3685WFpap2V+/B/T4A1cdYQvtY\nIhaLggT3h0V/Q3dZDH3skx+3zYxdOTXtWV/VHBNLyD1BYxIAQl0wi17MrV08xcrS\nStu81uTDkQKBgDM0hkBVb3wQHan4tzYdJDML6+ECu9pTSp6OYjFJTBe37IIbIHQo\nX6Q63i8HSW1H3TeL45hgNfuXMpELRb0T1wqNdhTVPvBpmKGZRiWhmZVPhjtLFsqh\nRtK4UKTXWj4G7sPla5mS0VjJcuUoHmQ/NH99Ki77WTgAC6KKzOPmxw9hAoGAfsf9\noZRkRH0fPnAbiln1DGMZcIJxtZz4IgmWG9FUbWhCwtLtEPvyUa+9SITcIhZv1A8g\nEqFPS3/ymovxy97WJfoaP3njwvfrd4gwvzYj/ebLyJ/yTDQNh/E70rD+7FUCXf0V\nGG7h1DUODPrZH21Gu2FsER7L7k3dnMxTHY6XbfECgYB7Vg1i50SssM2AQL5AfYPC\nkFvCLJvRY7n74mrxwQxieKBkERYeTtFw6Q4ltcnEX11pJhEnNb5/bB9/NuDBaphc\nnFLLsoXSso8SroGnOSYQIaBpgTIWJ72WCzbg3Cnl7MJY7+flhA1Tah+2ZgzgScYQ\nZ2EB9dLwDZWGI/n/bl+8qA==\n-----END PRIVATE KEY-----\n",
    client_email:
      "starpops-management@starpops-management.iam.gserviceaccount.com",
    client_id: "115839709596547141702",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/starpops-management%40starpops-management.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSetup = async () => {
    if (!sheetId) {
      setMessage("Please fill in the sheet ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/setup-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetId,
          credentials: JSON.stringify(credentials),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ Google Sheets connected! All tables and columns created automatically. Add these env vars to Vercel Vars section: NEXT_PUBLIC_GOOGLE_SHEET_ID and GOOGLE_SHEETS_CREDENTIALS"
        );
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
      <h2 className="text-lg font-semibold mb-4">Connect Google Sheets</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Google Sheet ID (from URL)
          </label>
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="1abc2def3ghi4jkl5mno6pqr7stu8vwx"
            className="w-full px-3 py-2 border border-amber-300 rounded-md"
          />
        </div>

        <div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Account Credentials
            </label>
            <div className="w-full px-3 py-2 border border-amber-300 rounded-md bg-gray-50">
              ✓ Service account configured
            </div>
          </div>
        </div>

        <Button onClick={handleSetup} disabled={loading}>
          {loading ? "Setting up..." : "Connect & Auto-Setup Google Sheets"}
        </Button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-4 p-3 bg-white rounded border border-amber-200 text-sm">
          <p className="font-medium mb-2">What happens when you connect:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Creates 6 sheets automatically: Sales, Expenses, Withdrawals,
              Summary, and Losses
            </li>
            <li>Adds all column headers to each sheet</li>
            <li>Preserves existing data in all sheets</li>
            <li>Only creates new sheets if they don't exist</li>
            <li>All data syncs in real-time to your Google Sheet</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
