// guardar e pegar coisas no navegador
function pegar(chave, padrao) {
    return JSON.parse(localStorage.getItem(chave)) || padrao;
}

function guardar(chave, coisa) {
    localStorage.setItem(chave, JSON.stringify(coisa));
}

function valor(id) {
    return document.getElementById(id).value;
}

// classes
class Usuario {
    constructor(email, senha, tipo) {
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }
}

class Cliente extends Usuario {
    constructor(nome, cpf, telefone, email, senha) {
        super(email, senha, "Cliente");
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
    }
}

class Produto {
    constructor(nome, ano, preco, imagem) {
        this.nome = nome;
        this.ano = ano;
        this.preco = preco;
        this.imagem = imagem;
    }
}

class Carrinho {
    constructor() {
        this.itens = pegar("carrinho", []);
    }
    adicionar(produto) {
        this.itens.push(produto);
        guardar("carrinho", this.itens);
    }
    remover(i) {
        this.itens.splice(i, 1);
        guardar("carrinho", this.itens);
    }
    total() {
        var soma = 0;
        for (var i = 0; i < this.itens.length; i++) {
            soma = soma + this.itens[i].preco;
        }
        return soma;
    }
}

var carrinho = new Carrinho();

var carrosIniciais = [
    new Produto("Toyota Corolla 2.0", 2022, 130000, "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400"),
    new Produto("Honda Civic 1.5", 2021, 125000, "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400"),
    new Produto("Volkswagen Jetta", 2022, 118000, "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400"),
    new Produto("Volkswagen Polo 1.0", 2023, 95000, "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400")
];

// login
function entrar() {
    var u = new Usuario(valor("email"), valor("senha"), valor("tipo"));
    var clientes = pegar("clientes", []);
    var ok = false;
    if (u.tipo == "Administrador" && u.email == "admin@garagem.com" && u.senha == "1234") {
        ok = true;
    }
    for (var i = 0; i < clientes.length; i++) {
        if (u.tipo == "Cliente" && clientes[i].email == u.email && clientes[i].senha == u.senha) {
            ok = true;
        }
    }
    if (ok) {
        guardar("sessao", u.tipo);
        window.location.href = "index.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

function sair() {
    localStorage.removeItem("sessao");
    window.location.href = "index.html";
}

// home
function mostrarCarros() {
    var lista = pegar("produtos", carrosIniciais);
    var busca = valor("busca").toLowerCase();
    var html = "";
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].nome.toLowerCase().indexOf(busca) != -1) {
            html += '<div class="card"><img src="' + lista[i].imagem + '" width="200">';
            html += '<h3>' + lista[i].nome + '</h3><p>Ano: ' + lista[i].ano + '</p>';
            html += '<p>R$ ' + lista[i].preco + '</p>';
            html += '<button onclick="comprar(' + i + ')">Comprar</button></div>';
        }
    }
    document.getElementById("lista").innerHTML = html;
}

function comprar(i) {
    carrinho.adicionar(pegar("produtos", carrosIniciais)[i]);
    alert("Carro adicionado ao carrinho!");
}

// carrinho
function mostrarCarrinho() {
    var html = "";
    for (var i = 0; i < carrinho.itens.length; i++) {
        html += '<p>' + carrinho.itens[i].nome + ' - R$ ' + carrinho.itens[i].preco;
        html += ' <button onclick="tirar(' + i + ')">Excluir</button></p>';
    }
    document.getElementById("itens").innerHTML = html;
    document.getElementById("total").innerHTML = "Total: R$ " + carrinho.total();
}

function tirar(i) {
    carrinho.remover(i);
    mostrarCarrinho();
}

function finalizar() {
    if (carrinho.itens.length == 0) {
        alert("Carrinho vazio!");
    } else if (pegar("sessao", "") != "Cliente") {
        alert("Entre como cliente para finalizar!");
        window.location.href = "login.html";
    } else {
        alert("Compra finalizada! Total: R$ " + carrinho.total());
        carrinho.itens = [];
        guardar("carrinho", []);
        mostrarCarrinho();
    }
}

// admin (carros)
function mostrarAdmin() {
    if (pegar("sessao", "") != "Administrador") {
        alert("Só o administrador pode entrar aqui!");
        window.location.href = "login.html";
        return;
    }
    var lista = pegar("produtos", carrosIniciais);
    var html = "";
    for (var i = 0; i < lista.length; i++) {
        html += '<p>' + lista[i].nome + ' - R$ ' + lista[i].preco;
        html += ' <button onclick="alterarCarro(' + i + ')">Alterar</button>';
        html += ' <button onclick="excluirCarro(' + i + ')">Excluir</button></p>';
    }
    document.getElementById("lista").innerHTML = html;
}

function salvarCarro() {
    if (valor("nome") == "" || valor("preco") == "") {
        alert("Preencha o nome e o preço!");
        return;
    }
    var lista = pegar("produtos", carrosIniciais);
    lista.push(new Produto(valor("nome"), valor("ano"), Number(valor("preco")), valor("imagem")));
    guardar("produtos", lista);
    document.getElementById("f").reset();
    mostrarAdmin();
}

function alterarCarro(i) {
    var lista = pegar("produtos", carrosIniciais);
    var nome = prompt("Novo nome:", lista[i].nome);
    var preco = prompt("Novo preço:", lista[i].preco);
    if (nome && preco) {
        lista[i].nome = nome;
        lista[i].preco = Number(preco);
        guardar("produtos", lista);
        mostrarAdmin();
    }
}

function excluirCarro(i) {
    var lista = pegar("produtos", carrosIniciais);
    lista.splice(i, 1);
    guardar("produtos", lista);
    mostrarAdmin();
}

// clientes
function mostrarClientes() {
    var lista = pegar("clientes", []);
    var html = "";
    for (var i = 0; i < lista.length; i++) {
        html += '<p>' + lista[i].nome + ' - ' + lista[i].email;
        html += ' <button onclick="alterarCliente(' + i + ')">Alterar</button>';
        html += ' <button onclick="excluirCliente(' + i + ')">Excluir</button></p>';
    }
    document.getElementById("lista").innerHTML = html;
}

function salvarCliente() {
    if (valor("nome") == "" || valor("email") == "" || valor("senha") == "") {
        alert("Preencha nome, e-mail e senha!");
        return;
    }
    var lista = pegar("clientes", []);
    lista.push(new Cliente(valor("nome"), valor("cpf"), valor("telefone"), valor("email"), valor("senha")));
    guardar("clientes", lista);
    document.getElementById("f").reset();
    mostrarClientes();
}

function alterarCliente(i) {
    var lista = pegar("clientes", []);
    var nome = prompt("Novo nome:", lista[i].nome);
    var telefone = prompt("Novo telefone:", lista[i].telefone);
    if (nome && telefone) {
        lista[i].nome = nome;
        lista[i].telefone = telefone;
        guardar("clientes", lista);
        mostrarClientes();
    }
}

function excluirCliente(i) {
    var lista = pegar("clientes", []);
    lista.splice(i, 1);
    guardar("clientes", lista);
    mostrarClientes();
}