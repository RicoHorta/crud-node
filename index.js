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

app.use(express.static('public')); //MIDDLEWARE QUE DETERMINA QUAL A PASTA QUE CONTÉM OS NARQUIVOS ESTÁTICOS EX: CSS

app.use(bodyParser.urlencoded({ extended: false })); //MIDDLEWARE HANDLE BODY-PARSER (POST) 


//IMPORTAR MODEL USUARIO
const Usuario = require('./models/Usuario');

// Sessions Config

app.use(session({
    secret: 'ChaveAleatoria',
    resave: false,
    saveUninitialized: true
}));


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
//Na rota /users o Model Usuários invoca o método que faz tipo SELECT * e poe na variavel valores
app.get('/users', (req, res) => {
    Usuario.findAll().then((valores) => {
        if (valores.length > 0) {                                   //usuarios é enviado para users.hbs 
            return res.render('users', { NavActiveUsers: true, table: true, usuarios: valores.map(valores => valores.toJSON()) });
        } else {                     // NaActiveUsers->Cor do Botão,  tabela tem que aparecer, usuarios vai receber os valores do banco em JSon
            res.render('users', { NavActiveUsers: true, table: false });
        }
    }).catch((err) => {
        console.log(`Houve um erro: ${err}`);
    });

})

app.post('/editar', (req, res) => {
    var id = req.body.id;
    // metodo que consulta a tabela pela chave primaria findByPk
    Usuario.findByPk(id).then((dados) => {
        return res.render('editar', { error: false, id: dados.id, nome: dados.nome, email: dados.email });
    }).catch((err) => {
        return res.render('editar', { error: true, mensagem: 'Favor verificar os dados' });
    });

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
        erros.push({ mensagem: "Campo Nome não pode ser vazio" });
    }
    // Verifica se é mesmo um nome
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(nome)) {
        erros.push({ mensagem: "Somente permitido letras e espaços em branco!" });
    }
    // Validação do email
    email = email.toLowerCase(); //Passa para minúsculas
    email = email.trim(); // remover espaços em branco antes e depois
    if (email == '' || typeof email == 'undefined' || email == null) {
        erros.push({ mensagem: "Campo Email não pode ser vazio" });
    }
    // Verificar se e-mail é válido com REGEX
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erros.push({ mensagem: "Campo email inválido!" });
    }
    // if (erros.length > 0) {
    //     console.log(erros);
    //     req.session.errors = erros;
    //     req.session.success = false;
    //     return res.redirect('/');
    //}
    //SUCESSO! (Nenhum erro)
    // Salva os dados no MySql
    //Usa o método create da model Usuario passando nome da coluna: nome da variável
    Usuario.create({
        nome: nome,
        email: email,
    }).then((usuario) => {
        //console.log('success', usuario.toJSON());
        req.session.success = true;
        return res.redirect('/');
    }).catch((erro) => {
        //console.log(erro, email);
        erros.push({ mensagem: "Usuário já cadastrado!" });
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/');
    })
    if (erros.length > 0) {
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/');
    }
})

app.post('/update', (req, res) => {
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
        erros.push({ mensagem: "Campo Nome não pode ser vazio" });
    }
    // Verifica se é mesmo um nome
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/.test(nome)) {
        erros.push({ mensagem: "Somente permitido letras e espaços em branco!" });
    }
    // Validação do email
    email = email.toLowerCase(); //Passa para minúsculas
    email = email.trim(); // remover espaços em branco antes e depois
    if (email == '' || typeof email == 'undefined' || email == null) {
        erros.push({ mensagem: "Campo Email não pode ser vazio" });
    }
    // Verificar se e-mail é válido com REGEX
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erros.push({ mensagem: "Campo email inválido!" });
    }
    if (erros.length > 0) {
        console.log(erros);
        return res.status(400).send({ status: 400, erro: erros });
    }
    //SUCESSO! (Nenhum erro na limpeza edição)
    // Edita os dados no MySql
    //Usa o método create da model Usuario passando nome da coluna: nome da variável
    Usuario.update(
        {
            nome: nome,
            email: email
        },
        {
            where: {
                id: req.body.id
            }
        }).then(() => {
            return res.redirect('/users');
        }).catch((err) => {
            console.log(err);
            return res.status(400).send({ status: 400, erro: 'Email já cadastrado' });
        })

})

app.post('/del', (req, res) => {
    Usuario.destroy({
        where: {
            id: req.body.id
        }
    }).then((retorno) => {
        return res.redirect('/users');
    }).catch((err) => {
        console.log(err);
    })
})
app.listen(PORT, () => {
    console.log('Express server listening http://10.0.0.187:' + PORT);
});