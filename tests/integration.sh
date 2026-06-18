#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4018/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== GrowPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@evergreennursery.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/greenhouse-bays" -H "Authorization: Bearer $TOKEN")
assert_status "List Greenhouse Bays" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/harvest-batches" -H "Authorization: Bearer $TOKEN")
assert_status "List Harvest Batches" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment-repairs" -H "Authorization: Bearer $TOKEN")
assert_status "List Equipment Repairs" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/irrigation-schedules" -H "Authorization: Bearer $TOKEN")
assert_status "List Irrigation Schedules" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/plant-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Plant Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/plant-pricing" -H "Authorization: Bearer $TOKEN")
assert_status "List Plant Pricing" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/nursery" -H "Authorization: Bearer $TOKEN")
assert_status "Nursery Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment-repairs/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Equipment Repairs" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/plant-orders/pending" -H "Authorization: Bearer $TOKEN")
assert_status "Pending Plant Orders" 200 "$HTTP_CODE"

CREATE_BAY=$(curl -s -w "\n%{http_code}" "$API_URL/greenhouse-bays" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Bay #99","zone":"Test Zone","climateType":"temperate","notes":"Integration test bay"}')
HTTP_CODE=$(echo "$CREATE_BAY" | tail -1)
assert_status "Create Greenhouse Bay" 201 "$HTTP_CODE"

BAY_ID=$(echo "$CREATE_BAY" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$BAY_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/greenhouse-bays/$BAY_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Greenhouse Bay" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/greenhouse-bays/$BAY_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Greenhouse Bay" 200 "$HTTP_CODE"
fi

CREATE_ORDER=$(curl -s -w "\n%{http_code}" "$API_URL/plant-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"buyerName":"Test Buyer","plantVariety":"Lavender Plugs","supplierName":"Pacific Plug","price":99}')
HTTP_CODE=$(echo "$CREATE_ORDER" | tail -1)
assert_status "Create Plant Order" 201 "$HTTP_CODE"

ORDER_ID=$(echo "$CREATE_ORDER" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$ORDER_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/plant-orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"in_progress"}')
  assert_status "Update Plant Order" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/plant-orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Plant Order" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
