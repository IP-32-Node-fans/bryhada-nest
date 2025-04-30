import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full'>
      <div className="container footer-container">
        <h5>
          Розроблено в межах курсу &apos;Основи розроблення ПЗ на платформі{' '}
          <a href="https://nodejs.org" target="_blank" className="node-link"
            >Node.js</a>&apos;
        </h5>
      </div>
    </footer>
  )
}

export default Footer