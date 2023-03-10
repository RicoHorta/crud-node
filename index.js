const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser'); //POST METHOD
const session = require('express-session');
const PORT = process.env.PORT || 3000; // SERVER PORT

//handlebars config
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
})); app.set('view engine', 'hbs');

// Sessions Config

app.use(session({
    secret: 'ChaveAleatoria',
    resave: false,
    saveUninitialized: true
}));

//app.use(express.static('public')); MIDDLEWARE QUE DETERMINA QUAL A PASTA QUE CONTÉM OS NARQUIVOS ESTÁTICOS EX: CSS

app.use(bodyParser.urlencoded({ extended: false })); //MIDDLEWARE HANDLE BODY-PARSER (POST) 

//ROUTS
app.get('/', (req, res) => {
    if (req.session.errors) {
        var arrayErros = req.session.errors; // Cria arrey de erros e popula com os erros da seção
        req.session.errors = "";    // Zera a Sessão de erros mas não a matriz
        return res.render('index', { NavActiveCad: true, error: arrayErros });
    }
    if (req.session.success) {
        req.session.success = false;
        return res.render('index', { NavActiveCad: true, MsgSuccess: true });
    }
    res.render('index', { NavActiveCad: true });
})

app.get('/users', (req, res) => {
    res.render('users', { NavActiveUsers: true });
})

app.get('/editar', (req, res) => {
    res.render('editar');
})

//rota criada para receber dados do cadastro
app.post('/cad', (req, res) => {
    // Recebe valores vindos do formulario Cadastro
    var nome = req.body.nome;
    var email = req.body.email;
    // Array para receber os ERROS
    const erros = [];
    // remover espaços em branco antes e depois
    // nome = nome.trim();

    // limpar o nome de caracteres especiais (aceita apenas letras) Regex
    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');
    nome = nome.trim(); // remover espaços em branco antes e depois
    // Vericica se é vazio ou NULL
    if (nome == '' || typeof nome == 'undefined' || nome == null) {
        erros.push('Campo Nome não pode ser vazio');
    }
    // Verifica se é mesmo um nome
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(nome)) {
        erros.push({ mensagem: "Somente permitido letras e espaços em branco!" });
    }
    // Validação do email
    email = email.trim(); // remover espaços em branco antes e depois
    if (email == '' || typeof email == 'undefined' || email == null) {
        erros.push('Campo Email não pode ser vazio');
    }
    // Verificar se e-mail é válido com REGEX
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erros.push({ mensagem: "Campo email inválido!" });
    }
    if (erros.length > 0) {
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/');
    }
    //SUCESSO! (Nenhum erro)
    // Salva os dados no MySql
    console.log('Validação OK!');
    req.session.success = true;
    return res.redirect('/');
})

app.listen(PORT, () => {
    console.log('Express server listening http://10.0.0.187:' + PORT);
});