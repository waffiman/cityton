# VPS control — `scripts/vps.sh`

Drive the City-Ton VPS (`root@82.165.243.89`) over SSH.

## One-time setup

1. Put the root password into the gitignored secret file:

   ```bash
   printf '%s' 'THE_PASSWORD' > scripts/.vps-secret
   chmod 600 scripts/.vps-secret
   ```

   (Or export `VPS_PASSWORD=…` in your shell instead of the file.)

2. Install the dedicated SSH key so everything afterwards is passwordless:

   ```bash
   scripts/vps.sh setup-key
   ```

3. Once the key works you can delete the password file:

   ```bash
   rm scripts/.vps-secret
   ```

## Commands

```bash
scripts/vps.sh info                    # config + connection test
scripts/vps.sh run "docker ps"         # run a command on the VPS
scripts/vps.sh run "df -h && free -m"
scripts/vps.sh shell                   # interactive shell
scripts/vps.sh push ./file.tar /root/  # upload
scripts/vps.sh pull /var/log/app.log . # download
scripts/vps.sh sync ./dist /var/www/app  # rsync a dir up (deploys)
```

## Security notes

- `.vps-secret`, `vps.env`, the SSH key, and `.vps-known-hosts` are all gitignored — nothing secret is committed.
- The password is read by `sshpass` from the file/env, never placed on the command line, so it does not appear in `ps`.
- Prefer key auth (`setup-key`) and remove the password file afterward.
- The dedicated key lives at `~/.ssh/cityton_vps` (override with `VPS_KEY`).
