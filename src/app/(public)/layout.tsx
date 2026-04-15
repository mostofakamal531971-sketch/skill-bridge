import { Footer } from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { Navbar } from '@/components/Navbar'
import ScrollToTop from '@/features/public-pages/ScrollToTop'
import React from 'react'

const HomeLayout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <main className='w-full'>
      <Navbar />
      {children}

      <Footer />
    </main>
  )
}

export default HomeLayout
