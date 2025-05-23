'use client'

import axios from 'axios'
import { useState } from 'react'

interface Props {
  id: number
  name: string
  rate: number
  onChange: () => void
}

export default function CurrencyRow({ id, name, rate, onChange }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const [editedRate, setEditedRate] = useState(rate.toString())

  const handleDelete = async () => {
    await axios.delete('http://localhost:5000/currency', {
      data: { name },
    })
    onChange()
  }

  const handleSave = async () => {
    // 1. Оновлення назви (PUT)
    await axios.put(`http://localhost:5000/currency/${id}`, {
      name: editedName.trim(),
    })

    // 2. Додавання нового курсу (POST)
    await axios.post(`http://localhost:5000/currency/rates`, {
      currencyId: id, // 👈 правильно
      rate: parseFloat(editedRate),
      date: new Date().toISOString().split('T')[0],
    })


    setEditMode(false)
    onChange()
  }

  return (
    <tr className="border-t">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {editMode ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border px-1 py-0.5"
          />
        ) : (
          name
        )}
      </td>
      <td className="p-2">
        {editMode ? (
          <input
            value={editedRate}
            onChange={(e) => setEditedRate(e.target.value)}
            type="number"
            className="border px-1 py-0.5"
          />
        ) : (
          rate
        )}
      </td>
      <td className="p-2 flex gap-2">
        {editMode ? (
          <button onClick={handleSave} className="bg-blue-500 text-white px-2">💾</button>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-yellow-400 text-black px-2">✏️</button>
        )}
        <button onClick={handleDelete} className="bg-red-500 text-white px-2">🗑️</button>
      </td>
    </tr>
  )
}
