import type { Request, Response } from "express";
import prisma from "../config/db.js";
import type { Prisma } from "@prisma/client";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "Open" },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all jobs (Admin)
// @route   GET /api/jobs/admin
// @access  Private/Admin
export const getJobsAdmin = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
export const createJob = async (req: any, res: Response) => {
  try {
    const {
      title,
      category,
      description,
      requirements,
      package: pkg,
      location,
      type,
    } = req.body;
    const job = await prisma.job.create({
      data: {
        title,
        category,
        description,
        requirements,
        package: pkg,
        location,
        type,
      },
    });
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
export const updateJob = async (req: any, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    const {
      title,
      category,
      description,
      requirements,
      package: pkg,
      location,
      type,
      status,
    } = req.body;
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        category,
        description,
        requirements,
        package: pkg,
        location,
        type,
        status,
      },
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
export const deleteJob = async (req: any, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    // Delete applications first or rely on cascade
    await prisma.jobApplication.deleteMany({ where: { jobId } });
    await prisma.job.delete({ where: { id: jobId } });
    res.json({ message: "Job removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit application
// @route   POST /api/jobs/apply
// @access  Public
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId, name, email, phone, resumeUrl, message } = req.body;
    const application = await prisma.jobApplication.create({
      data: {
        jobId: parseInt(jobId),
        name,
        email,
        phone,
        resumeUrl,
        message,
      },
    });
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get applications for a job
// @route   GET /api/jobs/:id/applications
// @access  Private/Admin
export const getApplications = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchValue = search?.toString().trim();

    const where: Prisma.JobApplicationWhereInput = searchValue
      ? {
          OR: [
            { name: { contains: searchValue, mode: "insensitive" } },
            { email: { contains: searchValue, mode: "insensitive" } },
            { phone: { contains: searchValue, mode: "insensitive" } },
            { status: { contains: searchValue, mode: "insensitive" } },
          ],
        }
      : {};

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        job: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
