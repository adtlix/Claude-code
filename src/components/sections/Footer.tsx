import { Zap, Link2, GitBranch, Briefcase } from 'lucide-react'
import WaitlistForm from '@/components/shared/WaitlistForm'

export default function Footer() {
  return (
    <footer className="bg-[#070709] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Higgsfield</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              The most advanced AI video generation platform. Turn your imagination into cinematic reality.
            </p>
            <div className="flex gap-4">
              {[Link2, GitBranch, Briefcase].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              {['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              {['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 Higgsfield AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <WaitlistForm compact />
          </div>
        </div>
      </div>
    </footer>
  )
}
