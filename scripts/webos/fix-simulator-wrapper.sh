#!/bin/bash
# Wraps the webOS TV Simulator AppImage so ares-launch works on locked-down Linux (no SUID sandbox).
set -euo pipefail

SIM_DIR="/home/dwipayan/Desktop/TataPlayBinge/TV/Simulator/webOS_TV_6.0_Simulator_1.4.1"
REAL="$SIM_DIR/webOS_TV_6.0_Simulator_1.4.1.appimage.real"
WRAPPER="$SIM_DIR/webOS_TV_6.0_Simulator_1.4.1.appimage"

if [[ ! -f "$REAL" ]]; then
  if [[ -f "$WRAPPER" ]] && ! grep -q "appimage.real" "$WRAPPER" 2>/dev/null; then
    mv "$WRAPPER" "$REAL"
    chmod +x "$REAL"
    echo "Renamed original AppImage to .appimage.real"
  else
    echo "Missing $REAL — install the webOS TV 6.0 Simulator AppImage first."
    exit 1
  fi
fi

cat > "$WRAPPER" << 'EOF'
#!/bin/bash
export ELECTRON_DISABLE_SANDBOX=1
exec "$(dirname "$0")/webOS_TV_6.0_Simulator_1.4.1.appimage.real" "$@"
EOF
chmod +x "$WRAPPER"
echo "Simulator wrapper ready: $WRAPPER"
