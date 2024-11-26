const { validateReport } = require("../helpers/validation");
const { createNotFoundError } = require("../middlewares/errorHandler");
const {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  verifyReportById,
  deleteReportById,
  rejectReportById,
} = require("../models/report");

const addReport = async (req, res, next) => {
  try {
    const { error } = validateReport(req.body);
    if (error) {
      return next(error);
    }

    const newReport = req.body;
    newReport.status = "pending";

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
    const reports = await getAllReports();
    res.status(200).json({
      success: true,
      message: "All reports successfully retrieved",
      data: reports,
    });
  } catch (error) {
    next(error);
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

    if (!report) {
      return next(createNotFoundError(`Report with ID ${reportId} not found`));
    }

    const updatedData = req.body;

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

    await rejectReportById(reportId);
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

    if (!report) {
      return next(createNotFoundError(`Report with ID ${reportId} not found`));
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

module.exports = {
  addReport,
  getAllReport,
  getOneReport,
  updateReport,
  verifyReport,
  rejectReport,
  deleteReport,
};