const Roles = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3,
};

const OrderStatus = {
    PENDING: 'pending',
    ORDERED: 'ordered',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

module.exports = { Roles, OrderStatus };
