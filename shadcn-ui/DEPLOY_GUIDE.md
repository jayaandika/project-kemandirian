# Panduan Deploy ke GitHub & Vercel

## Setup GitHub Repository

### Jika Repository Sudah Ada

Jika Anda sudah memiliki repository di GitHub (seperti: https://github.com/jayaandika/project-kemandirian):

```bash
# Tambahkan remote origin
git remote add origin https://github.com/jayaandika/project-kemandirian.git

# Push ke GitHub
git push -u origin master
```

### Jika Ada Masalah Permission (403 Error)

**Gunakan Personal Access Token:**

1. Buat token di [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Generate new token dengan permissions `repo`
3. Gunakan token untuk push:

```bash
# Ganti TOKEN_ANDA dengan token yang sudah dibuat
git remote set-url origin https://TOKEN_ANDA@github.com/jayaandika/project-kemandirian.git
git push -u origin master
```

**Atau gunakan SSH:**

```bash
# Setup SSH key jika belum ada
ssh-keygen -t ed25519 -C "your_email@example.com"

# Tambahkan SSH key ke GitHub
# Copy isi file ~/.ssh/id_ed25519.pub ke GitHub Settings → SSH Keys

# Gunakan SSH URL
git remote set-url origin git@github.com:jayaandika/project-kemandirian.git
git push -u origin master
```

## Setup Vercel

1. Login ke [Vercel.com](https://vercel.com)
2. Klik **"New Project"**
3. Import repository dari GitHub
4. Vercel akan otomatis mendeteksi dan build project React Anda

## Setup GitHub Secrets

Untuk auto-deploy berfungsi, tambahkan secrets di GitHub:

1. Di repository GitHub, pergi ke **Settings → Secrets and variables → Actions**
2. Tambahkan secrets berikut:
   - `VERCEL_TOKEN`: Dapatkan dari [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: Dapatkan dari [Vercel Dashboard → Settings](https://vercel.com/account)
   - `VERCEL_PROJECT_ID`: Dapatkan dari project settings di Vercel

## Build & Deploy Manual

Jika ingin deploy manual:

```bash
# Build project
pnpm build

# Preview lokal
pnpm preview
```

## Troubleshooting

- Pastikan environment variables di Vercel sudah benar
- Cek build logs di GitHub Actions jika gagal
- Pastikan semua dependencies terinstall dengan `pnpm install`
