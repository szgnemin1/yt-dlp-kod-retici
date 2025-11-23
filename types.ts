
export enum FormatType {
  VIDEO_AUDIO = 'best',
  AUDIO_ONLY = 'audio',
  VIDEO_ONLY = 'video'
}

export enum VideoQuality {
  BEST = 'best',
  Q4K = '2160',
  Q2K = '1440',
  Q1080 = '1080',
  Q720 = '720',
  Q480 = '480',
  Q360 = '360'
}

export enum Container {
  MP4 = 'mp4',
  MKV = 'mkv',
  WEBM = 'webm',
  MP3 = 'mp3',
  M4A = 'm4a',
  FLAC = 'flac'
}

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'twitch' | 'twitter' | 'other';

export interface CommandOptions {
  url: string;
  formatType: FormatType;
  videoQuality: VideoQuality;
  container: Container;
  embedThumbnail: boolean;
  embedSubs: boolean;
  autoSubs: boolean;
  metadata: boolean;
  restrictFilenames: boolean;
  ignoreErrors: boolean;
  
  // Playlist
  noPlaylist: boolean;
  playlistItems: string;
  playlistStart: string;
  playlistEnd: string;

  // Advanced / Pro Features
  removeSponsors: boolean;
  sponsorCategories: string[]; // 'sponsor', 'intro', 'outro', 'selfpromo', 'interaction'
  splitChapters: boolean;
  dateAfter: string; // YYYY-MM-DD
  dateBefore: string; // YYYY-MM-DD
  maxFileSize: string; // e.g. 500M
  rateLimit: string; // e.g. 5M

  outputTemplate: string;
  userAgent: string;
  cookiesFromBrowser: string;
}
