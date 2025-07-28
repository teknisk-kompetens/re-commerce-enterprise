
#!/bin/bash
set -e

ENVIRONMENT=$1
NAMESPACE="re-commerce-enterprise"
APP_NAME="re-commerce-enterprise"

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "🧪 Running integration tests for $ENVIRONMENT environment"

# Get service URL
if [ "$ENVIRONMENT" = "production" ]; then
  BASE_URL="https://re-commerce-enterprise.com"
else
  SERVICE_IP=$(kubectl get svc $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
  BASE_URL="http://$SERVICE_IP"
fi

echo "🌐 Testing against: $BASE_URL"

# Test main pages
echo "📄 Testing main pages..."
pages=("/" "/dashboard" "/ai-analytics" "/security-center" "/governance-center" "/performance-center")

for page in "${pages[@]}"; do
  echo "Testing $page..."
  kubectl run test-page-$(echo $page | tr '/' '-' | tr -d '-') --rm -i --restart=Never --image=curlimages/curl -- \
    curl -f -s -o /dev/null -w "%{http_code}" "$BASE_URL$page"
  echo "✅ $page responded successfully"
done

# Test API endpoints
echo "🔌 Testing API endpoints..."
apis=("/api/health" "/api/platform-status" "/api/system-health" "/api/global-deployment" "/api/ai-analytics")

for api in "${apis[@]}"; do
  echo "Testing $api..."
  kubectl run test-api-$(echo $api | tr '/' '-' | tr -d '-') --rm -i --restart=Never --image=curlimages/curl -- \
    curl -f -s "$BASE_URL$api"
  echo "✅ $api responded successfully"
done

# Test authentication
echo "🔐 Testing authentication..."
kubectl run test-auth --rm -i --restart=Never --image=curlimages/curl -- \
  curl -f -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/signin"
echo "✅ Authentication endpoint accessible"

# Test enterprise features
echo "🏢 Testing enterprise features..."
kubectl run test-enterprise --rm -i --restart=Never --image=curlimages/curl -- \
  curl -f -s -o /dev/null -w "%{http_code}" "$BASE_URL/enterprise-hub"
echo "✅ Enterprise hub accessible"

# Performance test
echo "⚡ Running performance tests..."
kubectl run perf-test --rm -i --restart=Never --image=curlimages/curl -- \
  sh -c "time curl -f -s -o /dev/null $BASE_URL && echo 'Performance test completed'"

# Database connectivity test
echo "🗄️ Testing database connectivity..."
kubectl run db-test --rm -i --restart=Never --image=curlimages/curl -- \
  curl -f -s "$BASE_URL/api/health" | grep -q "database"
echo "✅ Database connectivity verified"

echo "🎉 All integration tests passed for $ENVIRONMENT environment!"
