const logger = require("../../libs/logger");
const constants = require("../../libs/constant");
const {
  sendErrorResponse,
  sendSuccessResponse,
  statusCode,
} = require("../../libs/utils");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Order, OrderItem, Table, MenuItem } = require("../../models");
const Invoice = require("../../models/invoice");

/**
 * Generates the invoice PDF and returns it as a download.
 */
const generateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findOne({
      where: { id: invoiceId },
      include: [
        {
          model: Order,
          include: [
            { model: OrderItem, include: [{ model: MenuItem }] },
            { model: Table },
          ],
        },
      ],
    });

    if (!invoice) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(sendErrorResponse({ message: "Invoice not found" }));
    }

    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

    const doc = new PDFDocument();
    const filePath = path.join(invoicesDir, `invoice-${invoice.id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Invoice", { align: "center" });
    doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
    doc.text(`Order ID: ${invoice.orderId}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Customer Information:");
    doc.font("Helvetica").text(`Name: ${invoice.Order.customer_name}`);
    doc.text(`Phone: ${invoice.Order.customer_mobile}`);
    doc.text(
      `Table: ${
        invoice.Order.Table ? invoice.Order.Table.tableNumber : "Not Available"
      }`
    );
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Order Items:");
    doc.font("Helvetica");
    let totalAmount = 0;
    invoice.Order.OrderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.Menu.name} - Qty: ${item.quantity} - Price: $${
          item.Menu.price
        }`
      );
      totalAmount += item.quantity * item.Menu.price;
    });
    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .text(`Total Amount: $${totalAmount.toFixed(2)}`, { align: "right" });
    doc.moveDown();
    doc.font("Helvetica").text(`Payment Status: ${invoice.paymentStatus}`);
    if (invoice.paymentMethod)
      doc.text(`Payment Method: ${invoice.paymentMethod}`);
    doc.end();

    stream.on("finish", () => {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${invoice.id}.pdf`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.download(filePath);
    });
  } catch (error) {
    logger.error("Error generating invoice:", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: "Failed to generate invoice" }));
  }
};

/**
 * Fetches a single invoice by ID.
 */
const getInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findOne({
      where: { id: invoiceId },
      include: [
        {
          model: Order,
          include: [
            { model: OrderItem, include: [{ model: MenuItem }] },
            { model: Table },
          ],
        },
      ],
    });

    if (!invoice) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(sendErrorResponse({ message: "Invoice not found" }));
    }

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: invoice,
        message: constants.INVOICES.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    logger.error("Error fetching invoice:", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: "Failed to fetch invoice" }));
  }
};

/**
 * Updates the status of an invoice.
 */
const updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findOne({ where: { id: invoiceId } });

    if (!invoice) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(sendErrorResponse({ message: "Invoice not found" }));
    }

    if (!["Paid", "Pending", "Failed", "Cancelled"].includes(status)) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(sendErrorResponse({ message: "Invalid payment status" }));
    }

    invoice.paymentStatus = status;
    await invoice.save();

    if (status === "Paid" || status === "Cancelled") {
      const order = await Order.findOne({ where: { id: invoice.orderId } });

      if (order) {
        const table = await Table.findByPk(order.tableId);
        if (table) {
          await table.update({
            is_occupied: false,
            reservationStatus: "available",
          });
        }
      }
    }

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: invoice,
        message: "Invoice status updated successfully",
      })
    );
  } catch (error) {
    logger.error("Error updating invoice status:", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: "Failed to update invoice status" }));
  }
};

/**
 * Fetches all invoices with filters.
 */
const getAllInvoices = async (req, res) => {
  try {
    const { status, customerName, dateRange } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (customerName) {
      where["$Order.customer_name$"] = { [Op.like]: `%${customerName}%` };
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const invoices = await Invoice.findAll({
      where,
      include: [
        {
          model: Order,
          include: [
            { model: OrderItem, include: [{ model: MenuItem }] },
            { model: Table },
          ],
        },
      ],
    });

    if (invoices.length === 0) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(sendErrorResponse({ message: "No invoices found" }));
    }

    return res.status(statusCode.OK).json(
      sendSuccessResponse({
        data: invoices,
        message: constants.INVOICES.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    logger.error("Error fetching invoices:", error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(sendErrorResponse({ message: "Failed to fetch invoices" }));
  }
};

module.exports = {
  generateInvoice,
  getInvoice,
  updateInvoiceStatus,
  getAllInvoices,
};
