import { useState } from 'react'
import axios from 'axios'

export default function CreateCurrencyForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        console.log({
            name
        })

      await axios.post('http://localhost:5000/currency', {
        name
      })
      setName('')
      onSuccess()
    } catch (err) {
      console.error('Помилка при створенні:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-4">
      <input
        className="border px-2 py-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Назва"
        required
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-1">
        Додати
      </button>
    </form>
  )
}
