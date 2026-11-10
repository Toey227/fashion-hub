import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Database is active' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    
   
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


app.post('/api/cart', async (req, res) => {
  const { userId, productId, selectedSize, selectedStyle, selectedImage } = req.body;
  try {
    const newItem = await prisma.cart.create({
      data: { 
        userId: Number(userId), 
        productId: Number(productId),
        selectedSize,
        selectedStyle,
        selectedImage
      }
    });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.delete('/api/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    await prisma.cart.delete({
      where: { id: Number(cartId) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item from cart' });
  }
});


app.get('/api/wishlist/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: Number(userId) }
    });
    res.json(wishlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});


app.post('/api/wishlist/toggle', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const existingItem = await prisma.wishlist.findFirst({
      where: { userId: Number(userId), productId: Number(productId) }
    });

    if (existingItem) {
     
      await prisma.wishlist.delete({ where: { id: existingItem.id } });
      res.json({ success: true, action: 'removed' });
    } else {
      
      await prisma.wishlist.create({
        data: { userId: Number(userId), productId: Number(productId) }
      });
      res.json({ success: true, action: 'added' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/', (req, res) => {
  res.send('Fashion-Hub API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

