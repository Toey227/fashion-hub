import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint 1: Health Check (สำหรับใช้ป้องกัน Supabase หลับ)
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Database is active' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Endpoint 2: Login แบบง่าย (ตามโจทย์การบ้าน)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    
    // ถ้ายอมให้สมัครใหม่ตอนล็อกอินได้เลย (เพื่อความง่ายในการเทสต์) ให้ใช้โค้ดส่วนนี้
    if (!user) {
      user = await prisma.user.create({
        data: { email, password }
      });
    }

    if (user.password === password) {
      res.json({ success: true, userId: user.id });
    } else {
      res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint 3: ดึงข้อมูลตะกร้าสินค้าของ User นั้นๆ
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: Number(userId) }
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Endpoint 4: เพิ่มสินค้าลงตะกร้า
app.post('/api/cart', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const newItem = await prisma.cart.create({
      data: { userId: Number(userId), productId: Number(productId) }
    });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Endpoint 5: ลบสินค้าออกจากตะกร้า
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: Number(userId) }
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.get('/', (req, res) => {
  res.send('Fashion-Hub API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});