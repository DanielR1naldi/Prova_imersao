import express, {Request, Response} from "express";
import mysql from "mysql2/promise";

const app = express();

// Configura EJS como a engine de renderização de templates
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

// Middleware para permitir dados no formato JSON
app.use(express.json());
// Middleware para permitir dados no formato URLENCODED
app.use(express.urlencoded({ extended: true }));

app.get('/categories', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM categories");
    return res.render('categories/index', {
        categories: rows
    });
});

app.get("/categories/form", async function (req: Request, res: Response) {
    return res.render("categories/form");
});

app.post("/categories/save", async function(req: Request, res: Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO categories (name) VALUES (?)";
    await connection.query(insertQuery, [body.name]);

    res.redirect("/categories");
});

app.post("/categories/delete/:id", async function (req: Request, res: Response) {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM categories WHERE id = ?";
    await connection.query(sqlDelete, [id]);

    res.redirect("/categories");
});

//USUARIOS 

app.get('/users', async (req: Request, res: Response) => {
    const [rows] = await connection.query("SELECT * FROM users");
    return res.render('users/index', { users: rows });
});

app.get('/users/add', (req: Request, res: Response) => {
    return res.render('users/form');
});

app.post('/users/save', async (req: Request, res: Response) => {
    const body = req.body;
    const insertQuery = "INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, ?)";
    await connection.query(insertQuery, [body.name, body.email, body.password, body.role, body.active]);
    res.redirect("/users");
});

app.post("/users/delete/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM users WHERE id = ?";
    await connection.query(sqlDelete, [id]);
    res.redirect("/users");
});

//LOGIN

// Rota para exibir a página de login
app.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

// Rota para tratar o envio do formulário de login
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Verifica se o usuário existe no banco de dados
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);

    if (rows.length > 0) {
        // Credenciais válidas, redireciona para a lista de usuários
        return res.redirect('C');
    } else {
        // Credenciais inválidas, redireciona de volta para o login
        return res.redirect('categories/login');
    }
});

//Página inicial 

app.get('/', function (req: Request, res: Response){
    return res.render('initial/index')
});


app.listen('3000', () => console.log("Server is listening on port 3000"));