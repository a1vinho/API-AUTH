export default function (fastify) {
    return {
        preHandler(request,reply,done) {
            const auth = request.headers.authorization;
            const message = "Token invalído,tente se logar novamente";
            if (!auth) {
                return reply.code(401).send({
                    message
                });
            };
            const token = auth.split(' ')[1];
            if (!token) {
                return reply.code(401).send({
                    message
                });
            };
            fastify.jwt.verify(token,function(err,data) {
                if (err) {
                    return reply.code(401).send({message});
                };
                request.user = data;
                done();
            });
        }
    };
};