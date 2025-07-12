// handlers functions 

export default function (fastify) {
    return {
        async Register(request, reply) {
            try {
                const [user] = await fastify.mysql.query(`SELECT * FROM users WHERE email = ? OR username = ?`, [request.body.email, request.body.username]).then(data => data.find(d => d));
                if (user) {
                    return reply.code(401).send({
                        message: "Esse usuário já está registrado."
                    });
                };
                const id = fastify.uuid();
                await fastify.mysql.query(`INSERT INTO users (id,email,password,username) VALUES (?,?,?,?)`, [
                    id,
                    request.body.email,
                    await fastify.bcrypt.Hash(request.body.password, 12),
                    request.body.username
                ]);
                const token = fastify.jwt.sign({
                    id,
                    username: request.body.username
                }, '1d');
                return reply.code(201).send({
                    message: "Usuário criado com sucesso.",
                    token
                });
            }
            catch (e) {
                fastify.log.error(`Erro no servidor: ${e}`);
                return reply.code(500).send({
                    message: "Erro no servidor,tente novamente mais tarde."
                });
            };
        },
        async Login(request, reply) {
            try {
                const [user] = await fastify.mysql.query(`SELECT * FROM users WHERE username = ?`, [
                    request.body.username
                ]).then(data => data.find(d => d));
                if (!user) {
                    return reply.code(404).send({
                        message: "Usuário não encontrado."
                    });
                };
                if (user.username === request.body.username && await fastify.bcrypt.Compare(request.body.password, user.password)) {
                    const token = fastify.jwt.sign({
                        id: user.id,
                        username: user.username
                    }, '1d');
                    return reply.code(200).send({
                        message: "Usuário logado com sucesso.",
                        token
                    });
                };
                console.log(user);
                return reply.code(401).send({ message: "Senha incorreta." });
            }
            catch (e) {
                fastify.log.error(`Erro no servidor: ${e}`);
                return reply.code(500).send({
                    message: "Erro no servidor,tente novamente mais tarde."
                });
            };
        }
    };
};