'use client'

import { useRef, useEffect, useState } from 'react'
import { Wand2, Image, Clapperboard, Palette, Download, Code2 } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'Text to Video',
    description: 'Describe your vision in plain text and watch it come to life in seconds. No technical skills needed.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Image,
    title: 'Image to Video',
    description: 'Upload any image and transform it into a dynamic, cinematic video with fluid motion.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Clapperboard,
    title: 'Motion Control',
    description: 'Fine-tune camera movements, pacing, and transitions with professional-grade controls.',
    color: 'from-teal-500 to-teal-700',
  },
  {
    icon: Palette,
    title: 'Style Transfer',
    description: 'Apply any artistic style — cinematic, anime, oil painting, watercolor — to your videos instantly.',
    color: 'from-rose-500 to-rose-700',
  },
  {
    icon: Download,
    title: '4K Export',
    description: 'Export your videos in stunning 4K resolution, ready for any platform or screen.',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: Code2,
    title: 'API Access',
    description: 'Integrate Higgsfield AI directly into your apps with our powerful, developer-friendly REST API.',
    color: 'from-indigo-500 to-indigo-700',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-32 px-6 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block bg-purple-600/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm font-medium mb-6">
            Everything you need
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The complete AI video
            <br />
            <span className="text-gradient">creation studio</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Professional tools that make video creation effortless — from idea to finished video in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`card-hover bg-white/3 border border-white/8 rounded-2xl p-8 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feat.color} rounded-xl flex items-center justify-center mb-6`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feat.title}</h3>
              <p className="text-white/50 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
