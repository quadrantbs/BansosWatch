const { ObjectId } = require("mongodb");
const { db } = require("../config/db");

const reportsCollection = db.collection("reports");
const createReport = async (data) => {
  const result = await reportsCollection.insertOne(data);
  return result;
};

const getAllReports = async (page, limit) => {
  const skip = (page - 1) * limit;
  const reports = await reportsCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();
  const totalDocuments = await reportsCollection.countDocuments();
  return { reports, totalDocuments };
};

const getReportById = async (id) => {
  return await reportsCollection.findOne({ _id: new ObjectId(String(id)) });
};

const updateReportById = async (id, updatedData) => {
  delete updatedData._id;
  await reportsCollection.updateOne(
    { _id: new ObjectId(String(id)) },
    { $set: updatedData }
  );
  return;
};

const updateReportStatusById = async (id, status) => {
  await reportsCollection.updateOne(
    { _id: new ObjectId(String(id)) },
    { $set: { status }, $currentDate: { updatedAt: true } }
  );
};

const verifyReportById = async (id) => {
  await updateReportStatusById(id, "verified");
};

const rejectReportById = async (id) => {
  await updateReportStatusById(id, "rejected");
};

const deleteReportById = async (id) => {
  await reportsCollection.deleteOne({ _id: new ObjectId(String(id)) });
  return;
};

const getReportsForStats = async () => {
  return await reportsCollection
    .find({ status: "verified" })
    .toArray();
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  verifyReportById,
  rejectReportById,
  deleteReportById,
  getReportsForStats,
};
