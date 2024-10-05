import React from 'react'

const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Trucking team" className="rounded-lg shadow-custom" />
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-bold mb-6 text-primary-800 dark:text-primary-200">About TruckMasters Logistics</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              With over 20 years of experience in the trucking industry, TruckMasters Logistics has built a reputation for reliability, efficiency, and customer satisfaction.
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Our fleet of modern trucks and team of skilled drivers ensure that your cargo reaches its destination safely and on time, every time.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We pride ourselves on our commitment to safety, sustainability, and cutting-edge logistics solutions that meet the evolving needs of our clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About