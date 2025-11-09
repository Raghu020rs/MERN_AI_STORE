#!/bin/bash

# Security Testing Script
# Tests all security features implemented

API="http://localhost:5000/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 SECURITY TESTING SUITE"
echo "================================"
echo ""

# Check if server is running
echo "🔍 Checking if backend is running..."
if ! curl -s -f $API/tools > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend not running!${NC}"
    echo -e "${YELLOW}Please start backend: cd backend && npm run dev${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Test 1: Weak Password - Too Short
echo "================================"
echo -e "${BLUE}Test 1: Weak Password - Too Short (< 8 chars)${NC}"
echo "Expected: ❌ Rejected"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test1@security.test","password":"Pass1!"}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "at least 8"; then
    echo -e "${GREEN}✅ PASS - Weak password rejected${NC}"
else
    echo -e "${RED}❌ FAIL - Weak password not rejected${NC}"
fi
echo ""

# Test 2: Weak Password - No Uppercase
echo "================================"
echo -e "${BLUE}Test 2: Weak Password - No Uppercase${NC}"
echo "Expected: ❌ Rejected"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test2@security.test","password":"password123!"}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "uppercase\|complexity\|contain"; then
    echo -e "${GREEN}✅ PASS - Weak password rejected${NC}"
else
    echo -e "${RED}❌ FAIL - Weak password not rejected${NC}"
fi
echo ""

# Test 3: Weak Password - No Special Character
echo "================================"
echo -e "${BLUE}Test 3: Weak Password - No Special Character${NC}"
echo "Expected: ❌ Rejected"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test3@security.test","password":"Password123"}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "special\|complexity\|contain"; then
    echo -e "${GREEN}✅ PASS - Weak password rejected${NC}"
else
    echo -e "${RED}❌ FAIL - Weak password not rejected${NC}"
fi
echo ""

# Test 4: Strong Password
echo "================================"
echo -e "${BLUE}Test 4: Strong Password${NC}"
echo "Expected: ✅ Accepted (or email exists)"
TIMESTAMP=$(date +%s)
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"strongpass$TIMESTAMP@security.test\",\"password\":\"StrongP@ss123\"}")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "success\|token\|user"; then
    echo -e "${GREEN}✅ PASS - Strong password accepted${NC}"
elif echo "$RESPONSE" | grep -q -i "email.*exists"; then
    echo -e "${YELLOW}⚠️  PASS - Email exists (password validation working)${NC}"
else
    echo -e "${RED}❌ FAIL - Strong password not accepted${NC}"
fi
echo ""

# Test 5: Input Sanitization - HTML Tags
echo "================================"
echo -e "${BLUE}Test 5: Input Sanitization - HTML Tags${NC}"
echo "Expected: HTML tags removed or request rejected"
TIMESTAMP=$(date +%s)
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"<b>Hacker</b>\",\"email\":\"html$TIMESTAMP@security.test\",\"password\":\"StrongP@ss123\"}")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -v "<b>"; then
    echo -e "${GREEN}✅ PASS - HTML tags sanitized${NC}"
else
    echo -e "${RED}❌ FAIL - HTML tags not sanitized${NC}"
fi
echo ""

# Test 6: NoSQL Injection Attempt
echo "================================"
echo -e "${BLUE}Test 6: NoSQL Injection Prevention${NC}"
echo "Expected: ❌ Rejected or sanitized"
RESPONSE=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":{"$gt":""}}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "invalid\|error\|validation"; then
    echo -e "${GREEN}✅ PASS - NoSQL injection blocked${NC}"
else
    echo -e "${RED}❌ FAIL - NoSQL injection not blocked${NC}"
fi
echo ""

# Test 7: Rate Limiting - 6 Login Attempts
echo "================================"
echo -e "${BLUE}Test 7: Rate Limiting - Login Attempts${NC}"
echo "Expected: 6th attempt should be rate limited"
echo "Testing 6 failed login attempts..."
RATE_LIMITED=false
for i in {1..6}; do
    echo -n "Attempt $i: "
    RESPONSE=$(curl -s -X POST $API/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"fake@test.com","password":"wrongpassword"}')
    
    if echo "$RESPONSE" | grep -q -i "too many\|rate limit\|429"; then
        echo -e "${YELLOW}Rate limited!${NC}"
        RATE_LIMITED=true
        break
    elif [ $i -eq 6 ]; then
        echo -e "${RED}Not rate limited (should be blocked)${NC}"
    else
        echo -e "Failed (expected)"
    fi
    sleep 0.5
done

if [ "$RATE_LIMITED" = true ]; then
    echo -e "${GREEN}✅ PASS - Rate limiting working${NC}"
else
    echo -e "${RED}❌ FAIL - Rate limiting not working${NC}"
fi
echo ""

# Test 8: XSS Prevention - Script Tags
echo "================================"
echo -e "${BLUE}Test 8: XSS Prevention - Script Tags${NC}"
echo "Expected: Script tags removed or rejected"
TIMESTAMP=$(date +%s)
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"<script>alert('xss')</script>Test\",\"email\":\"xss$TIMESTAMP@security.test\",\"password\":\"StrongP@ss123\"}")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -v "<script>"; then
    echo -e "${GREEN}✅ PASS - Script tags sanitized${NC}"
else
    echo -e "${RED}❌ FAIL - Script tags not sanitized${NC}"
fi
echo ""

# Summary
echo "================================"
echo -e "${GREEN}🎉 SECURITY TEST SUITE COMPLETE!${NC}"
echo ""
echo "Review the results above to ensure all security features are working."
echo ""
echo "Expected Results:"
echo "  ✅ Weak passwords rejected (Tests 1-3)"
echo "  ✅ Strong passwords accepted (Test 4)"
echo "  ✅ HTML tags sanitized (Test 5)"
echo "  ✅ NoSQL injection blocked (Test 6)"
echo "  ✅ Rate limiting active (Test 7)"
echo "  ✅ XSS prevented (Test 8)"
echo ""
echo "================================"
