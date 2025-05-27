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
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

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

interface PaginationMeta {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface PaginatedResponse {
  data: Currency[]
  meta: PaginationMeta
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
  const [newCurrencyName, setNewCurrencyName] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [nameFilter, setNameFilter] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("role") === "ADMIN"

  const fetchCurrencies = async (page = 1, limit = itemsPerPage, name = nameFilter) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      // Будуємо URL з параметрами
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (name.trim()) {
        params.append('name', name.trim())
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/currency?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        }
      )

      if (!res.ok) {
        console.error("API error:", res.status)
        return
      }

      const response: PaginatedResponse = await res.json()
      
      setCurrencies(response.data)
      setCurrentPage(response.meta.currentPage)
      setItemsPerPage(response.meta.itemsPerPage)
      setTotalPages(response.meta.totalPages)
      setTotalItems(response.meta.totalItems)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies(1, itemsPerPage, nameFilter)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      fetchCurrencies(newPage, itemsPerPage, nameFilter)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
    fetchCurrencies(1, newLimit, nameFilter)
  }

  const handleSearch = () => {
    setNameFilter(searchValue)
    setCurrentPage(1)
    fetchCurrencies(1, itemsPerPage, searchValue)
  }

  const handleClearSearch = () => {
    setSearchValue("")
    setNameFilter("")
    setCurrentPage(1)
    fetchCurrencies(1, itemsPerPage, "")
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleAddCurrency = async () => {
    if (!newCurrencyName.trim()) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/currency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({ name: newCurrencyName.trim() }),
      })
      if (res.ok) {
        setNewCurrencyName("")
        await fetchCurrencies(currentPage, itemsPerPage, nameFilter)
      }
    } catch (e) {
      console.error("Не вдалося додати валюту:", e)
    }
  }

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
    setEditedName("")
    setEditedRate("")
    setShowHistory(false)
    setHistory(null)
    setNewCurrencyName("")
  }

  const confirmAction = async () => {
    const token = localStorage.getItem("token")
    if (!selectedCurrency) return

    if (modalType === "edit") {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/currency/${selectedCurrency.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editedName }),
      })

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/currency/rates`, {
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
      closeModal()
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/currency`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: selectedCurrency.name }),
      })
      closeModal()
    }

    await fetchCurrencies(currentPage, itemsPerPage, nameFilter)
  }

  const fetchHistory = async (currency: Currency) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/currency/rates/${currency.id}/2023-01-01/2025-12-31`,
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
    <div className="flex flex-col w-full gap-4 text-start">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center flex-1">
          <Input
            placeholder="Пошук за назвою валюти..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          {nameFilter && (
            <Button onClick={handleClearSearch} variant="ghost" size="sm">
              Очистити
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="limit" className="text-sm">Показати:</Label>
          <select
            id="limit"
            value={itemsPerPage}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Нова валюта"
            value={newCurrencyName}
            onChange={(e) => setNewCurrencyName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddCurrency}>Додати</Button>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Показано {currencies.length} з {totalItems} валют
        {nameFilter && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            Фільтр: {nameFilter}
          </span>
        )}
      </div>

      {/* Таблиця */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Курс</TableHead>
            <TableHead>Дата</TableHead>
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
              <TableCell>{currency.exchangeRates?.[0]?.date ?? "—"}</TableCell>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Попередня
            </Button>
            
            <div className="flex items-center gap-1">
              {currentPage > 3 && (
                <>
                  <Button
                    onClick={() => handlePageChange(1)}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page >= Math.max(1, currentPage - 2) && 
                  page <= Math.min(totalPages, currentPage + 2)
                )
                .map(page => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
              
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                  <Button
                    onClick={() => handlePageChange(totalPages)}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              variant="outline"
              size="sm"
            >
              Наступна
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Сторінка {currentPage} з {totalPages}
          </div>
        </div>
      )}

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