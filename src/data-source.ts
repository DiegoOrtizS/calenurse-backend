// data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";
// Importa otras entidades según sea necesario

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "tu_usuario",
    password: "tu_contraseña",
    database: "tu_base_de_datos",
    entities: [User],
    synchronize: true,
    // Otras opciones según sea necesario
});
