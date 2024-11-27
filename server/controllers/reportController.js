const { validateReport } = require("../helpers/validation");
const {
  createNotFoundError,
  createForbiddenError,
  createError,
} = require("../middlewares/errorHandler");
const {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  verifyReportById,
  deleteReportById,
  rejectReportById,
  getReportsForStats,
} = require("../models/report");
const nodemailer = require("nodemailer");

const addReport = async (req, res, next) => {
  try {
    const newReport = req.body;
    newReport.status = "pending";
    newReport.createdAt = new Date();
    newReport.updatedAt = new Date();
    newReport.creatorId = req.user.data._id;
    newReport.recipients_count = Number(newReport.recipients_count);

    const { error } = validateReport(req.body);
    if (error) {
      return next(error);
    }

    await createReport(newReport);
    res.status(201).json({
      success: true,
      message: "Report added successfully",
      data: req.body,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReport = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await getAllReports(page, limit);
    const reports = data.reports;
    const totalDocuments = data.totalDocuments;

    res.status(200).json({
      success: true,
      message: "All reports successfully retrieved",
      data: reports,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getOneReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const report = await getReportById(reportId);

    if (!report) {
      return next(createNotFoundError(`Report with ID ${reportId} not found`));
    }

    res.status(200).json({
      success: true,
      message: `Report with ID ${reportId} successfully retrieved`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const updateReport = async (req, res, next) => {
  try {
    const { error } = validateReport(req.body);
    if (error) {
      return next(error);
    }

    const reportId = req.params.id;
    let report = await getReportById(reportId);

    if (
      req.user.data._id !== report.creatorId &&
      req.user.data.role !== "admin"
    ) {
      return next(
        createForbiddenError("You are not authorized to delete this report")
      );
    }

    if (!report) {
      return next(createNotFoundError(`Report with ID ${reportId} not found`));
    }

    if (report.status === "verified") {
      return next(
        createForbiddenError(
          `Cannot update report with status ${report.status}`
        )
      );
    }

    const updatedData = req.body;
    updatedData.updatedAt = new Date();

    await updateReportById(reportId, updatedData);
    report = await getReportById(reportId);

    res.status(200).json({
      success: true,
      message: `Report with ID ${reportId} successfully updated`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const verifyReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;

    await verifyReportById(reportId);
    const report = await getReportById(reportId);

    res.status(200).json({
      success: true,
      message: `Report with ID ${reportId} successfully verified`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const rejectReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const { additional_notes } = req.body;

    if (!additional_notes || !additional_notes.trim()) {
      next(createError("Please provide additional notes", 400));
    }

    await rejectReportById(reportId, additional_notes);
    const report = await getReportById(reportId);

    res.status(200).json({
      success: true,
      message: `Report with ID ${reportId} successfully rejected`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const report = await getReportById(reportId);

    if (
      req.user.data._id !== report.creatorId &&
      req.user.data.role !== "admin"
    ) {
      return next(
        createForbiddenError("You are not authorized to delete this report")
      );
    }

    if (!report) {
      return next(createNotFoundError(`Report with ID ${reportId} not found`));
    }

    if (report.status === "verified") {
      return next(
        createForbiddenError(
          `Cannot delete report with status ${report.status}`
        )
      );
    }

    await deleteReportById(reportId);

    res.status(200).json({
      success: true,
      message: `Report with ID ${reportId} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

const sendMail = async (req, res, next) => {
  try {
    const { from, to, subject, message } = req.body;

    if (!from || !to || !subject || !message) {
      return next(
        createError(
          "Please provide all required fields: from, to, subject, and message",
          400
        )
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BansosWatch" ${from}`,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      info,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    try {
      const reports = await getReportsForStats();

      const totalReports = reports.length;

      const recipientsByProgram = reports.reduce((acc, report) => {
        const program = report.program_name;
        const recipients = report.recipients_count || 0;
        acc[program] = (acc[program] || 0) + recipients;
        return acc;
      }, {});

      const distributionByRegion = reports.reduce((acc, report) => {
        const province = report.region.province.name || "Unknown Province";
        const cityOrDistrict =
          report.region.city_or_district.name || "Unknown City/District";
        const subdistrict =
          report.region.subdistrict.name || "Unknown Subdistrict";

        if (!acc[province]) {
          acc[province] = {};
        }

        if (!acc[province][cityOrDistrict]) {
          acc[province][cityOrDistrict] = {};
        }

        if (!acc[province][cityOrDistrict][subdistrict]) {
          acc[province][cityOrDistrict][subdistrict] = 0;
        }

        acc[province][cityOrDistrict][subdistrict] += 1;

        return acc;
      }, {});

      res.status(200).json({
        success: true,
        message: "Report statistics successfully retrieved",
        data: { totalReports, recipientsByProgram, distributionByRegion },
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error("Failed to fetch statistics.");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReport,
  getAllReport,
  getOneReport,
  updateReport,
  verifyReport,
  rejectReport,
  deleteReport,
  sendMail,
  getStats,
};
