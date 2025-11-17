# Troubleshooting Vercel 404 Error

## Masalah: 404 Not Found di Vercel

### Penyebab Umum:
1. **Routing SPA**: React Router tidak dikonfigurasi dengan benar
2. **Build Output**: Build tidak menghasilkan file yang benar
3. **Framework Detection**: Vercel tidak mendeteksi framework dengan tepat

## Solusi Lengkap:

### 1. Konfigurasi Vercel (✅ Sudah Diperbaiki)
File `vercel.json` sekarang berisi:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/" }
  ],
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "framework": "vite"
}
```

### 2. Cek Build Settings di Vercel Dashboard
1. Buka project di Vercel dashboard
2. Klik **Settings** tab
3. Di **General** → **Build & Development Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### 3. Cek React Router Configuration
Pastikan `App.tsx` menggunakan BrowserRouter dengan benar:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* routes lainnya */}
      </Routes>
    </BrowserRouter>
  )
}
```

### 4. Redeploy Manual
Setelah konfigurasi diperbaiki:
1. Di Vercel dashboard, klik **Deployments**
2. Klik **Redeploy** pada deployment terakhir
3. Pilih **Use existing Build Cache**: ❌ (unchecked)
4. Klik **Redeploy**

### 5. Alternative: Deploy Ulang dari Nol
Jika masih bermasalah:
1. Hapus project di Vercel
2. Import ulang dari GitHub
3. Pastikan branch yang dipilih adalah `master`

### 6. Cek Build Logs
Jika masih 404:
1. Di Vercel dashboard → **Deployments**
2. Klik deployment yang gagal
3. Lihat **Build Logs** untuk error detail
4. Share errornya untuk dibantu lebih lanjut

## ✅ Setelah Push Perbaikan
Setelah push konfigurasi baru ke GitHub:
1. Vercel akan otomatis trigger redeploy
2. Cek status di **Deployments** tab
3. Jika berhasil, cek URL: `https://project-kemandirian.vercel.app`

## 📋 Checklist Sebelum Deploy:
- [ ] `vercel.json` ada di root directory
- [ ] Build command benar: `pnpm build`
- [ ] Output directory benar: `dist`
- [ ] Framework terdeteksi: Vite
- [ ] No environment variables error