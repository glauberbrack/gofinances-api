import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const currentBalance = transactionRepository.getBalance();

    if (type === 'outcome' && value > (await currentBalance).total) {
      throw new AppError(`You don't have founds to do this transaction`);
    }

    let existsCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!existsCategory) {
      existsCategory = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(existsCategory);
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id: existsCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
