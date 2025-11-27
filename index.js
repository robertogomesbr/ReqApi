const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

http.createServer((req,res) => {
    
    const partes = url.parse(req.url, true);
    const cep = partes.query.cep;

    if (!cep) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>Informe um CEP na URL</h1>
            <p>Exemplo:</p>
            <p>http://localhost:3000/?cep=12345678</p>
        `);
        return;
    }
    
    const urlApi = `https://viacep.com.br/ws/${cep}/json/`;
    
    https.get(urlApi, (resp) => {
        
        let dados = '';

        resp.on('data', (chunk) => {
            dados += chunk;
        });

        resp.on('end', () => {

            try {
                const endereco = JSON.parse(dados);

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

                var imprimir = `
                    <h1>Resultado da busca pelo CEP</h1>
                    <p><strong>Rua:</strong> ${endereco.logradouro}</p>
                    <p><strong>Bairro:</strong> ${endereco.bairro}</p>
                    <p><strong>Cidade:</strong> ${endereco.localidade}</p>
                    <p><strong>Estado:</strong> ${endereco.uf}</p>
                    <p><strong>Região:</strong> ${endereco.regiao}</p>
                    <p><strong>DDD:</strong> ${endereco.ddd}</p>
                `;
                res.end(imprimir);

            } catch (erro) {
                res.end("<h1>Erro ao ler resposta da API!</h1>");
            };

        });

    }).on('error', (err) => {
        res.end(`Error: ${err.message}`);
    });

}).listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}!!`)
});