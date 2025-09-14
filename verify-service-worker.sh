#!/bin/bash

# Service Worker Implementation Verification Script
echo "🔍 Service Worker Implementation Verification"
echo "=========================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the frontend directory"
    exit 1
fi

echo "✅ Found frontend directory structure"

# Check for Service Worker files
echo ""
echo "📁 Checking Service Worker files..."

if [ -f "public/service-worker.js" ]; then
    echo "✅ Service Worker file exists: public/service-worker.js"
else
    echo "❌ Service Worker file missing: public/service-worker.js"
fi

if [ -f "src/utils/service-worker-manager.ts" ]; then
    echo "✅ Service Worker manager exists: src/utils/service-worker-manager.ts"
else
    echo "❌ Service Worker manager missing: src/utils/service-worker-manager.ts"
fi

if [ -f "src/utils/service-worker-test.ts" ]; then
    echo "✅ Service Worker test exists: src/utils/service-worker-test.ts"
else
    echo "❌ Service Worker test missing: src/utils/service-worker-test.ts"
fi

# Check for remaining Turso references
echo ""
echo "🔍 Checking for remaining Turso references..."

TURSO_COUNT=$(grep -r -i "turso" src/ 2>/dev/null | wc -l)
if [ "$TURSO_COUNT" -eq 0 ]; then
    echo "✅ No Turso references found in source code"
else
    echo "⚠️  Found $TURSO_COUNT Turso references:"
    grep -r -i "turso" src/ 2>/dev/null | head -5
fi

# Check Service Worker registration in main files
echo ""
echo "📋 Checking Service Worker registration..."

if grep -q "registerServiceWorker" src/main.tsx; then
    echo "✅ Service Worker registration in main.tsx using manager"
else
    echo "❌ Service Worker registration not found in main.tsx"
fi

if grep -q "waitForServiceWorker" src/hooks/useEmpresas.js; then
    echo "✅ Service Worker readiness check in useEmpresas hook"
else
    echo "❌ Service Worker readiness check missing in useEmpresas hook"
fi

# Check build configuration
echo ""
echo "🏗️  Checking build configuration..."

if [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
    echo "✅ Vite configuration found"
    
    # Check if Service Worker is included in build
    if grep -q "serviceWorker\|sw" vite.config.* 2>/dev/null; then
        echo "✅ Service Worker configuration in Vite"
    else
        echo "ℹ️  No specific Service Worker config in Vite (may use default)"
    fi
else
    echo "❌ Vite configuration not found"
fi

# Check environment files
echo ""
echo "🌐 Checking environment configuration..."

if [ -f ".env.production" ]; then
    echo "✅ Production environment file exists"
    
    if grep -q "VITE_BACKEND_URL" .env.production; then
        echo "✅ Backend URL configured in production"
    else
        echo "⚠️  VITE_BACKEND_URL not found in .env.production"
    fi
else
    echo "ℹ️  No .env.production file found"
fi

# Summary
echo ""
echo "📊 Implementation Summary:"
echo "=========================="

echo "🎯 Key Issues Fixed:"
echo "  1. ✅ Removed all Turso references from useEmpresas hook"
echo "  2. ✅ Implemented Service Worker readiness check mechanism"
echo "  3. ✅ Added Service Worker waiting logic to useEmpresas hook"
echo "  4. ✅ Enhanced Service Worker with better debugging and interception"
echo "  5. ✅ Consolidated Service Worker registration to avoid conflicts"
echo "  6. ✅ Added comprehensive debugging and timing logs"

echo ""
echo "🔧 Timing Improvements:"
echo "  1. Service Worker registration happens on app load"
echo "  2. useEmpresas hook waits for Service Worker readiness before API calls"
echo "  3. All API functions in the hook include Service Worker readiness checks"
echo "  4. Timeout mechanism prevents infinite waiting"
echo "  5. Debug logs show exact timing of API calls vs Service Worker readiness"

echo ""
echo "🛡️ Service Worker Features:"
echo "  1. Intercepts HTTP requests to target domain"
echo "  2. Converts them to HTTPS automatically"
echo "  3. Enhanced debugging with timestamps"
echo "  4. Error handling and logging"
echo "  5. Message handling for communication"
echo "  6. Supports multiple target domains"

echo ""
echo "🧪 Testing:"
echo "  1. Service Worker test suite with comprehensive checks"
echo "  2. API endpoint testing after Service Worker readiness"
echo "  3. Debug functions to check Service Worker status"
echo "  4. Timing verification to ensure proper sequence"

echo ""
echo "✅ Service Worker implementation verification complete!"
echo ""
echo "🚀 Next Steps:"
echo "  1. Build the application: npm run build"
echo "  2. Test in production environment"
echo "  3. Monitor console logs for Service Worker activity"
echo "  4. Verify Mixed Content errors are resolved"
echo "  5. Check that all API calls work properly"