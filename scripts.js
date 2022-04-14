let usuario
let requisicaoEntrar;
let ficarOnline;
let promise;
let mensagem = document.querySelector(".container");
let input = document.querySelector("input");
let texto;
let mensagemEnviar = {}
let requisicaoEnviar;
let mensagens = [];

function conectar() {
    usuario = prompt("Qual o seu nome?");
    usuarioAtivo = {
        name: usuario
    }
    requisicaoEntrar = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuarioAtivo)
    requisicaoEntrar.then(ficarNaSala);
    requisicaoEntrar.catch(errorEntrarSala);
}


function ficarNaSala(response) {
    setInterval(ManterConexao, 5000);
    // AQUI VAI GERAR AS MENSAGENS E OS ENVIOS
    setInterval(recebendoMensagens, 3000);
    recebendoMensagens();
}

function recebendoMensagens() {
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(receberMensagens);
}

function errorEntrarSala(erro) {
    console.log("Deu error");
    alert("Usuario ja conectado, utilize outro nome")
    conectar();
}

function ManterConexao() {
    ficarOnline = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuarioAtivo)
    ficarOnline.then(toOnline)
}

function toOnline(response) {
    
}


function receberMensagens(resposta) {
    mensagem.innerHTML = "";
    mensagens = resposta.data;
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {
            mensagem.innerHTML += `<div class="mensagem mensagemStatus"><p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> ${mensagens[i].text}</p></div>`
        }
        if (mensagens[i].type === "message") {
            mensagem.innerHTML += `<div class="mensagem mensagemNormal"><p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p></div>`
        }
        if (mensagens[i].type === "private_message" && (mensagens[i].to === usuario || mensagens[i].from === usuario)) {
            mensagem.innerHTML += `<div class="mensagem mensagemReservadas"><p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p></div>`
        }
    }
    mensagem.lastChild.scrollIntoView();
}


function enviarMensagem() {
    texto = input.value;
    mensagemEnviar = {
        from: usuario,
        to: "Todos",
        text: texto,
        type: "message" // ou "private_message" para o bônus
    }
    requisicaoEnviar = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnviar);
    requisicaoEnviar.then(processarMensagem);
    requisicaoEnviar.catch(erroEnvio);

}

function processarMensagem(resposta){
    recebendoMensagens();
}

function erroEnvio (error) {
    // usuario não está mais na sala
    window.location.reload();
}

conectar();


