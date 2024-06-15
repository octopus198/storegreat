import { DASHBOARD_MESSAGE } from "../constants/message.js";
import dashboardService from "../services/dashboard.service.js";

export const getSalesController = async (req, res, next) => {
    try {
      const userID = req.user.id;
      const sales = await dashboardService.getSales(userID);
      return res.json({
        message: DASHBOARD_MESSAGE.GET_SALES_SUCCESS,
        sales: sales,
      });
    } catch (err) {
      console.log(err);
      console.log("getSalesController error");
      next(err);
    }
  };

  export const getCostController = async (req, res, next) => {
    try {
      const userID = req.user.id;
      const cost = await dashboardService.getCost(userID);
      return res.json({
        message: DASHBOARD_MESSAGE.GET_COST_SUCCESS,
        cost: cost,
      });
    } catch (err) {
      console.log(err);
      console.log("getCostController error");
      next(err);
    }
  };

  export const getProductsSoldController = async (req, res, next) => {
    try {
      const userID = req.user.id;
      const productsSold = await dashboardService.getProductSold(userID);
      return res.json({
        message: DASHBOARD_MESSAGE.GET_NUMBER_PRODUCTS_SUCCESS,
        productsSold: productsSold,
      });
    } catch (err) {
      console.log(err);
      console.log("getProductsSoldController error");
      next(err);
    }
  };

  export const getRevenueChartController = async (req, res, next) => {
    try {
      const userID = req.user.id;
      const revenueChartData = await dashboardService.getRevenueChartData(userID);
      return res.json({
        message: DASHBOARD_MESSAGE.GET_REVERNUE_CHART_SUCCESS,
        revenueChartData: revenueChartData,
      });
    } catch (err) {
      console.log(err);
      console.log("getRevenueChartController error");
      next(err);
    }
  };