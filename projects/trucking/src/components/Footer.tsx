import React from 'react'
import { Truck, Facebook, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary-800 dark:bg-gray-900 text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <Truck size={32} className="mr-2 text-primary-300 dark:text-primary-400" />
              <span className="text-2xl font-bold">TruckMasters Logistics</span>
            </div>
            <p className="text-sm text-primary-200 dark:text-primary-300">Delivering excellence in trucking services since 2003.</p>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-primary-300 dark:text-primary-400">Quick Links</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#services" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors">Services</a></li>
              <li className="mb-2"><a href="#about" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors">About Us</a></li>
              <li className="mb-2"><a href="#contact" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-primary-300 dark:text-primary-400">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors"><Twitter size={24} /></a>
              <a href="#" className="hover:text-primary-300 dark:hover:text-primary-400 transition-colors"><Linkedin size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-700 dark:border-gray-700 mt-8 pt-8 text-sm text-center text-primary-300 dark:text-primary-400">
          <p>&copy; 2024 TruckMasters Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer