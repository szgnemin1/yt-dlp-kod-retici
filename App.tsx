import React, { useState, useEffect } from 'react';
import { CommandOptions, FormatType, Container, VideoQuality, Platform } from './types';
import { ControlPanel } from './components/ControlPanel';
import { CommandTerminal } from './components/CommandTerminal';
import { PlatformSelector } from './components/PlatformSelector';
import { Command, Zap, Globe, AlertTriangle, ArrowLeft, Info, RotateCcw, AlertCircle } from 'lucide-react';

const DEFAULT_OPTIONS: CommandOptions = {
  url: '',
  formatType: FormatType.VIDEO_AUDIO,
  videoQuality: VideoQuality.BEST,
  container: Container.MP4,
  embedThumbnail: true,
  embedSubs: false,
  autoSubs: false,
  metadata: true,
  restrictFilenames: true,
  ignoreErrors: false,
  
  noPlaylist: false,
  playlistItems: '',
  playlistStart: '',
  playlistEnd: '',

  removeSponsors: false,
  sponsorCategories: ['sponsor', 'intro', 'outro', 'selfpromo'],
  splitChapters: false,
  dateAfter: '',
  dateBefore: '',
  maxFileSize: '',
  rateLimit: '',

  outputTemplate: '%(title)s.%(ext)s',
  userAgent: '',
  cookiesFromBrowser: ''
};

const PLATFORM_TIPS: Record<Platform, { title: string, text: string, warning?: string }> = {
  youtube: {
    title: "YouTube Modu",
    text: "Playlist, altyazı ve SponsorBlock tam desteklenir.",
    warning: "1080p+ videolarda işlem 2 aşamalıdır (İndirme + Birleştirme)."
  },
  instagram: {
    title: "Instagram Modu",
    text: "Reels, Stories ve çoklu gönderiler için optimize edildi.",
    warning: "Gizli hesaplar için 'Cookies' ayarını kullanmalısınız."
  },
  tiktok: {
    title: "TikTok Modu",
    text: "Videoları genellikle filigransız indirir.",
    warning: "Mobilden kopyalanan linkler bazen çalışmayabilir, tarayıcı linki kullanın."
  },
  twitch: {
    title: "Twitch Modu",
    text: "Klipler ve VOD'lar için idealdir.",
    warning: "Canlı yayın kaydı için yayın bitimini beklemek önerilir."
  },
  twitter: {
    title: "Twitter / X Modu",
    text: "Tweet içindeki videoları en yüksek kalitede indirir.",
  },
  other: {
    title: "Genel Mod",
    text: "1000+ site desteklenir. Standart ayarlar çoğu site için yeterlidir.",
  }
};

const App: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [options, setOptions] = useState<CommandOptions>(DEFAULT_OPTIONS);
  const [generatedCommand, setGeneratedCommand] = useState('');
  const [urlWarning, setUrlWarning] = useState<string | null>(null);
  const [useLocalPath, setUseLocalPath] = useState(true); // Default to true for Windows PowerShell compatibility

  // Reset logic
  const handleReset = () => {
    setOptions({ ...DEFAULT_OPTIONS, url: options.url }); // Keep URL, reset options
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    // Platforma geçişte temiz bir başlangıç
    setOptions(DEFAULT_OPTIONS);
    setUrlWarning(null);
  };

  const handleDownloadSetupScript = () => {
    // PowerShell commands are split into multiple strings to prevent "unescaped line break" syntax errors
    const psDownloadYtDlp = "powershell -Command \"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " +
      "try { Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' -OutFile '%TARGET%\\yt-dlp.exe' -ErrorAction Stop } " +
      "catch { Write-Host 'Indirme basarisiz oldu.' -ForegroundColor Red; exit 1 }\"";

    const psDownloadFfmpeg = "powershell -Command \"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " +
      "try { Invoke-WebRequest -Uri 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' -OutFile '%TARGET%\\ffmpeg.zip' -ErrorAction Stop } " +
      "catch { Write-Host 'Indirme basarisiz oldu.' -ForegroundColor Red; exit 1 }\"";

    const scriptLines = [
      "@echo off",
      "setlocal",
      "title yt-dlp ve FFmpeg Otomatik Kurulum Araci v2.0",
      "color 0B",
      "",
      ":: Hedef Klasor Tanimlama",
      "set \"TARGET=%USERPROFILE%\\Desktop\\ARŞİV\"",
      "",
      "echo ========================================================",
      "echo   yt-dlp ve FFmpeg Kurulum Sihirbazı (Guclu Mod)",
      "echo   Hedef: %TARGET%",
      "echo ========================================================",
      "echo.",
      "",
      "if not exist \"%TARGET%\" (",
      "    echo [BILGI] 'ARŞİV' klasoru masaustunde olusturuluyor...",
      "    mkdir \"%TARGET%\"",
      ")",
      "",
      "echo [ADIM 1/3] yt-dlp.exe indiriliyor...",
      ":: PowerShell kullanarak indirme (Daha kararli)",
      psDownloadYtDlp,
      "",
      "if not exist \"%TARGET%\\yt-dlp.exe\" (",
      "    color 0C",
      "    echo.",
      "    echo [HATA] yt-dlp indirilemedi!",
      "    echo Lutfen internet baglantinizi kontrol edin veya VPN varsa kapatin.",
      "    pause",
      "    exit /b",
      ")",
      "",
      "echo.",
      "echo [ADIM 2/3] FFmpeg indiriliyor (Bu islem internet hizina bagli surer)...",
      psDownloadFfmpeg,
      "",
      "if not exist \"%TARGET%\\ffmpeg.zip\" (",
      "    color 0C",
      "    echo.",
      "    echo [HATA] FFmpeg zip dosyasi indirilemedi!",
      "    pause",
      "    exit /b",
      ")",
      "",
      "echo.",
      "echo [ADIM 3/3] Dosyalar kuruluyor ve temizleniyor...",
      "cd /d \"%TARGET%\"",
      "",
      ":: Zip'ten cikart",
      "tar -xf ffmpeg.zip",
      "",
      ":: Alt klasordeki exe'leri ana dizine tasi",
      "for /d %%I in (ffmpeg-*) do (",
      "    if exist \"%%I\\bin\\ffmpeg.exe\" move /y \"%%I\\bin\\ffmpeg.exe\" . >nul",
      "    if exist \"%%I\\bin\\ffplay.exe\" move /y \"%%I\\bin\\ffplay.exe\" . >nul",
      "    if exist \"%%I\\bin\\ffprobe.exe\" move /y \"%%I\\bin\\ffprobe.exe\" . >nul",
      "    rmdir /s /q \"%%I\"",
      ")",
      "",
      ":: Zip dosyasini sil",
      "del ffmpeg.zip",
      "",
      "echo.",
      "echo ========================================================",
      "if exist yt-dlp.exe (",
      "    if exist ffmpeg.exe (",
      "        color 0A",
      "        echo [BASARILI] KURULUM TAMAMLANDI!",
      "        echo.",
      "        echo Tum dosyalar masaustunuzdeki \"ARŞİV\" klasorune indi.",
      "        echo.",
      "        echo NASIL KULLANILIR?",
      "        echo 1. \"ARŞİV\" klasorunu acin.",
      "        echo 2. Adres cubuguna 'cmd' yazip Enter'a basin.",
      "        echo 3. Sitemizden kopyaladiginiz komutu yapistirin.",
      "    ) else (",
      "        color 0E",
      "        echo [UYARI] yt-dlp indi ama FFmpeg tasinamadi.",
      "    )",
      ") else (",
      "    color 0C",
      "    echo [HATA] Beklenmedik bir hata olustu.",
      ")",
      "echo ========================================================",
      "echo Cikmak icin bir tusa basin...",
      "pause > nul"
    ];

    const scriptContent = scriptLines.join("\r\n");

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kurulumu_baslat.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // URL Validation Logic
  useEffect(() => {
    if (!options.url || !selectedPlatform) {
      setUrlWarning(null);
      return;
    }

    const url = options.url.toLowerCase();
    let warning = null;

    if (selectedPlatform === 'youtube' && !url.includes('youtu')) {
      warning = "YouTube modu seçili ama link YouTube'a benzemiyor.";
    } else if (selectedPlatform === 'instagram' && !url.includes('instagram')) {
      warning = "Instagram modu seçili ama link Instagram'a benzemiyor.";
    } else if (selectedPlatform === 'twitch' && !url.includes('twitch')) {
      warning = "Twitch modu seçili ama link Twitch'e benzemiyor.";
    } else if (selectedPlatform === 'twitter' && !url.includes('twitter') && !url.includes('x.com')) {
      warning = "Twitter modu seçili ama link Twitter/X'e benzemiyor.";
    } else if (selectedPlatform === 'tiktok' && !url.includes('tiktok')) {
      warning = "TikTok modu seçili ama link TikTok'a benzemiyor.";
    }

    setUrlWarning(warning);

  }, [options.url, selectedPlatform]);

  useEffect(() => {
    // Command builder logic
    // useLocalPath true ise '.\yt-dlp', false ise 'yt-dlp'
    const commandPrefix = useLocalPath ? '.\\yt-dlp' : 'yt-dlp';
    const parts: string[] = [commandPrefix];

    // Format Logic
    if (options.formatType === FormatType.AUDIO_ONLY) {
      parts.push('-x'); // Extract audio
      parts.push(`--audio-format ${options.container}`);
      parts.push('--audio-quality 0'); // Best audio
    } else {
      // Video Logic with Quality Support
      let formatString = '';
      
      const qualityConstraint = options.videoQuality === VideoQuality.BEST 
        ? '' 
        : `[height<=${options.videoQuality}]`;

      let extConstraintVideo = '';
      if (options.container === Container.MP4) {
        extConstraintVideo = '[ext=mp4]';
      } else if (options.container === Container.WEBM) {
        extConstraintVideo = '[ext=webm]';
      }

      if (options.formatType === FormatType.VIDEO_AUDIO) {
         if (extConstraintVideo) {
            formatString = `bv*${extConstraintVideo}${qualityConstraint}+ba/b${extConstraintVideo}${qualityConstraint} / bv*${qualityConstraint}+ba/b${qualityConstraint}`;
         } else {
            formatString = `bv*${qualityConstraint}+ba/b${qualityConstraint}`;
         }
      } else if (options.formatType === FormatType.VIDEO_ONLY) {
         if (extConstraintVideo) {
            formatString = `bv*${extConstraintVideo}${qualityConstraint} / bv*${qualityConstraint}`;
         } else {
            formatString = `bv*${qualityConstraint}`;
         }
      }
      
      if (formatString) {
        parts.push(`-f "${formatString.replace(/\s\/\s/g, '/')}"`);
      }
      
      if (options.container !== Container.MP4) {
         parts.push(`--merge-output-format ${options.container}`);
      } else {
         parts.push(`--merge-output-format mp4`);
      }
    }

    // Post Processing
    if (options.embedThumbnail) parts.push('--embed-thumbnail');
    if (options.metadata) parts.push('--add-metadata');
    if (options.restrictFilenames) parts.push('--restrict-filenames');
    if (options.ignoreErrors) parts.push('--ignore-errors');
    
    // Pro Features
    if (options.removeSponsors && options.sponsorCategories.length > 0) {
      parts.push(`--sponsorblock-remove "${options.sponsorCategories.join(',')}"`);
    }

    if (options.splitChapters) {
      parts.push('--split-chapters');
    }

    if (options.dateAfter) parts.push(`--dateafter ${options.dateAfter.replace(/-/g, '')}`);
    if (options.dateBefore) parts.push(`--datebefore ${options.dateBefore.replace(/-/g, '')}`);
    if (options.maxFileSize) parts.push(`--max-filesize ${options.maxFileSize}`);
    if (options.rateLimit) parts.push(`--limit-rate ${options.rateLimit}`);

    // Playlist Logic
    if (options.noPlaylist) {
      parts.push('--no-playlist');
    } else {
      if (options.playlistItems.trim()) parts.push(`--playlist-items ${options.playlistItems.trim()}`);
      if (options.playlistStart.trim()) parts.push(`--playlist-start ${options.playlistStart.trim()}`);
      if (options.playlistEnd.trim()) parts.push(`--playlist-end ${options.playlistEnd.trim()}`);
    }

    // Subtitles
    if (options.embedSubs) {
      parts.push('--embed-subs');
      parts.push('--sub-langs all'); 
      if (options.autoSubs) parts.push('--write-auto-subs');
    }

    // Advanced
    if (options.cookiesFromBrowser) parts.push(`--cookies-from-browser ${options.cookiesFromBrowser}`);
    if (options.outputTemplate && options.outputTemplate !== DEFAULT_OPTIONS.outputTemplate) {
      parts.push(`-o "${options.outputTemplate}"`);
    }

    // URL
    if (options.url.trim()) {
      parts.push(`"${options.url.trim()}"`);
    } else {
      parts.push(`"[URL]"`);
    }

    setGeneratedCommand(parts.join(' '));
  }, [options, selectedPlatform, useLocalPath]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0F0F0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
                yt-dlp <span className="text-emerald-400">Universal</span>
              </h1>
            </div>
          </div>
          {selectedPlatform && (
             <div className="flex items-center gap-4">
                 <button 
                  onClick={handleReset}
                  className="text-xs font-medium text-gray-400 hover:text-yellow-400 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-yellow-900/10 border border-transparent hover:border-yellow-900/30"
                  title="Ayarları varsayılana döndür"
                >
                  <RotateCcw className="w-3 h-3" /> <span className="hidden sm:inline">Sıfırla</span>
                </button>
                <button 
                  onClick={() => setSelectedPlatform(null)}
                  className="text-xs font-medium text-white bg-gray-800 hover:bg-gray-700 flex items-center gap-2 transition-colors px-4 py-2 rounded-lg border border-gray-700"
                >
                  <ArrowLeft className="w-3 h-3" /> Platform Değiştir
                </button>
             </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {!selectedPlatform ? (
          <PlatformSelector onSelect={handlePlatformSelect} onDownloadScript={handleDownloadSetupScript} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Left Column: Builder */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Platform Info Card */}
              <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-400 text-sm mb-1">{PLATFORM_TIPS[selectedPlatform].title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{PLATFORM_TIPS[selectedPlatform].text}</p>
                  {PLATFORM_TIPS[selectedPlatform].warning && (
                    <div className="flex items-start gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-500/10">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      {PLATFORM_TIPS[selectedPlatform].warning}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yt-panel border border-yt-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Video Bağlantısı (URL)</label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={options.url}
                        onChange={(e) => setOptions(o => ({ ...o, url: e.target.value }))}
                        placeholder={`${selectedPlatform === 'youtube' ? 'youtube.com/...' : selectedPlatform === 'instagram' ? 'instagram.com/reel/...' : 'Video linkini buraya yapıştırın...'}`}
                        className={`w-full bg-[#0F0F0F] border rounded-xl py-3 pl-10 pr-4 text-white focus:ring-1 transition-all outline-none ${urlWarning ? 'border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500' : 'border-gray-700 focus:border-emerald-500 focus:ring-emerald-500'}`}
                      />
                    </div>
                  </div>
                  {/* URL Warning */}
                  {urlWarning && (
                    <div className="mt-3 flex items-start gap-2 text-yellow-400 text-xs bg-yellow-900/10 p-2 rounded border border-yellow-500/20 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{urlWarning}</span>
                    </div>
                  )}
                </div>

                <ControlPanel options={options} setOptions={setOptions} platform={selectedPlatform} />
              </div>

            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-24 space-y-6">
                
                {/* Command Output */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-1 shadow-2xl">
                  <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between bg-[#222]">
                     <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                      <Command className="w-4 h-4 text-emerald-500" /> Hazır Komut
                    </h2>
                    
                    {/* Local/Global Toggle */}
                    <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded border border-gray-700/50">
                        <span className={`text-[10px] font-mono font-bold ${useLocalPath ? 'text-emerald-400' : 'text-gray-500'}`}>
                           {useLocalPath ? '.\\yt-dlp' : 'yt-dlp'}
                        </span>
                        <div 
                          className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-colors ${useLocalPath ? 'bg-emerald-500/30 border border-emerald-500/50' : 'bg-gray-700 border border-gray-600'}`}
                          onClick={() => setUseLocalPath(!useLocalPath)}
                        >
                          <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm ${useLocalPath ? 'left-3.5 bg-emerald-400' : 'left-0.5 bg-gray-400'}`} />
                        </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <CommandTerminal command={generatedCommand} />
                  </div>
                </div>

                {/* General Info */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="w-24 h-24 text-emerald-400" />
                    </div>
                    <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Nasıl Kullanılır?
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed relative z-10 space-y-2">
                      <span className="block">1. Masaüstünde oluşturduğunuz <b>ARŞİV</b> klasörüne girin.</span>
                      <span className="block">2. Adres çubuğuna <code>cmd</code> yazıp Enter'a basın.</span>
                      <span className="block">3. Buradaki <b>Hazır Komut</b>u kopyalayıp siyah ekrana yapıştırın.</span>
                      <span className="block text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700 italic">Eğer yt-dlp henüz kurulu değilse, ana sayfaya dönüp kurulum scriptini indirin.</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;