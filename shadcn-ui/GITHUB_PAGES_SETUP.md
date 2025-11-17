# GitHub Pages Deployment Guide

## 🚀 Setup GitHub Pages

### 1. Aktifkan GitHub Pages di Repository
1. Buka repository: https://github.com/jayaandika/project-kemandirian
2. Klik **Settings** tab
3. Scroll ke bagian **Pages** di sidebar kiri
4. Di **Source**, pilih **GitHub Actions**
5. Klik **Save**

### 2. Workflow Sudah Siap
File `.github/workflows/deploy-github-pages.yml` sudah saya buat dengan konfigurasi:
- Build otomatis setiap push ke master
- Deploy ke GitHub Pages
- Support React Router dengan basename

### 3. Konfigurasi yang Sudah Diperbarui

**vite.config.ts**:
```typescript
base: '/project-kemandirian/'
```

**package.json**:
```json
"homepage": "https://jayaandika.github.io/project-kemandirian"
```

**App.tsx**:
```typescript
const basename = import.meta.env.MODE === 'production' && window.location.hostname.includes('github.io') 
  ? '/project-kemandirian' 
  : '';
```

### 4. URL Aplikasi Setelah Deploy
Aplikasi akan tersedia di: **https://jayaandika.github.io/project-kemandirian**

### 5. Cara Deploy Manual (Opsional)
Jika ingin deploy manual:
```bash
npm run build
npm run deploy
```

### 6. Troubleshooting

**Jika routing tidak bekerja:**
- Pastikan menggunakan Link dari react-router-dom
- Jangan menggunakan anchor tag `<a href="...">` untuk internal links
- Gunakan: `<Link to="/dashboard">Dashboard</Link>`

**Jika assets tidak load:**
- Semua path assets harus relative ke `/project-kemandirian/`
- Vite otomatis handle ini dengan base path configuration

**Jika masih 404:**
1. Cek **Actions** tab di GitHub untuk build logs
2. Pastikan branch `master` digunakan
3. Cek **Settings → Pages** untuk status deployment

### 7. Test Deployment
Setelah push ke GitHub:
1. Buka **Actions** tab di repository
2. Lihat workflow **Deploy to GitHub Pages** berjalan
3. Tunggu sampai status ✅ **Success**
4. Buka URL: https://jayaandika.github.io/project-kemandirian

### 8. Update Aplikasi
Untuk update aplikasi:
1. Edit kode di lokal
2. Commit dan push ke GitHub
3. GitHub Actions otomatis deploy ulang
4. Refresh browser untuk melihat perubahan

## 🎯 Status Deployment
Setelah Anda push kode ke GitHub, deployment akan otomatis:
- Build React app
- Deploy ke GitHub Pages
- Tersedia di URL yang sudah ditentukan

**GitHub Pages sudah siap! Push kode Anda dan aplikasi akan otomatis deploy.** 🚀