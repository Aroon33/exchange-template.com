#!/bin/bash
set -e

#############################################
# Usage:
# ./05_create_backend_structure.sh <API_WEBROOT>
#
# Example:
# ./05_create_backend_structure.sh /var/www/example.com/api
#############################################

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <API_WEBROOT>"
  echo "Example:"
  echo "  $0 /var/www/example.com/api"
  exit 1
fi

API_ROOT="$1"

echo "============================================"
echo " [05] Backend (API) Structure Setup"
echo "--------------------------------------------"
echo " API Webroot : ${API_ROOT}"
echo "============================================"

# ------------------------------------------------
# 1. Base directories
# ------------------------------------------------
echo "[1/5] Creating base directories..."

mkdir -p "${API_ROOT}"
mkdir -p "${API_ROOT}/src"
mkdir -p "${API_ROOT}/prisma"

# ------------------------------------------------
# 2. Core NestJS structure
# ------------------------------------------------
echo "[2/5] Creating core NestJS structure..."

mkdir -p "${API_ROOT}/src/modules"

touch \
  "${API_ROOT}/src/main.ts" \
  "${API_ROOT}/src/app.module.ts"

# ------------------------------------------------
# 3. Standard modules (empty template)
# ------------------------------------------------
echo "[3/5] Creating standard modules..."

MODULES=(
  auth
  users
  wallet
  deposit
  withdraw
  trades
  tickets
  kyc
  groups
  system
)

for module in "${MODULES[@]}"; do
  MOD_DIR="${API_ROOT}/src/modules/${module}"

  mkdir -p "${MOD_DIR}"

  touch \
    "${MOD_DIR}/${module}.module.ts" \
    "${MOD_DIR}/${module}.controller.ts" \
    "${MOD_DIR}/${module}.service.ts"
done

# ------------------------------------------------
# 4. Prisma
# ------------------------------------------------
echo "[4/5] Creating Prisma structure..."

touch \
  "${API_ROOT}/prisma/schema.prisma"

# ------------------------------------------------
# 5. Config / env templates
# ------------------------------------------------
echo "[5/5] Creating config templates..."

touch \
  "${API_ROOT}/.env.example" \
  "${API_ROOT}/.gitignore" \
  "${API_ROOT}/package.json" \
  "${API_ROOT}/tsconfig.json"

echo "============================================"
echo "✅ Backend structure created successfully"
echo "--------------------------------------------"
echo " Next steps:"
echo "   - npm init / nest new (if needed)"
echo "   - setup Prisma schema"
echo "   - configure PM2"
echo "============================================"
