// Función para cargar valores por defecto solo si no existen
import { myDataSource } from "../app-data-source";
import { Area } from "../entity";
import { insertIfRepositoryNoHasData } from "./utils";

export async function areaFixture() {
    const repository = myDataSource.getRepository(Area);
    await insertIfRepositoryNoHasData<Area>([
        repository.create({
            name: "Cardiologia"
        }),
        repository.create({
            name: "Obstetricia"
        }),
        repository.create({
            name: "Ginecologia"
        }),
    ], repository)
}