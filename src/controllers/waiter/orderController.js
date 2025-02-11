const Order = require("../../models/order");
const OrderItem = require("../../models/orderItem");
const Table = require("../../models/hotelTable");
const Menu = require("../../models/menuItem");
const Waiter = require("../../models/waiter");
const Invoice = require("../../models/invoice");
const {
  sendErrorResponse,
  sendSuccessResponse,
  getErrorMsg,
} = require("../../libs/utils");
const constants = require("../../libs/constant");

const placeOrder = async (req, res) => {
  try {
    const { tableId, customer_name, customer_mobile, items } = req.body;

    const table = await Table.findByPk(tableId);
    if (!table || table.reservationStatus !== "available") {
      return res
        .status(400)
        .json(sendErrorResponse({ message: constants.GENERAL.NOT_FOUND }));
    }

    const waiter = await Waiter.findByPk(req.userId);
    if (!waiter) {
      return res
        .status(400)
        .json(sendErrorResponse({ message: constants.WAITER.FETCH_ERROR }));
    }

    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await Menu.findByPk(item.menu_id);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json(
          sendErrorResponse({
            message: `Menu item with ID ${item.menu_id} is not available.`,
          })
        );
      }
      totalAmount += menuItem.price * item.quantity;
    }

    const date = new Date();
    const order_id = `O${customer_mobile.slice(-4)}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getFullYear()}`;

    const order = await Order.create({
      id: order_id,
      tableId,
      waiterId: req.userId,
      customer_name,
      customer_mobile,
      status: "Pending",
    });

    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
      });
    }

    await table.update({ is_occupied: true, reservationStatus: "reserved" });

    await Invoice.create({
      orderId: order.id,
      amount: totalAmount,
      paymentStatus: "Pending",
    });

    return res.status(201).json(
      sendSuccessResponse({
        data: order,
        message: constants.ORDER.CREATE_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    return res.status(200).json(
      sendSuccessResponse({
        data: orders,
        message: constants.ORDER.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
        },
        {
          model: Table,
        },
        {
          model: Waiter,
          attributes: [], // This excludes the fields of the Waiter model
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json(sendErrorResponse({ message: constants.ORDER.FETCH_ERROR }));
    }

    return res.status(200).json(
      sendSuccessResponse({
        data: order,
        message: constants.ORDER.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, items } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json(sendErrorResponse({ message: constants.ORDER.FETCH_ERROR }));
    }

    if (status) {
      if (!["Pending", "Delivered"].includes(status)) {
        return res
          .status(400)
          .json(
            sendErrorResponse({ message: constants.GENERAL.VALIDATION_ERROR })
          );
      }
      await order.update({ status });

      if (status === "Delivered") {
        const invoice = await Invoice.findOne({ where: { orderId: id } });
        if (!invoice) {
          return res
            .status(404)
            .json(
              sendErrorResponse({ message: constants.INVOICES.FETCH_ERROR })
            );
        }
        if (invoice.paymentStatus === "Paid") {
          const table = await Table.findByPk(order.tableId);
          if (table) {
            await table.update({
              is_occupied: false,
              reservationStatus: "available",
            });
          }
        }
      }
    }

    if (items && Array.isArray(items)) {
      await OrderItem.destroy({ where: { orderId: order.id } });

      for (const item of items) {
        const menuItem = await Menu.findByPk(item.menu_id);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json(
            sendErrorResponse({
              message: `Menu item with ID ${item.menu_id} is not available.`,
            })
          );
        }

        await OrderItem.create({
          orderId: order.id,
          menu_id: item.menu_id,
          quantity: item.quantity,
        });
      }

      let totalAmount = 0;
      for (const item of items) {
        const menuItem = await Menu.findByPk(item.menu_id);
        if (menuItem) {
          totalAmount += menuItem.price * item.quantity;
        }
      }

      const invoice = await Invoice.findOne({ where: { orderId: order.id } });
      if (invoice) {
        await invoice.update({ amount: totalAmount });
      }
    }

    return res.status(200).json(
      sendSuccessResponse({
        data: order,
        message: constants.ORDER.UPDATE_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json(sendErrorResponse({ message: constants.ORDER.FETCH_ERROR }));
    }

    await OrderItem.destroy({ where: { orderId: id } });
    await Invoice.destroy({ where: { orderId: id } });

    const table = await Table.findByPk(order.tableId);
    if (table) {
      await table.update({
        is_occupied: false,
        reservationStatus: "available",
      });
    }

    await order.destroy();

    return res
      .status(200)
      .json(sendSuccessResponse({ message: constants.ORDER.DELETE_SUCCESS }));
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const getOrdersByTableId = async (req, res) => {
  try {
    const { tableId } = req.params;
    const orders = await Order.findAll({
      where: { tableId },
      include: [OrderItem],
    });
    return res.status(200).json(
      sendSuccessResponse({
        data: orders,
        message: constants.ORDER.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const getOrdersByWaiterId = async (req, res) => {
  try {
    const { waiterId } = req.params;
    const orders = await Order.findAll({
      where: { waiterId },
      include: [OrderItem],
    });
    return res.status(200).json(
      sendSuccessResponse({
        data: orders,
        message: constants.ORDER.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.findAll({
      where: { status },
      include: [OrderItem],
    });
    return res.status(200).json(
      sendSuccessResponse({
        data: orders,
        message: constants.ORDER.FETCH_SUCCESS,
      })
    );
  } catch (error) {
    return res.status(500).json(sendErrorResponse(getErrorMsg(error)));
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByTableId,
  getOrdersByWaiterId,
  getOrdersByStatus,
};
