#!/bin/bash

# Quick Security Test
# Tests password validation with valid .com email

API="http://localhost:5000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 QUICK SECURITY TEST"
echo "================================"
echo ""

# Test 1: Weak Password - Too Short
echo "Test 1: Weak Password (< 8 chars)"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test1@gmail.com","password":"Pass1!"}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "at least 8"; then
    echo -e "${GREEN}✅ PASS${NC}\n"
else
    echo -e "${RED}❌ FAIL${NC}\n"
fi

# Test 2: Weak Password - No Special Character  
echo "Test 2: Weak Password (no special char)"
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test2@gmail.com","password":"Password123"}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "special"; then
    echo -e "${GREEN}✅ PASS${NC}\n"
else
    echo -e "${RED}❌ FAIL${NC}\n"
fi

# Test 3: Strong Password
echo "Test 3: Strong Password"
TIMESTAMP=$(date +%s)
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"secure${TIMESTAMP}@gmail.com\",\"password\":\"StrongP@ss123\"}")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "success\|token"; then
    echo -e "${GREEN}✅ PASS - Account created${NC}\n"
elif echo "$RESPONSE" | grep -q -i "exists"; then
    echo -e "${YELLOW}✅ PASS - Email validation working${NC}\n"
else
    echo -e "${RED}❌ FAIL${NC}\n"
fi

# Test 4: NoSQL Injection
echo "Test 4: NoSQL Injection Prevention"
RESPONSE=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":{"$gt":""}}')
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
if echo "$RESPONSE" | grep -q -i "invalid\|validation\|error"; then
    echo -e "${GREEN}✅ PASS${NC}\n"
else
    echo -e "${RED}❌ FAIL${NC}\n"
fi

# Test 5: Rate Limiting Test
echo "Test 5: Rate Limiting (5 login attempts)"
echo "Making 6 failed login attempts..."
for i in {1..6}; do
    echo -n "  Attempt $i... "
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $API/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"fake@gmail.com","password":"wrong"}')
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "429" ] || echo "$BODY" | grep -q -i "too many\|rate limit"; then
        echo -e "${YELLOW}RATE LIMITED!${NC}"
        echo -e "${GREEN}✅ PASS - Rate limiting working${NC}"
        break
    elif [ $i -eq 6 ]; then
        echo "Failed"
        echo -e "${RED}❌ FAIL - Should be rate limited${NC}"
    else
        echo "Failed (expected)"
    fi
    sleep 1
done

echo ""
echo "================================"
echo "Test complete!"
