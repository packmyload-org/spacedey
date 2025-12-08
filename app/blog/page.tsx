import BlogHero from '@/components/blog/BlogHero'
import BlogList from '@/components/blog/BlogList'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Header />
      <BlogHero />
      <BlogList/>
      <Footer />
    </div>
  )
}


