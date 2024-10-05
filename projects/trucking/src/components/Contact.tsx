import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-800 dark:text-primary-200">Contact Us</h2>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <form className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-custom">
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-primary-800 dark:text-primary-200">Name</label>
                <input type="text" id="name" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-primary-800 dark:text-primary-200">Email</label>
                <input type="email" id="email" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-primary-800 dark:text-primary-200">Message</label>
                <textarea id="message" rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"></textarea>
              </div>
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">
                Send Message
              </button>
            </form>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-custom h-full">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6 text-primary-800 dark:text-primary-200">Contact Information</h3>
                <div className="flex items-center mb-4">
                  <Phone size={24} className="mr-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center mb-4">
                  <Mail size={24} className="mr-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">info@truckmasters.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={24} className="mr-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-700 dark:text-gray-300">123 Logistics Ave, Truckville, TX 12345</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-primary-800 dark:text-primary-200">Business Hours</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Saturday: 9:00 AM - 2:00 PM</p>
                <p className="text-gray-700 dark:text-gray-300">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact