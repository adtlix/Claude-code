import { useState } from 'react'
import BootScreen from './components/BootScreen'
import Taskbar from './components/Taskbar'
import Desktop from './components/Desktop'
import Dock from './components/Dock'
import Scene3D from './three/Scene'

export default function App() {
  const [booting, setBooting] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  const handleBootDone = () => {
    setFadeOut(true)
    setTimeout(() => setBooting(false), 800)
  }

  return (
    <>
      {/* Scanlines & corner accents (always visible) */}
      <div className="scanlines" />
      <div className="corner-accent tl" />
      <div className="corner-accent tr" />
      <div className="corner-accent bl" />
      <div className="corner-accent br" />

      {/* Boot overlay */}
      {booting && (
        <BootScreen onDone={handleBootDone} fadingOut={fadeOut} />
      )}

      {/* OS interface (renders behind boot, appears when boot fades) */}
      <div className="os-root" style={{ opacity: booting && !fadeOut ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <Scene3D />
        <div className="os-ui">
          <Taskbar />
          <Desktop />
          <Dock />
        </div>
      </div>
    </>
  )
}
