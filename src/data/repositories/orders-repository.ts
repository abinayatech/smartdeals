import * as ordersService from "@/lib/orders-service";

export const ordersRepository = {
  getAll: (userId?: string) => ordersService.getOrders(userId),
  getById: (id: string) => ordersService.getOrderById(id),
  save: ordersService.saveOrder,
  createId: ordersService.createOrderId,
};
