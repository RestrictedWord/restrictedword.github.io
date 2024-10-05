import React from 'react'
import { Truck, Package, Clock } from 'lucide-react'

const Services = () => {
  const services = [
    { icon: <Truck size={48} />, title: 'Long-Haul Transport', description: 'Efficient cross-country deliveries' },
    { icon: <Package size={48} />, title: 'Specialized Cargo', description: 'Handling of delicate and oversized items' },
    { icon: <Clock size={48} />, title: 'Time-Critical Shipments', description: 'Express delivery for urgent cargo' },
  ]

  return (
    <section id="services" className="py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-800 dark:text-primary-200">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 text-center p-8 rounded-lg shadow-custom transform hover:scale-105 transition-transform duration-300">
              <div className="text-primary-600 dark:text-primary-400 mb-6 flex justify-center">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-primary-800 dark:text-primary-200">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services