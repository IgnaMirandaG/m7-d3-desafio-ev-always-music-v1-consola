import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'm7_d3_db_always_music',
    idleTimeoutMillis: 1000
});

//CONSULTAR TODOS LOS REGISTROS
const getStudents = async () => {
    //parametrizar consulta
    let consulta = {
        text: "SELECT nombre, rut, curso, nivel FROM estudiantes",
        values: []
    }
    try {
        let results = await pool.query(consulta);
        console.log("*************** CONSULTA DE ESTUDIANTES *******************");
        console.log("Cantidad de registros encontrados: " + results.rowCount);
        console.log("Tabla de registros:");
        console.table(results.rows);
        console.log("***********************************************************");
    } catch (error) {
        console.log(error);
    } finally {
        pool.end();
    }

};

//CONSULTAR REGISTRO POR RUT
const getStudentByRut = async (rut) => {
    let consulta = {
        text: "SELECT nombre, rut, curso, nivel FROM estudiantes WHERE rut = $1",
        values: [rut]
    }
    try {
        let results = await pool.query(consulta);
        console.log("*********** CONSULTA DE ESTUDIANTES POR RUT **************");
        console.table(results.rows[0] || "Sin estudiantes registrados con rut: " + rut);
        console.log("**********************************************************");
    } catch (error) {
        console.log(error);
    } finally {
        pool.end();
    }
};

//AGREGAR ESTUDIANTE
const addStudent = async (nombre, rut, curso, nivel) => {
    let comando = {
        text: "INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)",
        values: [nombre, rut, curso, nivel]
    }
    try {
        await pool.query(comando);
        console.log(`Estudiante ${nombre} agregado con éxito`);
    } catch (error) {
        console.log(error);
    } finally {
        pool.end();
    }
};

//ACTUALIZAR ESTUDIANTE
const updateStudent = async (nombre, rut, curso, nivel) => {
    let comando = {
        text: "UPDATE estudiantes SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2",
        values: [nombre, rut, curso, nivel]
    }
    try {
        let result = await pool.query(comando);
        if (result.rowCount > 0) {
            console.log(`Estudiante con rut ${rut} actualizado con éxito`);
        } else {
            console.log(`No se encontró estudiante con rut ${rut}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        pool.end();
    }
};

//ELIMINAR ESTUDIANTE
const deleteStudent = async (rut) => {
    let comando = {
        text: "DELETE FROM estudiantes WHERE rut = $1",
        values: [rut]
    }
    try {
        let result = await pool.query(comando);
        if (result.rowCount > 0) {
            console.log(`Estudiante con rut ${rut} eliminado con éxito`);
        } else {
            console.log(`No se encontró estudiante con rut ${rut}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        pool.end();
    }
};
//para definir forma de ingreso de info por consola
let comandoConsola = process.argv[2].toLowerCase();

//función para manejar comandos ingresados por consola
const operaciones = () => {
    switch (comandoConsola) {
        case "consulta":
            getStudents();
            break;
        case "rut":
            let rutConsola = process.argv[3]
            getStudentByRut(rutConsola);
            break;
        case "nuevo":
            let [nombre, rut, curso, nivel] = process.argv.slice(3);
            addStudent(nombre, rut, curso, nivel);
            break;
        case "editar":
            let [nombreAct, rutAct, cursoAct, nivelAct] = process.argv.slice(3);
            updateStudent(nombreAct, rutAct, cursoAct, nivelAct);
            break;
        case "eliminar":
            let rutEliminar = process.argv[3];
            deleteStudent(rutEliminar);
            break;
        default:
            console.log("comando no reconocido")
            break;
    }
};

operaciones(comandoConsola);