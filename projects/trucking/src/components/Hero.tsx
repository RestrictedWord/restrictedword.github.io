import React from 'react'

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-screen flex items-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 text-white relative z-10">
        <h2 className="text-5xl font-bold mb-4 animate-fade-in">Reliable Trucking Solutions</h2>
        <p className="text-xl mb-8 animate-slide-in">Delivering your cargo safely and on time, every time.</p>
        <a href="#contact" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 animate-slide-in">
          Get a Quote
        </a>
      </div>
    </section>
  )
}

export default Hero