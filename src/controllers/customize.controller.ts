import type { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import type { Request, Response } from "express";

export const createCustomizeMaterial = async (req: Request, res: Response) => {
  try {
    const {
      outfit,
      name,
      family,
      subLabel,
      pattern,
      premium,
      lightweight,
      textureImage,
    } = req.body;

    // Validate only required fields
    if (!outfit || !name || !family || !subLabel) {
      return res.status(400).json({
        message: "outfit, name, family and subLabel are required",
      });
    }

    const material = await prisma.customizeMaterial.create({
      data: {
        outfit,
        name,
        family,
        subLabel,

        // Optional fields
        pattern,
        premium,
        lightweight,
        textureImage,
      },
    });

    return res.status(201).json({
      message: "Customize material created successfully",
      material,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCustomizeShirts = async (req: Request, res: Response) => {
  try {
    const customizes = await prisma.customizeMaterial.findMany({
      where: { outfit: "Shirt" },
    });

    // if (!customizes || customizes?.length === 0) {
    //   res.status(404).json([]);
    // }

    res.json({ customizes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCustomizeSuit = async (req: Request, res: Response) => {
  try {
    const customizes = await prisma.customizeMaterial.findMany({
      where: { outfit: "Suit" },
    });

    // if (!customizes || customizes?.length === 0) {
    //   res.status(404).json([]);
    // }

    res.json({ customizes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCustomizeWedding = async (req: Request, res: Response) => {
  try {
    const customizes = await prisma.customizeMaterial.findMany({
      where: { outfit: "Wedding_outfit" },
    });

    // if (!customizes || customizes?.length === 0) {
    //   res.status(404).json([]);
    // }

    res.json({ customizes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCustomize = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchValue = search?.toString().trim();

    const where: Prisma.CustomizeMaterialWhereInput = searchValue
      ? {
          OR: [
            { name: { contains: searchValue, mode: "insensitive" } },
            { family: { contains: searchValue, mode: "insensitive" } },
            { subLabel: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {};

    const customizes = await prisma.customizeMaterial.findMany({
      where,
    });

    // if (!customizes || customizes?.length === 0) {
    //   res.status(404).json([]);
    // }

    res.json({ customizes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCustomizeMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "Valid id is required",
      });
    }

    const existing = await prisma.customizeMaterial.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Customize material not found",
      });
    }

    const material = await prisma.customizeMaterial.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });

    return res.status(200).json({
      message: "Customize material updated successfully",
      material,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteCustomizeMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "Valid id is required",
      });
    }

    // Check existing record
    const existing = await prisma.customizeMaterial.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Customize material not found",
      });
    }

    // Delete record
    await prisma.customizeMaterial.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Customize material deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
