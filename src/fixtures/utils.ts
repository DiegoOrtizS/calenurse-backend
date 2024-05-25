import { Repository, ObjectType } from "typeorm";
import { myDataSource } from "../app-data-source";

export async function insertIfRepositoryNoHasData<T>(entities: T[], repository: Repository<T>): Promise<void> {
  if (await repository.count() === 0) {
    await repository.save(entities);
  }
}