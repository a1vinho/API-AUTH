import Handlers from "../handlers/index.js";
import { SchemaRegister,SchemaLogin,SchemaProfile } from "../schemas/index.js";
import Hooks from "../hooks/index.js";


export default function (fastify, options) {
    const handlers = Handlers(fastify);
    const hooks = Hooks(fastify);
    fastify.route({
        method: "POST",
        url: "/register",
        schema: SchemaRegister,
        handler: handlers.Register
    });
    fastify.route({
        method: "POST",
        url: "/login",
        schema: SchemaLogin,
        handler: handlers.Login
    });
    fastify.route({
        method: "GET",
        url: '/profile',
        schema:SchemaProfile,
        preHandler:hooks.preHandler,
        handler: async function (request, reply) {
            const [user] = await fastify.mysql.query(`SELECT * FROM users WHERE id = ?`,request.user.id).then(data => data.find(d => d));

            return reply.code(200).send(user);
        }
    });
};