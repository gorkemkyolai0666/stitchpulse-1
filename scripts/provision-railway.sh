#!/bin/bash
# Provision Railway project, PostgreSQL, and backend service for ClimbPulse.
# Requires RAILWAY_API_TOKEN environment variable.
set -euo pipefail

API_URL="https://backboard.railway.com/graphql/v2"
PROJECT_NAME="${RAILWAY_PROJECT_NAME:-climbpulse}"
BACKEND_SERVICE_NAME="${RAILWAY_SERVICE_NAME:-climbpulse-backend}"
CONFIG_PATH="${1:-backend/.railway/config.json}"

if [ -z "${RAILWAY_API_TOKEN:-}" ]; then
  echo "RAILWAY_API_TOKEN is required"
  exit 1
fi

if [ -f "$CONFIG_PATH" ]; then
  echo "Railway config already exists at $CONFIG_PATH — skipping provisioning"
  cat "$CONFIG_PATH"
  exit 0
fi

gql() {
  local query="$1"
  curl -sS -X POST "$API_URL" \
    -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$query"
}

echo "Creating Railway project: $PROJECT_NAME"
PROJECT_RESPONSE=$(gql "$(cat <<EOF
{"query":"mutation { projectCreate(input: { name: \"$PROJECT_NAME\" }) { id name } }"}
EOF
)")

PROJECT_ID=$(echo "$PROJECT_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['projectCreate']['id'])
")

echo "Project ID: $PROJECT_ID"

echo "Fetching production environment..."
ENV_RESPONSE=$(gql "$(cat <<EOF
{"query":"query { project(id: \"$PROJECT_ID\") { environments { edges { node { id name } } } } }"}
EOF
)")

ENVIRONMENT_ID=$(echo "$ENV_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
edges = data['data']['project']['environments']['edges']
for edge in edges:
    if edge['node']['name'] == 'production':
        print(edge['node']['id'])
        break
else:
    print(edges[0]['node']['id'])
")

echo "Environment ID: $ENVIRONMENT_ID"

echo "Creating PostgreSQL service..."
PG_RESPONSE=$(gql "$(cat <<EOF
{"query":"mutation { serviceCreate(input: { projectId: \"$PROJECT_ID\", environmentId: \"$ENVIRONMENT_ID\", name: \"postgres\", source: { image: \"postgres:16\" } }) { id name } }"}
EOF
)")

PG_SERVICE_ID=$(echo "$PG_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['serviceCreate']['id'])
")

echo "PostgreSQL Service ID: $PG_SERVICE_ID"

echo "Creating backend service..."
BACKEND_RESPONSE=$(gql "$(cat <<EOF
{"query":"mutation { serviceCreate(input: { projectId: \"$PROJECT_ID\", environmentId: \"$ENVIRONMENT_ID\", name: \"$BACKEND_SERVICE_NAME\" }) { id name } }"}
EOF
)")

SERVICE_ID=$(echo "$BACKEND_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'errors' in data:
    print('ERROR:' + str(data['errors']), file=sys.stderr)
    sys.exit(1)
print(data['data']['serviceCreate']['id'])
")

echo "Backend Service ID: $SERVICE_ID"

mkdir -p "$(dirname "$CONFIG_PATH")"
cat > "$CONFIG_PATH" <<EOF
{
  "projectId": "$PROJECT_ID",
  "environmentId": "$ENVIRONMENT_ID",
  "serviceId": "$SERVICE_ID",
  "postgresServiceId": "$PG_SERVICE_ID"
}
EOF

echo "Railway config written to $CONFIG_PATH"
cat "$CONFIG_PATH"
