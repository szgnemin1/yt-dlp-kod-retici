
import React from 'react';
import { Platform } from '../types';
import { Youtube, Instagram, Twitter, Twitch, Video, Globe, ArrowRight, Download, Terminal, FolderOpen, Play } from 'lucide-react';

interface PlatformSelectorProps {
  onSelect: (p: Platform) => void;
  onDownloadScript: () => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect, onDownloadScript }) => {
  const platforms: { id: Platform; name: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-8 h-8" />,
      color: 'hover:border-red-500 hover:bg-red-500/10 hover:text-red-400',
      desc: 'Video, Müzik, Shorts, Playlist'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-8 h-8" />,
      color: 'hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400',
      desc: 'Reels, Stories, Gönderiler'
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: <Twitch className="w-8 h-8" />,
      color: 'hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-400',
      desc: 'Klipler, Geçmiş Yayınlar (VOD)'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Video className="w-8 h-8" />,
      color: 'hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400',
      desc: 'Filigransız Videolar'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: <Twitter className="w-8 h-8" />,
      color: 'hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400',
      desc: 'Kısa Videolar, GIF'
    },
    {
      id: 'other',
      name: 'Diğer / Genel',
      icon: <Globe className="w-8 h-8" />,
      color: 'hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400',
      desc: 'Udemy, Vimeo ve 1000+ site'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-500 space-y-16">
      
      {/* Platform Grid */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Hangi platformdan indireceksiniz?</h2>
          <p className="text-gray-400">
            En doğru ayarları ve komutları oluşturmak için lütfen kaynağı seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`group flex flex-col items-center justify-center p-8 bg-yt-panel border border-yt-border rounded-2xl transition-all duration-300 ${p.color}`}
            >
              <div className="mb-4 text-gray-300 group-hover:scale-110 transition-transform duration-300">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.desc}</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono flex items-center gap-1">
                SEÇ <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Setup Guide Section */}
      <div className="border-t border-gray-800 pt-12">
        <div className="bg-[#151515] border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Terminal className="w-64 h-64 text-emerald-500" />
           </div>
           
           <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">İlk Kez mi Kullanıyorsunuz?</h3>
                  <p className="text-gray-400 max-w-xl">
                    Bu site size gerekli komutları üretir, ancak indirme işlemini bilgisayarınızda yapmanız gerekir. 
                    <span className="text-emerald-400 font-medium"> yt-dlp</span> ve <span className="text-emerald-400 font-medium">ffmpeg</span> kurulumunu sizin için otomatikleştirdik.
                  </p>
                </div>
                <button 
                  onClick={onDownloadScript}
                  className="shrink-0 flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs font-normal opacity-80">Otomatik Kurulum</div>
                    <div className="text-sm">kurulumu_baslat.bat İndir</div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="bg-black/30 p-5 rounded-xl border border-gray-800/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Download className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">1. İndir</h4>
                  <p className="text-sm text-gray-500">Sağ üstteki butona tıklayıp <code className="bg-gray-800 px-1 rounded text-gray-300">.bat</code> dosyasını bilgisayarınıza indirin.</p>
                </div>

                {/* Step 2 */}
                <div className="bg-black/30 p-5 rounded-xl border border-gray-800/50">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Play className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">2. Çalıştır</h4>
                  <p className="text-sm text-gray-500">İndirdiğiniz dosyaya çift tıklayın. Gerekli tüm araçları (yt-dlp, ffmpeg) internetten indirip kuracaktır.</p>
                </div>

                {/* Step 3 */}
                <div className="bg-black/30 p-5 rounded-xl border border-gray-800/50">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                    <FolderOpen className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">3. Klasörü Aç</h4>
                  <p className="text-sm text-gray-500">Masaüstünüzde oluşan <code className="bg-gray-800 px-1 rounded text-gray-300">ARŞİV</code> klasörüne girin ve adres çubuğuna <code className="text-yellow-400">cmd</code> yazıp Enter'a basın.</p>
                </div>

                {/* Step 4 */}
                <div className="bg-black/30 p-5 rounded-xl border border-gray-800/50">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <Terminal className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">4. Komutu Yapıştır</h4>
                  <p className="text-sm text-gray-500">Yukarıdaki platformlardan birini seçin, linkinizi yapıştırın ve oluşan komutu siyah ekrana yapıştırın.</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
