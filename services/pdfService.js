const { PDFDocument, rgb, PageSizes } = require("pdf-lib");
const { format } = require("date-fns");

exports.generatePDF = async (expenses, userName, totalExpense) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A4); // Custom page size
  const { width, height } = page.getSize();

  // Add a title
  page.drawText("Expense Report", {
    x: 50,
    y: height - 50,
    size: 24,
    color: rgb(0, 0.53, 0.71),
  });

  // Add user details
  const reportDate = format(new Date(), "yyyy-MM-dd HH:mm:ss"); // Current date and time
  page.drawText(`Generated for: ${userName}`, {
    x: 50,
    y: height - 90,
    size: 16,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Report Date: ${reportDate}`, {
    x: 50,
    y: height - 110,
    size: 14,
    color: rgb(0, 0, 0),
  });

  // Add expense details dynamically
  let yOffset = height - 150;
  expenses.forEach((expense, index) => {
    page.drawText(
      `${index + 1}. ${format(new Date(expense.createdAt), "yyyy-MM-dd")}: ${
        expense.amount
      } (${expense.category})`,
      {
        x: 50,
        y: yOffset,
        size: 12,
        color: rgb(0, 0, 0),
      }
    );
    yOffset -= 20; // Adjust line spacing
  });

  // Add total expense
  page.drawText(`Total Expense: ${totalExpense}`, {
    x: 50,
    y: yOffset - 20, // Add some spacing below the last expense
    size: 14,
    color: rgb(0, 0.4, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
