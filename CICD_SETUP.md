# Setup Secret untuk waste-not-landing CI/CD

CI/CD di `.github/workflows/deploy.yml` butuh satu secret: `DEPLOY_SSH_KEY`.

**SSH key yang dipakai sama persis dengan `waste-not-android`** — tidak perlu generate key baru.

---

## Langkah

### 1. Buka Settings repo landing page

Pergi ke: https://github.com/waste-not-app/waste-not-landing/settings/secrets/actions

### 2. Tambah Secret

Klik **New repository secret**, isi:

| Field  | Value                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------- |
| Name   | `DEPLOY_SSH_KEY`                                                                                         |
| Secret | Isi dengan private key dari `~/.ssh/wastenot_deploy_key` (sama dengan yang dipakai di waste-not-android) |

Private key bisa dicopy dengan:

```bash
cat ~/.ssh/wastenot_deploy_key
```

### 3. Done

Setelah secret ditambahkan, setiap push ke `main` akan otomatis build & deploy ke VM.

---

## Catatan

- Deploy target: `dev@proxy.bccdev.id:/var/www/wastenot-landing/` (port 11023)
- Public key sudah ada di VM (`~/.ssh/authorized_keys`)
- Landing page live di: https://oktaavsm.bccdev.id/wastenot-app/
