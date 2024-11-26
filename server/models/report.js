const { ObjectId } = require("mongodb");
const { db } = require("../config/db");

const reportsCollection = db.collection("reports");
const createReport = async (data) => {
  const result = await reportsCollection.insertOne(data);
  return result;
};

const getAllReports = async () => {
  return await reportsCollection.find().toArray();
};

const getReportById = async (id) => {
  return await reportsCollection.findOne({ _id: new ObjectId(String(id)) });
};

const updateReportById = async (id, updatedData) => {
  await reportsCollection.updateOne(
    { _id: new ObjectId(String(id)) },
    { $set: updatedData }
  );
  return
};

const updateReportStatusById = async (id, status) => {
    await reportsCollection.updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: { status } }
    );
  };
  
  const verifyReportById = async (id) => {
    await updateReportStatusById(id, "approved");
  };
  
  const rejectReportById = async (id) => {
    await updateReportStatusById(id, "rejected");
  };

const deleteReportById = async (id) => {
  await reportsCollection.deleteOne({ _id: new ObjectId(String(id)) });
  return
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReportById,
  verifyReportById,
  rejectReportById,
  deleteReportById,
};
