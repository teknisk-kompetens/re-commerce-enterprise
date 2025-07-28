
#!/bin/bash
set -e

IMAGE=$1
NAMESPACE="re-commerce-enterprise"
APP_NAME="re-commerce-enterprise"

if [ -z "$IMAGE" ]; then
  echo "Usage: $0 <image>"
  exit 1
fi

echo "🚀 Starting blue-green deployment for $APP_NAME"
echo "📦 Image: $IMAGE"

# Get current deployment
CURRENT_DEPLOYMENT=$(kubectl get deployment $APP_NAME -n $NAMESPACE -o jsonpath='{.metadata.labels.color}' 2>/dev/null || echo "blue")

# Determine new deployment color
if [ "$CURRENT_DEPLOYMENT" = "blue" ]; then
  NEW_COLOR="green"
  OLD_COLOR="blue"
else
  NEW_COLOR="blue"
  OLD_COLOR="green"
fi

echo "🔄 Deploying to $NEW_COLOR (current: $OLD_COLOR)"

# Create new deployment
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $APP_NAME-$NEW_COLOR
  namespace: $NAMESPACE
  labels:
    app: $APP_NAME
    color: $NEW_COLOR
spec:
  replicas: 3
  selector:
    matchLabels:
      app: $APP_NAME
      color: $NEW_COLOR
  template:
    metadata:
      labels:
        app: $APP_NAME
        color: $NEW_COLOR
    spec:
      serviceAccountName: $APP_NAME
      containers:
      - name: $APP_NAME
        image: $IMAGE
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DEPLOYMENT_COLOR
          value: "$NEW_COLOR"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
EOF

# Wait for new deployment to be ready
echo "⏳ Waiting for $NEW_COLOR deployment to be ready..."
kubectl rollout status deployment/$APP_NAME-$NEW_COLOR -n $NAMESPACE --timeout=300s

# Health check
echo "🏥 Running health checks..."
kubectl wait --for=condition=ready pod -l app=$APP_NAME,color=$NEW_COLOR -n $NAMESPACE --timeout=300s

# Test new deployment
HEALTH_CHECK_URL="http://$(kubectl get svc $APP_NAME -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')/api/health"
for i in {1..5}; do
  if kubectl run health-check-$i --rm -i --restart=Never --image=curlimages/curl -- curl -f $HEALTH_CHECK_URL; then
    echo "✅ Health check $i passed"
  else
    echo "❌ Health check $i failed"
    exit 1
  fi
  sleep 2
done

# Switch traffic to new deployment
echo "🔀 Switching traffic to $NEW_COLOR deployment..."
kubectl patch service $APP_NAME -n $NAMESPACE -p '{"spec":{"selector":{"color":"'$NEW_COLOR'"}}}'

# Verify traffic switch
echo "⏳ Verifying traffic switch..."
sleep 10

# Final health check
for i in {1..3}; do
  if kubectl run final-health-check-$i --rm -i --restart=Never --image=curlimages/curl -- curl -f $HEALTH_CHECK_URL; then
    echo "✅ Final health check $i passed"
  else
    echo "❌ Final health check $i failed - rolling back!"
    kubectl patch service $APP_NAME -n $NAMESPACE -p '{"spec":{"selector":{"color":"'$OLD_COLOR'"}}}'
    exit 1
  fi
  sleep 2
done

# Clean up old deployment
echo "🧹 Cleaning up old $OLD_COLOR deployment..."
kubectl delete deployment $APP_NAME-$OLD_COLOR -n $NAMESPACE --ignore-not-found=true

# Update main deployment label
kubectl label deployment $APP_NAME-$NEW_COLOR -n $NAMESPACE color=$NEW_COLOR --overwrite

echo "🎉 Blue-green deployment completed successfully!"
echo "🌐 $APP_NAME is now running on $NEW_COLOR with image $IMAGE"
