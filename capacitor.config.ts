import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rglandia.sawanrak',
  appName: 'glandia',
  webDir: 'build',
   server: {
    url: 'https://sawan-rak.vercel.app/',  // ← URL de déploiement Vercel
    
  }
};

export default config;
