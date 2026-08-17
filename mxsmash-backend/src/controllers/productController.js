import prisma from "../config/prisma.js";

// GET all products (public)
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET featured products only (public - used on homepage)
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single product by id (public)
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, isFeatured, addOns } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, and categoryId are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId,
        isFeatured: isFeatured || false,
        addOns: addOns || [], // array of {name, price}
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      isAvailable,
      isFeatured,
      addOns,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(categoryId && { category: { connect: { id: categoryId } } }), // fixed: use relation connect instead of raw categoryId
        ...(isAvailable !== undefined && { isAvailable }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(addOns !== undefined && { addOns }),
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
