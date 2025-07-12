

export const SchemaRegister = {
    body: {
        type: "object",
        required: ["email","username",'password'],
        properties: {
            email: {type: "string",format: "email"},
            password: {type: "string"},
            username: {type:"string"}
        },
        additionalProperties: false
    },
    response: {
        201: {
            description: "Caso ocorra tudo certo",
            type: "object",
            required: ["token","message"],
            properties: {
                token: {type:"string"},
                message: {type:"string"}
            }
        },
        default: {
            type: "object",
            required: ['message'],
            properties: {
                message: {type: "string"}
            }
        }
    }
};

export const SchemaLogin = {
    body: {
        type: "object",
        required: ["username",'password'],
        properties: {
            username: {type:"string"},
            password: {type: "string"}
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: "object",
            description: "Rota para autenticação dos usuários",
            required: ["token","message"],
            properties: {
                token: {type:"string"},
                message: {type:"string"}
            }
        },
        default: {
            type: "object",
            required: ['message'],
            properties: {
                message: {type: "string"}
            }
        }
    }
};
export const SchemaProfile = {
    headers: {
        type: "object",
        required: ["Authorization"],
        properties: {
            Authorization: {type:"string"}
        }
    },
    response: {
        200: {
            type: "object",
            required: ['id','email','password','username'],
            properties: {
                id: {type:"string"},
                email: {type:"string",format:"email"},
                password: {type:"string"},
                username: {type:"string"}
            }
        },
        default: {
            type: "object",
            required: ["message"],
            properties: {
                message: {type: "string"}
            }
        }
    }
   
};