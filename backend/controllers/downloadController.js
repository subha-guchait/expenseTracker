const Expense = require("../models/Expense");
const DownloadFile = require("../models/DownloadFile");
const { uploadFileToS3 } = require("../services/awsService");
const { generatePDF } = require("../services/pdfService");

exports.downloadAllExpenses = async (req, res, next) => {
  try {
    if (!req.user.ispremiumuser) {
      return res.status(403).json({
        success: false,
        message: "You need to be a premium user to download expenses",
      });
    }
    const expenses = await req.user.getExpenses();
    // const stringifiedExpenses = JSON.stringify(expenses);
    const expensePDF = await generatePDF(
      expenses,
      req.user.name,
      req.user.totalexpense
    );
    const fileName = `${req.user.id}/expenses-${Date.now()}.pdf`;
    const fileUrl = await uploadFileToS3(expensePDF, fileName);

    console.log("id of the user:", req.user.id);

    // await DownloadFile.create({
    //   url: fileUrl,
    //   userId: req.user.id,
    // });

    await req.user.createDownloadFile({
      url: fileUrl,
    });

    return res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ sucess: false });
  }
};
