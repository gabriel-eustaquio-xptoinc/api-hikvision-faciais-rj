import express from 'express';
import DigestFetch from 'digest-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MAX_TENTATIVAS = 3;

const PORTAS = {
    DIRETORIA: {
        usuario: process.env.RJ_DIRETORIA_USUARIO,
        senha: process.env.RJ_DIRETORIA_SENHA,
        ip: process.env.RJ_DIRETORIA_IP,
    },
    TECNOLOGIA_DA_INFORMACAO: {
        usuario: process.env.RJ_TECNOLOGIA_DA_INFORMACAO_USUARIO,
        senha: process.env.RJ_TECNOLOGIA_DA_INFORMACAO_SENHA,
        ip: process.env.RJ_TECNOLOGIA_DA_INFORMACAO_IP,
    },
    TIKVAH: {
        usuario: process.env.RJ_TIKVAH_USUARIO,
        senha: process.env.RJ_TIKVAH_SENHA,
        ip: process.env.RJ_TIKVAH_IP,
    },
    VERITAS: {
        usuario: process.env.RJ_VERITAS_USUARIO,
        senha: process.env.RJ_VERITAS_SENHA,
        ip: process.env.RJ_VERITAS_IP,
    },
};

async function abrirPorta(local) {
    const config = PORTAS[local];

    if (!config) {
        throw new Error(`Local ${local} não encontrado`);
    }

    const client = new DigestFetch(
        config.usuario,
        config.senha
    );

    return client.fetch(
        `http://${config.ip}/ISAPI/AccessControl/RemoteControl/door/1`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/xml",
            },
            body: `
                <RemoteControlDoor version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
                    <cmd>open</cmd>
                </RemoteControlDoor>
            `,
        }
    );
}

app.post("/api/desbloquear", async (req, res) => {
    try {
        const { local } = req.body;

        if (!local) {
            return res.status(400).json({
                erro: "Local não informado",
            });
        }

        let response;

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
            response = await abrirPorta(local);

            if (response.status !== 401) {
                break;
            }

            console.warn(
                `Tentativa ${tentativa} falhou com 401`
            );
        }

        const texto = await response.text();

        res.status(response.status).send(texto);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: error.message,
        });
    }
});

app.listen(3001, () => {
    console.log("Servidor iniciado na porta 3001");
});