# Vercel Deployment Setup Guide

## 🚀 Quick Deploy to Vercel

### 1. Login ke Vercel
- Buka [vercel.com](https://vercel.com)
- Login dengan akun GitHub Anda
- Klik **"New Project"**

### 2. Import Repository
- Pilih `project-kemandirian` dari daftar repository
- Klik **"Import"**
- Vercel akan otomatis mendeteksi konfigurasi:
  - **Framework**: Vite
  - **Build Command**: `pnpm build`
  - **Output Directory**: `dist`
  - **Install Command**: `pnpm install`

### 3. Environment Variables
Jika aplikasi Anda menggunakan Supabase, tambahkan:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy
- Klik **"Deploy"**
- Vercel akan build dan deploy aplikasi Anda
- Anda akan mendapat URL seperti: `https://project-kemandirian.vercel.app`

## 🔑 GitHub Actions Setup

Setelah deploy berhasil, setup GitHub Secrets:

### 1. Dapatkan Vercel Token
- Buka [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
- Klik **"Create Token"**
- Beri nama: `GitHub Actions Deploy`
- Copy token tersebut

### 2. Dapatkan Vercel Org ID & Project ID
- Buka project di Vercel dashboard
- Pergi ke **Settings → General**
- Copy **Org ID** dan **Project ID**

### 3. Setup GitHub Secrets
- Di repository GitHub, pergi ke **Settings → Secrets → Actions**
- Tambahkan secrets baru:
  - `VERCEL_TOKEN`: Token yang sudah dibuat
  - `VERCEL_ORG_ID`: Org ID dari Vercel
  - `VERCEL_PROJECT_ID`: Project ID dari Vercel

### 4. Auto Deploy Aktif!
Setiap push ke branch `master` akan otomatis trigger deploy ke Vercel.

## 🎯 Test Deploy
Setelah semua setup selesai:
1. Buat perubahan kecil di kode
2. Commit dan push ke GitHub
3. Cek **Actions** tab di GitHub untuk melihat proses deploy
4. Aplikasi akan otomatis update di Vercel