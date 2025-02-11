const constants = {
  ADMIN: {
    CREATE_SUCCESS: "Admin account created successfully.",
    CREATE_ERROR: "Failed to create admin account.",
    UPDATE_SUCCESS: "Admin account updated successfully.",
    UPDATE_ERROR: "Failed to update admin account.",
    DELETE_SUCCESS: "Admin account deleted successfully.",
    DELETE_ERROR: "Failed to delete admin account.",
    FETCH_SUCCESS: "Admin account fetched successfully.",
    FETCH_ERROR: "Failed to fetch admin account.",
  },

  WAITER: {
    CREATE_SUCCESS: "Waiter added successfully.",
    CREATE_ERROR: "Failed to add waiter.",
    UPDATE_SUCCESS: "Waiter details updated successfully.",
    UPDATE_ERROR: "Failed to update waiter details.",
    DELETE_SUCCESS: "Waiter deleted successfully.",
    DELETE_ERROR: "Failed to delete waiter.",
    FETCH_SUCCESS: "Waiter details fetched successfully.",
    FETCH_ERROR: "Failed to fetch waiter details.",
  },

  HOTETABLES: {
    CREATE_SUCCESS: "Hotel table created successfully.",
    CREATE_ERROR: "Failed to create hotel table.",
    UPDATE_SUCCESS: "Hotel table updated successfully.",
    UPDATE_ERROR: "Failed to update hotel table.",
    DELETE_SUCCESS: "Hotel table deleted successfully.",
    DELETE_ERROR: "Failed to delete hotel table.",
    FETCH_SUCCESS: "Hotel table details fetched successfully.",
    FETCH_ERROR: "Failed to fetch hotel table details.",
  },

  MENU: {
    CREATE_SUCCESS: "Menu item added successfully.",
    CREATE_ERROR: "Failed to add menu item.",
    UPDATE_SUCCESS: "Menu item updated successfully.",
    UPDATE_ERROR: "Failed to update menu item.",
    DELETE_SUCCESS: "Menu item deleted successfully.",
    DELETE_ERROR: "Failed to delete menu item.",
    FETCH_SUCCESS: "Menu items fetched successfully.",
    FETCH_ERROR: "Failed to fetch menu items.",
  },

  ORDER: {
    CREATE_SUCCESS: "Order placed successfully.",
    CREATE_ERROR: "Failed to place order.",
    UPDATE_SUCCESS: "Order updated successfully.",
    UPDATE_ERROR: "Failed to update order.",
    DELETE_SUCCESS: "Order canceled successfully.",
    DELETE_ERROR: "Failed to cancel order.",
    FETCH_SUCCESS: "Order details fetched successfully.",
    FETCH_ERROR: "Failed to fetch order details.",
  },

  ORDERITEMS: {
    CREATE_SUCCESS: "Order items added successfully.",
    CREATE_ERROR: "Failed to add order items.",
    UPDATE_SUCCESS: "Order item updated successfully.",
    UPDATE_ERROR: "Failed to update order item.",
    DELETE_SUCCESS: "Order item removed successfully.",
    DELETE_ERROR: "Failed to remove order item.",
    FETCH_SUCCESS: "Order items fetched successfully.",
    FETCH_ERROR: "Failed to fetch order items.",
  },

  INVOICES: {
    CREATE_SUCCESS: "Invoice generated successfully.",
    CREATE_ERROR: "Failed to generate invoice.",
    UPDATE_SUCCESS: "Invoice updated successfully.",
    UPDATE_ERROR: "Failed to update invoice.",
    DELETE_SUCCESS: "Invoice deleted successfully.",
    DELETE_ERROR: "Failed to delete invoice.",
    FETCH_SUCCESS: "Invoice details fetched successfully.",
    FETCH_ERROR: "Failed to fetch invoice details.",
  },

  GENERAL: {
    SUCCESS: "Operation completed successfully.",
    ERROR: "An unexpected error occurred. Please try again.",
    VALIDATION_ERROR: "Validation failed. Please check the input data.",
    NOT_FOUND: "Resource not found.",
    UNAUTHORIZED: "Unauthorized access.",
    FORBIDDEN: "Forbidden access.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
  },
};

module.exports = constants;
