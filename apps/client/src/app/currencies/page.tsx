import CurrenciesTable from '@/components/CurrenicesTable'
import React from 'react'

const CurrenciesPage = () => {
  return (
    <main className='flex-auto'>
      <section>
        <div className="container team-container">
          <h2>Валюти</h2>
          <div className="team-cards-container">
            <CurrenciesTable />
          </div>
        </div>
      </section>
    </main>
  )
}

export default CurrenciesPage