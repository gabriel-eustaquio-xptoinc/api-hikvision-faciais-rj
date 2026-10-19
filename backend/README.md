# API Hikvision - Controle de Portas

API para abertura remota de portas Hikvision utilizando autenticação Digest.

## Instalação

Clone o projeto:

```bash
git clone <repositorio>
cd api-hikvision
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie o arquivo `.env`:

```env
RJ_DIRETORIA_USUARIO=teste
RJ_DIRETORIA_SENHA=password123
RJ_DIRETORIA_IP=192.168.140.30

RJ_TECNOLOGIA_DA_INFORMACAO_USUARIO=teste
RJ_TECNOLOGIA_DA_INFORMACAO_SENHA=password1234
RJ_TECNOLOGIA_DA_INFORMACAO_IP=192.168.170.30
```

## Executando

```bash
node server.js
```

Saída esperada:

```text
Servidor iniciado na porta 3001
```

---

# Endpoint

## Abrir Porta

### URL

```http
POST /api/desbloquear
```

### Headers

```http
Content-Type: application/json
```

### Body

```json
{
  "local": "DIRETORIA"
}
```

### Locais Disponíveis

| Local |
|---------|
| DIRETORIA |
| TECNOLOGIA_DA_INFORMACAO |
| TIKVAH |
| VERITAS |

### Exemplo CURL

```bash
curl -X POST http://localhost:3001/api/desbloquear \
-H "Content-Type: application/json" \
-d '{"local":"DIRETORIA"}'
```

### Exemplo de sucesso

```xml
<ResponseStatus version="2.0">
    <requestURL>/ISAPI/AccessControl/RemoteControl/door/1</requestURL>
    <statusCode>1</statusCode>
    <statusString>OK</statusString>
</ResponseStatus>
```

### Possíveis erros

#### Local não informado

```json
{
  "erro": "Local não informado"
}
```

#### Local inválido

```json
{
  "erro": "Local XYZ não encontrado"
}
```

#### Erro de comunicação

```json
{
  "erro": "connect ETIMEDOUT"
}
```