'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import CreateCurrencyForm from './CreateCurrencyForm'
import CurrencyRow from './CurrencyRow'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface Rate {
  date: string
  rate: number
}

interface Currency {
  id: number
  name: string
  exchangeRates: Rate[]
}

export default function CurrenciesTable() {
  const [currencies, setCurrencies] = useState<Currency[]>([])

  const fetchCurrencies = async () => {
    const res = await axios.get('http://localhost:5000/currency')
    setCurrencies(res.data)
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  return (
    <div className="flex flex-col w-full gap-3 text-start">
      <CreateCurrencyForm onSuccess={fetchCurrencies} />
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Курс</TableHead>
            <TableHead>Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => (
            <CurrencyRow
              key={currency.id}
              id={currency.id}
              name={currency.name}
              rate={currency.exchangeRates?.[0]?.rate ?? 0}
              onChange={fetchCurrencies}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
