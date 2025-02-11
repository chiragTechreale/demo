const Waiter = require("./waiter");
const Admin = require("./admin");
const Otp = require("./otp");
const Table = require("./hotelTable");
const SuperAdmin = require("./admin");
const MenuItem = require("./menuItem");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Invoice = require("./invoice");

Waiter.hasMany(Otp, {
  foreignKey: "email",
  sourceKey: "email",
  as: "otpRecords",
});
Otp.belongsTo(Admin, { foreignKey: "adminId", targetKey: "id" });
Otp.belongsTo(Waiter, { foreignKey: "waiterId", targetKey: "id" });

Admin.hasMany(Otp, {
  foreignKey: "email",
  sourceKey: "email",
  as: "otpRecords",
});

Table.belongsTo(SuperAdmin, {
  foreignKey: "superAdminId",
});

SuperAdmin.hasMany(Table, {
  foreignKey: "superAdminId",
});

Table.hasMany(Order, {
  foreignKey: "tableId",
});

Order.belongsTo(Table, {
  foreignKey: "tableId",
});

SuperAdmin.hasMany(MenuItem, {
  foreignKey: "superAdminId",
});

MenuItem.belongsTo(SuperAdmin, {
  foreignKey: "superAdminId",
});

SuperAdmin.hasMany(Waiter, {
  foreignKey: "superAdminId",
});

Waiter.belongsTo(SuperAdmin, {
  foreignKey: "superAdminId",
});

Waiter.hasMany(Order, {
  foreignKey: "waiterId",
});

Order.belongsTo(Waiter, {
  foreignKey: "waiterId",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(MenuItem, {
  foreignKey: "menu_id",
});

MenuItem.hasMany(OrderItem, {
  foreignKey: "menu_id",
});

Order.hasOne(Invoice, {
  foreignKey: "orderId",
});

Invoice.belongsTo(Order, {
  foreignKey: "orderId",
});
Order.hasMany(Invoice, { foreignKey: "orderId" });

module.exports = {
  Waiter,
  Admin,
  Otp,
  Table,
  SuperAdmin,
  MenuItem,
  Order,
  OrderItem,
  Invoice,
};
