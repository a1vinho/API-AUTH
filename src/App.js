import Fastify from "fastify";
import jwt from "jsonwebtoken";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import database from "./plugins/database.js";
import routers from "./routers/index.js";
import "dotenv/config";

const app = Fastify({
    logger:true
});

app.decorate('uuid',randomUUID);
app.decorate('bcrypt',{
    async Hash(value,salt) {
        return await bcrypt.hash(value,salt);
    },
    async Compare(string,encrypted) {
        return await bcrypt.compare(string,encrypted);
    }
});
app.decorate('jwt',{
    sign (data,expires) {
        return jwt.sign(data,process.env.SECRET,{expiresIn:expires});
    },
    verify(token,cb) {

       return jwt.verify(token,process.env.SECRET,cb);
    }
});

// register plugins
app.register(database,{
   database: process.env.DATABASE,
   user: process.env.USERDB,
   password: process.env.PASSWORD,
   host: process.env.HOST 
});

app.register(fastifySwagger,{
    
    swagger: {
        info: {
            title: "Api de autenticação",
            version: '1.0.0'
        }
    }
});
app.register(fastifySwaggerUi,{
    routePrefix: "/docs",
    
    uiConfig: {
        docExpansion: 'full',
        deepLinking:false
    }
});
app.register(routers,{
    prefix: "/api"
});
app.addHook('onRequest',function(request,reply,done) {
    console.log(request.headers.authorization);
    done()
});

const PORT = process.env.PORT || 8081;

app.listen({
    port:PORT
},function(err,address) {
    if (err) {
        app.log.error(err);
        return process.exit();
    };

    app.log.info(`Servidor rodando em ${address}`);
});