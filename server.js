const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 7004;
var WebSocket = require('websocket').server;

const grpc = require('grpc');
const protoPath = path.join(__dirname, '/app/', 'proto');
const proto = grpc.load({root: protoPath, file: 'BlerterService.proto' });

// create client
const grpcServer = process.env.GRPC_HOST;

const client = new proto.com.blerter.grpc.service.BlerterService(grpcServer, grpc.credentials.createInsecure());

// cors
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Frame-Options,Access-Control-Allow-Origin, Access-Control-Allow-Headers, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Auth-Token,  Host");
    next();
};

// app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'app')));
var server = app.listen(port);
var wsServer = new WebSocket({ httpServer : server });

// websocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);


    connection.on('message', function(message) {
        var request = JSON.parse(message.utf8Data);
        var params = {};
        var health = {};
        var safety = {};
        var result = {};

        console.log("*** request:" + JSON.stringify(request));

        try {
            // grpc call events
            if(request.grpc == "generateToken") {
                client.generateToken({}, function(error, response) {

                    result.responseCode = response.responseCode;
                    result.data = response.info;

                    connection.sendUTF(
                        JSON.stringify(result)
                    );
                });
            }
            else if(request.grpc == "checkToken") {
                client.checkToken(
                    {
                        token: {
                            token: request.params.token
                        }
                    },
                    function(error, response) {
                        result.responseCode = response.responseCode;
                        result.data = response.info;

                        connection.sendUTF(
                            JSON.stringify(result)
                        );
                    });
            }
            else if(request.grpc == "postHealth") {
                health = JSON.parse(request.params.health);

                params = {
                    token: {
                        token: request.params.token
                    },
                    health: health
                };

                client.postHealth(params,
                    function(error, response) {
                        result.responseCode = response.responseCode;
                        result.data = response.info;

                        connection.sendUTF(
                            JSON.stringify(result)
                        );
                    });
            }
            else if(request.grpc == "putHealth") {
                health = JSON.parse(request.params.health);
                params = {
                    token: {
                        token: request.params.token
                    },
                    health: health
                };



                client.putHealth(params,
                    function(error, response) {
                        result.responseCode = response.responseCode;
                        result.data = response.info;

                        connection.sendUTF(
                            JSON.stringify(result)
                        );
                    });
            }
            else if(request.grpc == "getHealth") {
                client.getHealth(
                    {
                        token: {
                            token: request.params.token
                        },
                        id: {
                            id: request.params.id
                        }
                    },
                    function(error, response) {
                        result.responseCode = response.responseCode;
                        if (result.responseCode == 200) {
                            result.data = response.health;
                        } else {
                            result.data = response.info;
                        }


                        connection.sendUTF(
                            JSON.stringify(result)
                        );
                    });
            }
            else if(request.grpc == "deleteHealth") {
                client.deleteHealth(
                    {
                        token: {
                            token: request.params.token
                        },
                        id: {
                            id: request.params.id
                        }
                    },
                    function(error, response) {
                        result.responseCode = response.responseCode;
                        result.data = response.info;

                        connection.sendUTF(
                            JSON.stringify(result)
                        );
                    });
            }
        } catch(e) {
            result = {
                responseCode: 500,
                data: "NodeJs server error"
            };

            connection.sendUTF(
                JSON.stringify(result)
            );
        }

    });

    connection.on('close', function(connection) {
        console.log("close connection");
    });
});

console.log('blerter dashboard listening on port http+websocket ' + port);


