import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rglandia.sawanrak',
  appName: 'GLandia',
  webDir: 'build',
  server: {
    url: 'http://192.168.1.7:8090',  // ← L'adresse de ton NAS
    cleartext: true                  // ← Autorise le HTTP (indispensable pour le NAS)
  }
};

export default config;
