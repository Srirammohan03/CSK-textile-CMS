import type { Request, Response } from "express";
import prisma from "../config/db.js";

// @desc    Get dashboard statistics
// @route   GET /api/products/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const categoriesRows = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    const adminUsersCount = await prisma.user.count({
      where: { role: "admin" },
    });

    res.json({
      totalProducts,
      totalCategories: categoriesRows.length,
      adminUsers: adminUsersCount,
      trafficGrowth: "+12.5%", // Mocked trend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: any, res: Response) => {
  try {
    const { category, newArrival, search } = req.query;

    const where: any = {};
    if (category) where.category = category;
    if (newArrival === "true") where.isNewArrival = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          fabric: {
            contains: search,
            mode: "insensitive",
          },
        },
        { price: isNaN(parseFloat(search)) ? undefined : parseFloat(search) },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: any, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: any, res: Response) => {
  try {
    const {
      name,
      category,
      price,
      image,
      description,
      longDescription,
      fabric,
      colors,
      tags,
      style,
      isNewArrival,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        image,
        description,
        longDescription,
        fabric,
        colors,
        tags,
        style,
        isNewArrival: isNewArrival === "true" || isNewArrival === true,
        authorId: parseInt(req.user.id),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: any, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const {
      name,
      category,
      price,
      image,
      description,
      longDescription,
      fabric,
      colors,
      tags,
      style,
      isNewArrival,
    } = req.body;

    const data: any = {
      name,
      category,
      price: price ? parseFloat(price) : 0,
      image,
      description,
      longDescription,
      fabric,
      colors,
      tags,
      style,
    };

    if (isNewArrival !== undefined) {
      data.isNewArrival = isNewArrival === true;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: any, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id: productId },
    });
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
