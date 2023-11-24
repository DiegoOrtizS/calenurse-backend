// data-source.ts
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";
// Importa otras entidades según sea necesario

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "tu_usuario",
    password: "tu_contraseña",
    database: "tu_base_de_datos",
    entities: [Usuario],
    synchronize: true,
    // Otras opciones según sea necesario
});
