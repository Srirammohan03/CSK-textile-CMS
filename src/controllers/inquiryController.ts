import type { Request, Response } from "express";
import prisma from "../config/db.js";
import type { Prisma } from "@prisma/client";

// @desc    Submit a new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, type, productCategory, productName } =
      req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        type,
        productCategory,
        productName,
      },
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchValue = String(search || "").trim();

    const where: Prisma.InquiryWhereInput = searchValue
      ? {
          OR: [
            {
              name: { contains: String(searchValue), mode: "insensitive" },
            },
            {
              email: { contains: String(searchValue), mode: "insensitive" },
            },
            {
              phone: { contains: String(searchValue), mode: "insensitive" },
            },
            ...(isNaN(Date.parse(searchValue))
              ? []
              : [
                  {
                    createdAt: {
                      gte: new Date(new Date(searchValue).setHours(0, 0, 0, 0)),
                      lte: new Date(
                        new Date(searchValue).setHours(23, 59, 59, 999),
                      ),
                    },
                  },
                ]),
          ],
        }
      : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.inquiry.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Inquiry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
