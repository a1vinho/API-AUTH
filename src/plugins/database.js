import mysql from "mysql2/promise";
import fastifyPlugin from "fastify-plugin";

function CreateConnection(fastify,options) {
    const connect = mysql.createPool(options);

    fastify.decorate('mysql',connect);
}

export default fastifyPlugin(CreateConnection,{
    name: "database"
})