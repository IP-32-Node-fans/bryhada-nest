"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Rate {
  date: string
  rate: number
  id: number
  name: string
}

interface Currency {
  id: number
  name: string
  exchangeRates: Rate[]
}

export default function CurrenciesTable() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [modalType, setModalType] = useState<"edit" | "delete">("edit")
  const [editedName, setEditedName] = useState("")
  const [editedRate, setEditedRate] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<Rate[] | null>(null)

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("role") === "ADMIN"

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/currency", {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          console.error("API error:", data)
          return
        }

        setCurrencies(data)
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  const openModal = (currency: Currency, type: "edit" | "delete") => {
    setSelectedCurrency(currency)
    setModalType(type)
    setEditedName(currency.name)
    setEditedRate(currency.exchangeRates?.[0]?.rate.toString() ?? "")
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedCurrency(null)
  }

  const confirmAction = async () => {
    const token = localStorage.getItem("token")
    if (!selectedCurrency) return

    if (modalType === "edit") {
      await fetch(`http://localhost:5000/currency/${selectedCurrency.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editedName }),
      })

      await fetch(`http://localhost:5000/currency/rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currencyId: selectedCurrency.id,
          rate: parseFloat(editedRate),
          date: new Date().toISOString().split("T")[0],
        }),
      })
    } else {
      await fetch(`http://localhost:5000/currency`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: selectedCurrency.name }),
      })
    }

    location.reload()
  }

  const fetchHistory = async (currency: Currency) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `http://localhost:5000/currency/rates/${currency.id}/2023-01-01/2025-12-31`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        }
      )
      const data = await res.json()
      setHistory(data)
      setSelectedCurrency(currency)
      setShowHistory(true)
    } catch (e) {
      console.error("Не вдалося отримати історію:", e)
    }
  }

  if (loading) return <div className="text-center py-4">Завантаження...</div>

  return (
    <div className="flex flex-col w-full gap-3 text-start">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Курс</TableHead>
            {isAdmin && <TableHead>Дії</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => (
            <TableRow key={currency.id}>
              <TableCell className="font-medium">{currency.id}</TableCell>
              <TableCell
                className="text-blue-600 cursor-pointer underline"
                onClick={() => fetchHistory(currency)}
              >
                {currency.name}
              </TableCell>
              <TableCell>{currency.exchangeRates?.[0]?.rate ?? "—"}</TableCell>
              {isAdmin && (
                <TableCell className="flex gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => openModal(currency, "edit")}
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => openModal(currency, "delete")}
                  >
                    🗑️
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {modalType === "edit" ? "Редагувати валюту" : "Видалити валюту"}
            </h2>
            {modalType === "edit" ? (
              <div className="flex flex-col gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="name">Назва</Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="rate">Курс</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={editedRate}
                    onChange={(e) => setEditedRate(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <p className="mb-4">
                Ви впевнені, що хочете видалити валюту "{selectedCurrency?.name}"?
              </p>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={closeModal}>Скасувати</Button>
              <Button variant="destructive" onClick={confirmAction}>
                Підтвердити
              </Button>
            </div>
          </div>
        </div>
      )}

      {showHistory && history && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md max-h-[80vh] overflow-y-auto w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Історія курсу для {selectedCurrency?.name}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Курс</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((rate, i) => (
                  <TableRow key={i}>
                    <TableCell>{rate.date}</TableCell>
                    <TableCell>{rate.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-end mt-4">
              <Button onClick={() => setShowHistory(false)}>Закрити</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}