import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as FinanceModel from '../models/Finance';
import { successResponse, errorResponse } from '../utils/response';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await FinanceModel.getTransactionsByUserId(req.user!.userId);
    return successResponse(res, transactions);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch transactions', 500, error);
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transactionData = {
      ...req.body,
      user_id: req.user!.userId,
      recurring: req.body.recurring || false,
    };

    const transaction = await FinanceModel.createTransaction(transactionData);
    return successResponse(res, transaction, 'Transaction created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create transaction', 500, error);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await FinanceModel.updateTransaction(id, req.user!.userId, req.body);
    return successResponse(res, transaction, 'Transaction updated');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update transaction', 500, error);
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await FinanceModel.deleteTransaction(id, req.user!.userId);
    return successResponse(res, null, 'Transaction deleted');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete transaction', 500, error);
  }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await FinanceModel.getTransactionsByUserId(req.user!.userId);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any[], t) => {
        const existing = acc.find(item => item.category === t.category);
        if (existing) {
          existing.amount += t.amount;
        } else {
          acc.push({ category: t.category, amount: t.amount });
        }
        return acc;
      }, []);

    const summary = {
      totalIncome,
      totalExpenses,
      net: totalIncome - totalExpenses,
      categoryBreakdown,
    };

    return successResponse(res, summary);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch summary', 500, error);
  }
};

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await FinanceModel.getBudgetsByUserId(req.user!.userId);
    return successResponse(res, budgets);
  } catch (error: any) {
    return errorResponse(res, 'Failed to fetch budgets', 500, error);
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budgetData = {
      ...req.body,
      user_id: req.user!.userId,
    };

    const budget = await FinanceModel.createBudget(budgetData);
    return successResponse(res, budget, 'Budget created', 201);
  } catch (error: any) {
    return errorResponse(res, 'Failed to create budget', 500, error);
  }
};
