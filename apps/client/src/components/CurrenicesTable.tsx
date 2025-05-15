import React from 'react'
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

const CurrenciesTable = async () => {
  const data = await fetch('http://localhost:5000/currency/')
  const currencies = await data.json()
  console.log(currencies)
  if (!currencies) {
    return <div>Loading...</div>
  }
  return (
    <div className='flex flex-col w-full gap-3 text-start'>
      <Table className='w-full'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Курс</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency: Currency) => (
            <TableRow key={currency.id}>
              <TableCell className="font-medium">{currency.id}</TableCell>
              <TableCell>{currency.name}</TableCell>
              <TableCell>{currency.exchangeRates[0]?.rate ?? 'Відсутня'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CurrenciesTable