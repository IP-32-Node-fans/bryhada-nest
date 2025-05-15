import { navLinks } from '@/lib/navLinks'
import React from 'react'
const Footer = () => {
  return (
    <footer className='w-full'>
      <div className="container footer-container flex flex-col gap-6">
        <h3>
          Розроблено в межах курсу &apos;Основи розроблення ПЗ на платформі{' '}
          <a href="https://nodejs.org" target="_blank" className="node-link"
            >Node.js</a>&apos;
        </h3>
        <nav>
          <ul className='flex gap-4 justify-center'>
            {navLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url}>{link.name}</a>
              </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer