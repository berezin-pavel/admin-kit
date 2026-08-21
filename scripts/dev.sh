#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT/.dev"
mkdir -p "$RUN_DIR"

NAME="showcase"
PORT=3000
HEAP_MB="${DEV_HEAP_MB:-2048}"
START_CMD="NODE_OPTIONS=--max-old-space-size=$HEAP_MB pnpm dev"
PROC_PATTERN="admin-kit/node_modules/[^ ]*next[^ ]* dev"

pid_on_port() {
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | head -1
}

stray_pids() {
  pgrep -f "$PROC_PATTERN" 2>/dev/null | tr '\n' ' '
}

stray_count() {
  stray_pids | wc -w | tr -d ' '
}

pid_cwd() {
  lsof -a -p "$1" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1
}

pid_is_ours() {
  [ -n "$1" ] || return 1
  [ "$(pid_cwd "$1")" = "$ROOT" ]
}

is_up() {
  pid_is_ours "$(pid_on_port)"
}

port_taken_by_other() {
  local pid
  pid="$(pid_on_port)"
  [ -n "$pid" ] && ! pid_is_ours "$pid"
}

start_server() {
  if is_up; then
    echo "$NAME: already running on :$PORT"
    return 0
  fi
  if port_taken_by_other; then
    echo "$NAME: port :$PORT is taken by a foreign process (pid $(pid_on_port)) — free the port and retry"
    return 1
  fi

  ( cd "$ROOT" && nohup bash -c "$START_CMD" </dev/null >"$RUN_DIR/$NAME.log" 2>&1 & echo $! >"$RUN_DIR/$NAME.pid"; disown ) </dev/null >/dev/null 2>&1

  for _ in $(seq 1 60); do
    if is_up; then
      echo "$NAME: started on :$PORT"
      return 0
    fi
    sleep 0.5
  done

  echo "$NAME: did NOT start within 30s, last log lines:"
  tail -5 "$RUN_DIR/$NAME.log" 2>/dev/null | sed 's/^/    /'
  return 1
}

stop_server() {
  local pid saved left
  pid="$(pid_on_port)"
  saved="$(cat "$RUN_DIR/$NAME.pid" 2>/dev/null || true)"

  if [ -n "$pid" ] && ! pid_is_ours "$pid"; then
    echo "$NAME: foreign process on :$PORT (pid $pid) — leaving it alone"
    pid=""
  fi

  [ -n "$pid" ] && kill "$pid" 2>/dev/null
  [ -n "$saved" ] && kill "$saved" 2>/dev/null
  pkill -f "$PROC_PATTERN" 2>/dev/null

  for _ in $(seq 1 20); do
    if ! is_up && [ "$(stray_count)" = "0" ]; then
      echo "$NAME: stopped"
      rm -f "$RUN_DIR/$NAME.pid"
      return 0
    fi
    sleep 0.5
  done

  pid="$(pid_on_port)"
  [ -n "$pid" ] && pid_is_ours "$pid" && kill -9 "$pid" 2>/dev/null
  [ -n "$saved" ] && kill -9 "$saved" 2>/dev/null
  pkill -9 -f "$PROC_PATTERN" 2>/dev/null
  sleep 1

  left="$(stray_count)"
  rm -f "$RUN_DIR/$NAME.pid"

  if ! is_up && [ "$left" = "0" ]; then
    echo "$NAME: stopped (forced)"
  else
    echo "$NAME: stop incomplete — port pid: $(pid_on_port), stray processes: $left"
    return 1
  fi
}

status() {
  local pid procs http
  pid="$(pid_on_port)"
  procs="$(stray_count)"

  if [ -n "$pid" ] && ! pid_is_ours "$pid"; then
    echo "$NAME :$PORT — port taken by a foreign process (pid $pid)"
  elif [ -n "$pid" ]; then
    http="$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://localhost:$PORT/" || true)"
    echo "$NAME :$PORT — running (pid $pid, processes $procs, GET / -> ${http:-no response})"
  elif [ "$procs" != "0" ]; then
    echo "$NAME :$PORT — port free, but $procs stray processes remain (run ./scripts/dev.sh stop)"
  else
    echo "$NAME :$PORT — stopped"
  fi
}

case "${1:-status}" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    start_server
    ;;
  status)
    status
    ;;
  logs)
    tail -n "${2:-30}" "$RUN_DIR/$NAME.log" 2>/dev/null || echo "no log yet: $RUN_DIR/$NAME.log"
    ;;
  *)
    echo "usage: dev.sh [start|stop|restart|status|logs [lines]]"
    exit 1
    ;;
esac
