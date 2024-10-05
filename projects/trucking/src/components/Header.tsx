import React, { useState, useEffect } from 'react'
import { Truck, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-800 text-primary-800 dark:text-white shadow-md' : 'bg-transparent text-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Truck size={32} className={`mr-2 ${isScrolled ? 'text-primary-600 dark:text-primary-400' : 'text-white'}`} />
          <h1 className="text-2xl font-bold">TruckMasters Logistics</h1>
        </div>
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            <li><a href="#services" className="hover:text-primary-300 transition-colors">Services</a></li>
            <li><a href="#about" className="hover:text-primary-300 transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-primary-300 transition-colors">Contact</a></li>
          </ul>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header