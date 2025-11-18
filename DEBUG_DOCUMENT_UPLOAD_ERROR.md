# Debug Document Upload Error - Step by Step

## 🔍 What to Check Now

I've improved the error handling. Now when you try to upload, you'll see **detailed error messages** in the browser console.

---

## ✅ Step 1: Check Browser Console (MOST IMPORTANT)

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Try uploading a document**
4. **Look for these messages:**

```
Document upload error: [full error object]
Error response: [response details]
Error status: [status code]
Error data: [error message from server]
```

**Share these details** - They will tell us exactly what's wrong!

---

## ✅ Step 2: Check Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Try uploading a document**
4. **Find the request** to `/api/users/documents/...`
5. **Click on it** and check:

### Request Tab:
- **URL:** Should be `http://localhost:5000/api/users/documents/[documentType]`
- **Method:** Should be `POST`
- **Headers:** Should have `Authorization: Bearer [token]`
- **Payload:** Should have file data

### Response Tab:
- **Status Code:** 
  - `200` = Success ✅
  - `401` = Not logged in
  - `400` = Bad request (invalid file/type)
  - `404` = Route not found
  - `500` = Server error
  - `Network Error` = Backend not running

- **Response Body:** Should show error message from server

**Share the status code and response body!**

---

## ✅ Step 3: Check Backend Console

1. **Look at your backend terminal**
2. **Try uploading a document**
3. **Look for error messages**

**Common backend errors:**
```
Error: ENOENT: no such file or directory 'uploads/documents'
→ Upload directory doesn't exist (should auto-create, but check)

MongoDB connection error
→ Database not connected

ValidationError
→ Invalid data

MulterError: File too large
→ File exceeds 10MB
```

**Share any error messages from backend!**

---

## ✅ Step 4: Verify Backend is Running

**Check backend terminal:**
- Should see: `🚀 Server running on port 5000`
- Should see: `✅ MongoDB connected successfully`

**If not running:**
```bash
cd backend
npm run dev
```

---

## ✅ Step 5: Check Authentication

**Make sure you're logged in:**
1. Check if you have a token in localStorage
2. Open browser console and type:
```javascript
localStorage.getItem('token')
```
3. Should return a token string (not null)

**If no token:**
- Log out and log back in
- Try uploading again

---

## 🎯 Common Error Messages and Solutions

### Error: "Não foi possível conectar ao servidor"
**Cause:** Backend not running  
**Solution:** Start backend server

### Error: "Sessão expirada. Por favor, faça login novamente."
**Cause:** Token expired  
**Solution:** Log out and log back in

### Error: "Rota não encontrada"
**Cause:** Backend route not configured  
**Solution:** Check backend routes

### Error: "Erro no servidor"
**Cause:** Backend error (check backend logs)  
**Solution:** Check backend console for details

### Error: "Tipo de arquivo não permitido"
**Cause:** Wrong file type  
**Solution:** Use PDF, JPG, PNG, or WEBP

### Error: "Arquivo muito grande"
**Cause:** File > 10MB  
**Solution:** Compress or reduce file size

---

## 📋 Quick Checklist

Before trying again, verify:

- [ ] Backend server is running (`🚀 Server running on port 5000`)
- [ ] MongoDB is connected (`✅ MongoDB connected`)
- [ ] You are logged in (check localStorage for token)
- [ ] File type is correct (PDF, JPG, PNG, WEBP)
- [ ] File size is under 10MB
- [ ] Browser console shows detailed error (after my fix)

---

## 🔧 What I Fixed

I've improved the error handling to:
1. ✅ **Log full error details** to browser console
2. ✅ **Show specific error messages** based on error type
3. ✅ **Detect network errors** (server not running)
4. ✅ **Show authentication errors** clearly

**Now when you try to upload, check the browser console for detailed error information!**

---

## 📞 Next Steps

1. **Try uploading a document again**
2. **Check browser console** (F12 → Console tab)
3. **Copy the error messages** you see
4. **Share them with me** so I can help fix the specific issue

The detailed error messages will tell us exactly what's wrong! 🎯

