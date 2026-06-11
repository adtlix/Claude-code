import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Features from './components/Features'
import Specs from './components/Specs'
import Showcase from './components/Showcase'
import CTA from './components/CTA'
import Footer from './components/Footer'
import './app.css'

// The WebGL scene is heavy — load it lazily so first paint stays instant.
const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  return (
    <>
      <div className="app-bg" />
      <Nav />
      <main>
        <Hero scene={
          <Suspense fallback={<div className="canvas-fallback" />}>
            <Scene />
          </Suspense>
        } />
        <Marquee />
        <Features />
        <Specs />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
