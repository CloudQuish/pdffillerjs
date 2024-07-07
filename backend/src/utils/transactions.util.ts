import { AppDataSource } from "../bootstrap/database";

const startNewTransaction = async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};

export default { startNewTransaction };