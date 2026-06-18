# HanzAI - Setup Guide

## 🚀 Instalasi & Cara Menjalankan

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git
- npm atau yarn

---

## ✅ Backend Setup

### 1. Masuk ke folder backend
```bash
cd backend
```

### 2. Buat virtual environment
```bash
python -m venv venv
```

### 3. Aktifkan virtual environment

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Jalankan server
```bash
python -m uvicorn app.main:app --reload --port 8000
```

Backend akan berjalan di: **http://localhost:8000**

---

## ✅ Frontend Setup

### 1. Masuk ke folder frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan development server
```bash
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## 🐳 Docker Setup (Optional)

Jika ingin menggunakan Docker:

```bash
docker-compose up --build
```

Ini akan menjalankan backend dan frontend secara bersamaan.

---

## 📋 Endpoint API

### Health Check
```
GET /api/health
```

### Send Message
```
POST /api/chat/send
Body: {
  "conversation_id": null,
  "message": "Halo HanzAI",
  "user_id": 1
}
```

### Get Conversations
```
GET /api/chat/conversations?user_id=1
```

### Get History
```
GET /api/chat/history/{conversation_id}
```

---

## 🎨 Fitur

✅ Real-time chat
✅ Conversation history
✅ Modern UI (mirip Gemini)
✅ AI responses
✅ Database integration
✅ CORS enabled

---

## 📝 Troubleshooting

### Backend tidak bisa connect ke frontend
- Pastikan CORS sudah dikonfigurasi dengan benar
- Periksa port (backend: 8000, frontend: 5173)
- Restart kedua server

### Database error
- Pastikan folder backend punya write permission
- Database akan auto-created saat pertama kali jalankan

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah berjalan di port 8000
- Periksa `.env` di frontend
- Buka DevTools untuk melihat error detail

---

## 🔗 Links

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

---

**Selamat menggunakan HanzAI!** 🎉