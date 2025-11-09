# 🗄️ MongoDB Atlas Setup Guide

Complete step-by-step guide to setup free MongoDB database for your AI Tools Marketplace.

---

## 📋 Prerequisites

- Email address (for MongoDB account)
- Internet connection
- 5 minutes of time

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Click **"Try Free"** or **"Sign Up"**
3. Choose signup method:
   - **Option A**: Sign up with Google
   - **Option B**: Sign up with Email
4. Fill in details:
   - First Name: Your name
   - Last Name: Your last name
   - Email: Your email
   - Password: Create strong password
5. Click **"Create your Atlas account"**
6. Verify your email if required

✅ **Account created!**

---

### Step 2: Create a Free Cluster

1. After login, you'll see **"Welcome to Atlas"** page
2. Click **"Build a Database"** button
3. Choose deployment option:
   - Select **"M0 FREE"** tier (Left option)
   - This gives you 512 MB storage (Perfect for MVP!)
4. Cloud Provider & Region:
   - Provider: **AWS** (recommended) or Google Cloud
   - Region: Choose closest to your users
     - For India: `ap-south-1` (Mumbai)
     - For USA: `us-east-1` (N. Virginia)
     - For Europe: `eu-west-1` (Ireland)
5. Cluster Name:
   - Keep default or name it: `ai-marketplace-cluster`
6. Click **"Create"** button
7. Wait 1-3 minutes for cluster creation

✅ **Cluster created!**

---

### Step 3: Create Database User

1. You'll see **"Security Quickstart"** page
2. Under **"How would you like to authenticate your connection?"**
3. Choose **"Username and Password"** (already selected)
4. Create credentials:
   - **Username**: `aimarketplace` (or any name you like)
   - **Password**: Click **"Autogenerate Secure Password"**
     - **IMPORTANT**: Copy this password and save it somewhere safe!
     - Or create your own password (min 8 characters)
5. Click **"Create User"**

✅ **Database user created!**

---

### Step 4: Configure Network Access

1. Scroll down to **"Where would you like to connect from?"**
2. Choose **"My Local Environment"**
3. Add IP Address:
   - Click **"Add My Current IP Address"**
   - OR for development, allow all IPs:
     - Click **"Add IP Address"**
     - Enter: `0.0.0.0/0`
     - Description: `Allow all IPs (Development)`
     - Click **"Add Entry"**

⚠️ **Note**: `0.0.0.0/0` allows connections from anywhere (good for development). For production, restrict to your server IPs.

4. Click **"Finish and Close"**
5. Click **"Go to Databases"**

✅ **Network access configured!**

---

### Step 5: Get Connection String

1. On **Databases** page, you'll see your cluster
2. Click **"Connect"** button (on your cluster)
3. Choose connection method:
   - Click **"Drivers"**
4. Select driver:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Modify the connection string:
   - Replace `<username>` with your database username (e.g., `aimarketplace`)
   - Replace `<password>` with your actual password (saved in Step 3)
   - Add database name: `ai-marketplace`

**Example:**
```
# Before:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# After:
mongodb+srv://aimarketplace:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/ai-marketplace?retryWrites=true&w=majority
```

✅ **Connection string ready!**

---

### Step 6: Update Backend .env File

1. Open your project in VS Code
2. Navigate to: `backend/.env`
3. Update the `MONGODB_URI` line:

```env
MONGODB_URI=mongodb+srv://aimarketplace:YourPassword@cluster0.xxxxx.mongodb.net/ai-marketplace?retryWrites=true&w=majority
```

Replace with **your actual connection string** from Step 5.

4. Save the file (`Ctrl + S`)

✅ **.env file updated!**

---

### Step 7: Test Database Connection

1. Open terminal in VS Code
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Look for success message:
   ```
   ✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
   📊 Database Name: ai-marketplace
   🚀 Server running in development mode
   ```

✅ **Database connected successfully!**

---

## 🎯 Verification Checklist

After setup, verify everything is working:

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created with password saved
- [ ] Network access configured (0.0.0.0/0 for development)
- [ ] Connection string copied
- [ ] Connection string updated in backend/.env
- [ ] Backend server starts without errors
- [ ] Database connection success message appears

---

## 🔧 Troubleshooting

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution**:
- Check your internet connection
- Verify `MONGODB_URI` in `.env` is correct
- Ensure IP address is whitelisted (use 0.0.0.0/0)

### Error: "Authentication failed"

**Solution**:
- Verify username and password in connection string
- Check if password contains special characters (URL encode them)
- Create a new database user if needed

### Error: "Database name not found"

**Solution**:
- Add database name in connection string: `/ai-marketplace?retryWrites=true`
- Database will be created automatically on first data insert

### Special Characters in Password

If your password contains special characters, URL encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |

**Example**:
```
Password: MyP@ss:word
Encoded: MyP%40ss%3Aword
```

---

## 📊 MongoDB Atlas Dashboard Features

### View Collections
1. Click **"Browse Collections"** button
2. See all your data:
   - `users` - All registered users
   - `tools` - AI tools data
   - `reviews` - User reviews
   - `collections` - User collections
   - `installations` - Installation stats

### Monitor Database
1. Click **"Metrics"** tab
2. View:
   - Database operations
   - Network traffic
   - Storage usage

### Backup & Restore
1. Free tier includes daily backups
2. Restore from backup if needed

---

## 🎓 What's Next?

Now that MongoDB is setup:

1. ✅ **Test Authentication APIs**
   - Register a new user
   - Login with credentials
   - Get user profile
   - Update profile

2. 📦 **Build Tool Model**
   - Add 128 AI tools to database
   - Implement CRUD operations
   - Add search functionality

3. ⭐ **Build Bookmarks System**
   - Save user bookmarks to database
   - Sync across devices

4. 📝 **Build Reviews System**
   - Allow users to review tools
   - Calculate average ratings

5. 📁 **Build Collections System**
   - Create custom tool collections
   - Share with others

---

## 🔐 Security Best Practices

For **Production**:

1. **Restrict IP Addresses**:
   - Remove `0.0.0.0/0`
   - Add only your server IPs

2. **Use Strong Passwords**:
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

3. **Enable Encryption**:
   - Atlas provides encryption at rest (default)
   - Use SSL/TLS for connections (default)

4. **Regular Backups**:
   - Atlas provides automated backups
   - Test restore process

5. **Monitor Activity**:
   - Check database logs regularly
   - Set up alerts for unusual activity

---

## 💡 Free Tier Limits

MongoDB Atlas M0 Free Tier includes:

| Feature | Limit |
|---------|-------|
| Storage | 512 MB |
| RAM | Shared |
| Connections | 500 concurrent |
| Databases | Unlimited |
| Collections | Unlimited |
| Documents | Unlimited (within 512MB) |
| Backups | 8 GB |

**Perfect for MVP!** Upgrade when you need more resources.

---

## 📞 Support

If you face any issues:

1. **MongoDB Documentation**: https://docs.atlas.mongodb.com/
2. **Community Forums**: https://www.mongodb.com/community/forums/
3. **YouTube Tutorials**: Search "MongoDB Atlas setup"
4. **Stack Overflow**: Tag your questions with `mongodb` and `mongodb-atlas`

---

**Your MongoDB database is ready! 🎉**

Now proceed to test your authentication APIs with Postman!
