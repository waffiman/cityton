#!/usr/bin/env bash
#
# vps.sh — drive the City-Ton VPS over SSH.
#
# Auth: prefers the dedicated SSH key (passwordless once installed); otherwise
# falls back to the password in scripts/.vps-secret (or $VPS_PASSWORD). The
# password is never passed on the command line — sshpass reads it from the
# file/env, so it never shows up in `ps`.
#
# Usage:
#   scripts/vps.sh info                   Show config + test the connection
#   scripts/vps.sh setup-key              Install the SSH key (uses password once)
#   scripts/vps.sh run "<command>"        Run a command on the VPS
#   scripts/vps.sh shell                  Open an interactive shell
#   scripts/vps.sh push <local> <remote>  Copy a file/dir up (scp -r)
#   scripts/vps.sh pull <remote> <local>  Copy a file/dir down (scp -r)
#   scripts/vps.sh sync <localdir> <rem>  rsync a directory up (deploys)
#
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Config (override in scripts/vps.env) ---------------------------------
[ -f "$DIR/vps.env" ] && source "$DIR/vps.env"
VPS_HOST="${VPS_HOST:-82.165.243.89}"
VPS_USER="${VPS_USER:-root}"
VPS_PORT="${VPS_PORT:-22}"
VPS_KEY="${VPS_KEY:-$HOME/.ssh/cityton_vps}"
SECRET_FILE="${VPS_SECRET_FILE:-$DIR/.vps-secret}"
KNOWN_HOSTS="$DIR/.vps-known-hosts"

SSH_OPTS=(
  -o "StrictHostKeyChecking=accept-new"
  -o "UserKnownHostsFile=$KNOWN_HOSTS"
  -o "ConnectTimeout=15"
  -p "$VPS_PORT"
)
# scp takes the port flag as -P (uppercase); ssh takes -p. Same options
# otherwise, so build a second array rather than passing SSH_OPTS to scp.
SCP_OPTS=(
  -o "StrictHostKeyChecking=accept-new"
  -o "UserKnownHostsFile=$KNOWN_HOSTS"
  -o "ConnectTimeout=15"
  -P "$VPS_PORT"
)
TARGET="$VPS_USER@$VPS_HOST"

die() { echo "vps.sh: $*" >&2; exit 1; }

# Fill SSHPASS_CMD with the sshpass invocation (array). Returns 1 if no password.
SSHPASS_CMD=()
set_sshpass() {
  if [ -f "$SECRET_FILE" ] && [ -s "$SECRET_FILE" ]; then
    SSHPASS_CMD=(sshpass -f "$SECRET_FILE")
  elif [ -n "${VPS_PASSWORD:-}" ]; then
    export SSHPASS="$VPS_PASSWORD"
    SSHPASS_CMD=(sshpass -e)
  else
    return 1
  fi
}

# Does key auth work right now? (non-interactive probe)
key_works() {
  [ -f "$VPS_KEY" ] || return 1
  ssh -i "$VPS_KEY" -o BatchMode=yes "${SSH_OPTS[@]}" "$TARGET" true 2>/dev/null
}

# Run ssh with the best available auth. Extra args passed to the remote shell.
do_ssh() {
  if key_works; then
    ssh -i "$VPS_KEY" "${SSH_OPTS[@]}" "$TARGET" "$@"
  elif set_sshpass; then
    "${SSHPASS_CMD[@]}" ssh "${SSH_OPTS[@]}" "$TARGET" "$@"
  else
    die "No auth available. Run 'setup-key' or put the password in $SECRET_FILE"
  fi
}

# scp (recursive) with the best available auth. $@ = scp source/dest.
do_scp() {
  if key_works; then
    scp -i "$VPS_KEY" -r "${SCP_OPTS[@]}" "$@"
  elif set_sshpass; then
    "${SSHPASS_CMD[@]}" scp -r "${SCP_OPTS[@]}" "$@"
  else
    die "No auth available. Run 'setup-key' or put the password in $SECRET_FILE"
  fi
}

cmd_info() {
  echo "Host   : $TARGET  (port $VPS_PORT)"
  echo "Key    : $VPS_KEY $( [ -f "$VPS_KEY" ] && echo '(present)' || echo '(missing)')"
  echo "Secret : $SECRET_FILE $( [ -f "$SECRET_FILE" ] && echo '(present)' || echo '(absent)')"
  printf "Auth   : "
  if key_works; then
    echo "key ✓ (passwordless)"
  elif set_sshpass; then
    echo "password (key not installed yet — run: scripts/vps.sh setup-key)"
  else
    echo "NONE — add key or password"
  fi
  echo "---"
  echo "Testing connection…"
  do_ssh 'echo "connected as $(whoami)@$(hostname) — $(uname -sr)"'
}

cmd_setup_key() {
  [ -f "$VPS_KEY" ] || die "Key $VPS_KEY missing. Generate: ssh-keygen -t ed25519 -f $VPS_KEY -N ''"
  if key_works; then echo "Key already installed — nothing to do."; return 0; fi
  set_sshpass || die "Need the password once. Put it in $SECRET_FILE (chmod 600) or set VPS_PASSWORD."
  echo "Installing public key on $TARGET …"
  "${SSHPASS_CMD[@]}" ssh-copy-id -i "$VPS_KEY.pub" "${SSH_OPTS[@]}" "$TARGET"
  echo "Verifying…"
  if key_works; then
    echo "Key auth works ✓ — you can now delete $SECRET_FILE."
  else
    die "Key install failed."
  fi
}

cmd_sync() {
  [ $# -eq 2 ] || die "usage: sync <localdir> <remotedir>"
  local ssh_opts_str="${SSH_OPTS[*]}"
  if key_works; then
    rsync -az --delete -e "ssh -i $VPS_KEY $ssh_opts_str" "$1"/ "$TARGET:$2"/
  elif set_sshpass; then
    rsync -az --delete -e "${SSHPASS_CMD[*]} ssh $ssh_opts_str" "$1"/ "$TARGET:$2"/
  else
    die "No auth available."
  fi
}

main() {
  local sub="${1:-info}"; shift || true
  case "$sub" in
    info)      cmd_info ;;
    setup-key) cmd_setup_key ;;
    run)       [ $# -ge 1 ] || die "usage: run \"<command>\""; do_ssh "$@" ;;
    shell)     do_ssh ;;
    push)      [ $# -eq 2 ] || die "usage: push <local> <remote>"; do_scp "$1" "$TARGET:$2" ;;
    pull)      [ $# -eq 2 ] || die "usage: pull <remote> <local>"; do_scp "$TARGET:$1" "$2" ;;
    sync)      cmd_sync "$@" ;;
    -h|--help|help) sed -n '2,19p' "$0" | sed 's/^#\{0,1\} \{0,1\}//' ;;
    *) die "unknown command '$sub' (try: info, setup-key, run, shell, push, pull, sync)" ;;
  esac
}

main "$@"
