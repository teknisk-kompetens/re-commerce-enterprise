
#!/bin/bash
set -e

ENVIRONMENT=$1
NAMESPACE="re-commerce-enterprise"
APP_NAME="re-commerce-enterprise"

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: $0 <environment>"
  exit 1
fi

echo "🏥 Running comprehensive health checks for $ENVIRONMENT environment"

# Check deployment status
echo "📊 Checking deployment status..."
kubectl get deployment $APP_NAME -n $NAMESPACE
kubectl rollout status deployment/$APP_NAME -n $NAMESPACE

# Check pod status
echo "🔍 Checking pod status..."
kubectl get pods -l app=$APP_NAME -n $NAMESPACE

# Check service endpoints
echo "🌐 Checking service endpoints..."
kubectl get endpoints $APP_NAME -n $NAMESPACE

# Application health check
echo "🏥 Running application health checks..."
SERVICE_IP=$(kubectl get svc $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')

# Health endpoint
echo "Checking /api/health endpoint..."
kubectl run health-check --rm -i --restart=Never --image=curlimages/curl -- curl -f http://$SERVICE_IP/api/health

# Platform status
echo "Checking /api/platform-status endpoint..."
kubectl run platform-check --rm -i --restart=Never --image=curlimages/curl -- curl -f http://$SERVICE_IP/api/platform-status

# System health
echo "Checking /api/system-health endpoint..."
kubectl run system-check --rm -i --restart=Never --image=curlimages/curl -- curl -f http://$SERVICE_IP/api/system-health

# Load test
echo "🚀 Running basic load test..."
kubectl run load-test --rm -i --restart=Never --image=curlimages/curl -- \
  sh -c "for i in \$(seq 1 50); do curl -f http://$SERVICE_IP/ && echo 'Request \$i OK'; done"

# Resource usage check
echo "📈 Checking resource usage..."
kubectl top pods -l app=$APP_NAME -n $NAMESPACE

# Check HPA status
echo "🔄 Checking HPA status..."
kubectl get hpa $APP_NAME -n $NAMESPACE

# Check ingress
echo "🌐 Checking ingress..."
kubectl get ingress $APP_NAME -n $NAMESPACE

# Security checks
echo "🔒 Running security checks..."
kubectl auth can-i --list --as=system:serviceaccount:$NAMESPACE:$APP_NAME

echo "✅ All health checks passed for $ENVIRONMENT environment!"
