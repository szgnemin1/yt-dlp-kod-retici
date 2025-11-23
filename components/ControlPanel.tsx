
import React, { useState } from 'react';
import { CommandOptions, FormatType, Container, VideoQuality, Platform } from '../types';
import { 
  Settings, Film, Music, FileVideo, Type, 
  Image as ImageIcon, FileDigit, ListX, AlertCircle, 
  ListOrdered, Scissors, Calendar, Gauge, ShieldCheck, Layers, MonitorPlay, Info, ChevronDown, ChevronUp, Sliders
} from 'lucide-react';

interface ControlPanelProps {
  options: CommandOptions;
  setOptions: React.Dispatch<React.SetStateAction<CommandOptions>>;
  platform: Platform;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions, platform }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleChange = (key: keyof CommandOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Format değiştiğinde varsayılan konteyneri ayarla
  const handleFormatChange = (newFormat: FormatType) => {
    let newContainer = options.container;
    
    const isAudioTarget = newFormat === FormatType.AUDIO_ONLY;
    const currentIsAudio = [Container.MP3, Container.M4A, Container.FLAC].includes(options.container);

    if (isAudioTarget && !currentIsAudio) {
       newContainer = Container.MP3;
    } else if (!isAudioTarget && currentIsAudio) {
       newContainer = Container.MP4;
    }

    setOptions(prev => ({ ...prev, formatType: newFormat, container: newContainer }));
  };

  const handleContainerChange = (val: string) => {
    handleChange('container', val as Container);
  };

  const handleQualityChange = (val: string) => {
    handleChange('videoQuality', val as VideoQuality);
  };

  const toggleSponsorCategory = (cat: string) => {
    setOptions(prev => {
      const current = prev.sponsorCategories;
      if (current.includes(cat)) {
        return { ...prev, sponsorCategories: current.filter(c => c !== cat) };
      } else {
        return { ...prev, sponsorCategories: [...current, cat] };
      }
    });
  };

  // Platform Feature Flags
  const showQualitySelector = ['youtube', 'twitch', 'other'].includes(platform);
  const showSponsorBlock = platform === 'youtube';
  const showChapters = platform === 'youtube';
  const showSubtitles = ['youtube', 'twitch', 'other'].includes(platform);
  const showDateFilters = ['youtube', 'twitch'].includes(platform);
  const showPlaylist = ['youtube', 'instagram', 'other'].includes(platform); // Instagram carousel is like playlist

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Format Selection - ALWAYS VISIBLE */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
          <Settings className="w-4 h-4" /> Temel Ayarlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleFormatChange(FormatType.VIDEO_AUDIO)}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
              options.formatType === FormatType.VIDEO_AUDIO
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-yt-panel border-yt-border text-gray-400 hover:border-gray-600 hover:bg-white/5'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="font-medium text-sm">Video + Ses</span>
          </button>
          <button
            onClick={() => handleFormatChange(FormatType.AUDIO_ONLY)}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
              options.formatType === FormatType.AUDIO_ONLY
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-yt-panel border-yt-border text-gray-400 hover:border-gray-600 hover:bg-white/5'
            }`}
          >
            <Music className="w-5 h-5" />
            <span className="font-medium text-sm">Sadece Ses</span>
          </button>
          <button
            onClick={() => handleFormatChange(FormatType.VIDEO_ONLY)}
            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
              options.formatType === FormatType.VIDEO_ONLY
                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-yt-panel border-yt-border text-gray-400 hover:border-gray-600 hover:bg-white/5'
            }`}
          >
            <FileVideo className="w-5 h-5" />
            <span className="font-medium text-sm">Sadece Video</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Konteyner (Uzantı)</label>
            <select
              value={options.container}
              onChange={(e) => handleContainerChange(e.target.value)}
              className="w-full bg-yt-dark border border-yt-border rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-shadow"
            >
              {options.formatType !== FormatType.AUDIO_ONLY ? (
                <>
                  <option value={Container.MP4}>MP4 (Tavsiye Edilen)</option>
                  <option value={Container.MKV}>MKV (Matroska)</option>
                  <option value={Container.WEBM}>WEBM</option>
                </>
              ) : (
                <>
                  <option value={Container.MP3}>MP3</option>
                  <option value={Container.M4A}>M4A (AAC)</option>
                  <option value={Container.FLAC}>FLAC</option>
                </>
              )}
            </select>
          </div>

          {options.formatType !== FormatType.AUDIO_ONLY && showQualitySelector && (
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 ml-1 flex items-center gap-1">
                 <MonitorPlay className="w-3 h-3" /> Kalite Limiti
              </label>
              <select
                value={options.videoQuality}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="w-full bg-yt-dark border border-yt-border rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-shadow"
              >
                <option value={VideoQuality.BEST}>En İyi (Limit Yok)</option>
                <option value={VideoQuality.Q4K}>Maks 4K (2160p)</option>
                <option value={VideoQuality.Q2K}>Maks 2K (1440p)</option>
                <option value={VideoQuality.Q1080}>Maks 1080p</option>
                <option value={VideoQuality.Q720}>Maks 720p</option>
                <option value={VideoQuality.Q480}>Maks 480p</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Playlist Settings - Visible if relevant */}
      {showPlaylist && (
        <div className="space-y-3 pt-2 border-t border-gray-800">
           <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
            <ListOrdered className="w-4 h-4" /> Listeler
          </h3>
          <div className="space-y-3">
             <Toggle 
              label={platform === 'instagram' ? "Sadece Kapak Görseli/Videosu (Playlist Yok)" : "Sadece Videoyu İndir (Playlist'i Yoksay)"}
              icon={<ListX className="w-4 h-4"/>}
              checked={options.noPlaylist} 
              onChange={(v) => handleChange('noPlaylist', v)} 
            />
            
            {!options.noPlaylist && (
              <div className="p-3 bg-yt-dark/50 border border-yt-border rounded-lg">
                   <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Hangi Öğeler?</label>
                   <input 
                      type="text" 
                      placeholder="örn. 1,2,5,10-15"
                      value={options.playlistItems}
                      onChange={(e) => handleChange('playlistItems', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-yt-border rounded p-2 text-sm text-gray-300 focus:border-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-600 mt-1">
                      {platform === 'instagram' ? "Kaydırmalı posttaki belirli slaytlar." : "Listeden belirli videoları indirmek için."}
                    </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COLLAPSIBLE ADVANCED SECTION */}
      <div className="border-t border-gray-800 pt-4">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-gray-400 hover:text-white transition-colors py-2 group"
        >
          <span className="flex items-center gap-2 font-medium text-sm">
            <Sliders className="w-4 h-4" /> Gelişmiş Ayarlar & Araçlar
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />}
        </button>

        {showAdvanced && (
          <div className="space-y-6 pt-4 animate-in slide-in-from-top-2 duration-300">
            
            {/* PRO FEATURES */}
            {(showSponsorBlock || showChapters || showDateFilters) && (
              <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide flex items-center gap-2">
                  <Scissors className="w-3 h-3" /> Pro Tools
                </h3>

                {/* SponsorBlock */}
                {showSponsorBlock && (
                  <div className="space-y-3">
                    <Toggle 
                      label="SponsorBlock (Sponsorları Atla)" 
                      icon={<ShieldCheck className="w-4 h-4"/>}
                      checked={options.removeSponsors} 
                      onChange={(v) => handleChange('removeSponsors', v)} 
                      color="purple"
                    />
                    {options.removeSponsors && (
                      <div className="pl-4 grid grid-cols-2 gap-2">
                          {['sponsor', 'intro', 'outro', 'selfpromo'].map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-1 rounded transition">
                              <input 
                                type="checkbox" 
                                checked={options.sponsorCategories.includes(cat)}
                                onChange={() => toggleSponsorCategory(cat)}
                                className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-800"
                              />
                              <span className="text-xs text-gray-400 capitalize">{cat}</span>
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Split Chapters */}
                {showChapters && (
                  <Toggle 
                    label="Bölümlere Ayır (Split Chapters)" 
                    icon={<Layers className="w-4 h-4"/>}
                    checked={options.splitChapters} 
                    onChange={(v) => handleChange('splitChapters', v)} 
                    color="purple"
                  />
                )}

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-purple-500/10">
                  {showDateFilters && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-purple-400/70 font-bold">Tarih Aralığı</label>
                      <div className="flex gap-2">
                        <input 
                            type="date" 
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded p-1.5 text-xs text-gray-300"
                            value={options.dateAfter}
                            onChange={(e) => handleChange('dateAfter', e.target.value)}
                        />
                        <input 
                            type="date" 
                            className="w-full bg-[#0a0a0a] border border-gray-700 rounded p-1.5 text-xs text-gray-300"
                            value={options.dateBefore}
                            onChange={(e) => handleChange('dateBefore', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-purple-400/70 font-bold">Limitler</label>
                    <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Max MB (500M)"
                          className="w-1/2 bg-[#0a0a0a] border border-gray-700 rounded p-1.5 text-xs text-gray-300"
                          value={options.maxFileSize}
                          onChange={(e) => handleChange('maxFileSize', e.target.value)}
                      />
                      <input 
                          type="text" 
                          placeholder="Hız (5M)"
                          className="w-1/2 bg-[#0a0a0a] border border-gray-700 rounded p-1.5 text-xs text-gray-300"
                          value={options.rateLimit}
                          onChange={(e) => handleChange('rateLimit', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Processing & Metadata */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <FileDigit className="w-3 h-3" /> Metadata & Dosya
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Toggle 
                  label="Thumbnail Göm" 
                  icon={<ImageIcon className="w-4 h-4"/>}
                  checked={options.embedThumbnail} 
                  onChange={(v) => handleChange('embedThumbnail', v)} 
                />
                <Toggle 
                  label="Metadata Ekle" 
                  icon={<ListX className="w-4 h-4"/>}
                  checked={options.metadata} 
                  onChange={(v) => handleChange('metadata', v)} 
                />
                
                {options.formatType !== FormatType.AUDIO_ONLY && showSubtitles && (
                  <>
                    <Toggle 
                      label="Altyazı Göm" 
                      icon={<Type className="w-4 h-4"/>}
                      checked={options.embedSubs} 
                      onChange={(v) => handleChange('embedSubs', v)} 
                    />
                    <Toggle 
                      label="Otomatik Çeviri" 
                      icon={<Type className="w-4 h-4"/>}
                      checked={options.autoSubs} 
                      onChange={(v) => handleChange('autoSubs', v)} 
                      disabled={!options.embedSubs}
                    />
                  </>
                )}
                
                 <Toggle 
                  label="Dosya Adını Temizle (ASCII)" 
                  icon={<AlertCircle className="w-4 h-4"/>}
                  checked={options.restrictFilenames} 
                  onChange={(v) => handleChange('restrictFilenames', v)} 
                />
              </div>
            </div>

            {/* Cookies & Template */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1 flex items-center gap-2">
                  Cookies (Tarayıcı) <Info className="w-3 h-3 text-gray-500"/>
                </label>
                <input 
                  type="text" 
                  placeholder="örn. chrome, firefox, edge"
                  value={options.cookiesFromBrowser}
                  onChange={(e) => handleChange('cookiesFromBrowser', e.target.value)}
                  className="w-full bg-yt-dark border border-yt-border rounded p-2 text-sm text-gray-300 focus:border-emerald-500 focus:outline-none"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  Üyelik gerektiren videolar için gereklidir.
                </p>
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Dosya Adı Şablonu</label>
                <input 
                  type="text" 
                  value={options.outputTemplate}
                  onChange={(e) => handleChange('outputTemplate', e.target.value)}
                  className="w-full bg-yt-dark border border-yt-border rounded p-2 text-sm text-gray-300 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

// Helper Components
const Toggle: React.FC<{ 
  label: string; 
  checked: boolean; 
  onChange: (val: boolean) => void; 
  icon?: React.ReactNode;
  disabled?: boolean;
  color?: 'green' | 'purple';
}> = ({ label, checked, onChange, icon, disabled, color = 'green' }) => {
  
  const activeBorder = color === 'green' ? 'border-emerald-600/50' : 'border-purple-600/50';
  const activeBg = color === 'green' ? 'bg-emerald-900/10' : 'bg-purple-900/10';
  const activeText = color === 'green' ? 'text-emerald-400' : 'text-purple-400';
  const activeTextMain = color === 'green' ? 'text-emerald-100' : 'text-purple-100';
  const activeKnob = color === 'green' ? 'bg-emerald-500' : 'bg-purple-500';

  return (
    <div 
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer select-none transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed border-transparent' : 
        checked ? `${activeBg} ${activeBorder}` : 'bg-yt-dark border-yt-border hover:border-gray-600 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`text-gray-400 ${checked ? activeText : ''}`}>
          {icon}
        </div>
        <span className={`text-xs sm:text-sm font-medium ${checked ? activeTextMain : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${checked ? activeKnob : 'bg-gray-700'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'left-4.5' : 'left-0.5'}`} style={{ left: checked ? '1.1rem' : '0.15rem'}} />
      </div>
    </div>
  );
};
