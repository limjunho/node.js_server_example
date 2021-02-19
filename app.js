"use strict";

// HTTP Server init
const port = 3001;
const express = require("express");
const app = express();

// Swagger init
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Router init
const userRouter = require("./routes/User");
const calenderRouter = require("./routes/Calendar");
const publicMoneyRouter = require("./routes/PublicMoney");
const BoardRouter = require("./routes/Board");

// MiddleWare
app.use(function(req, res, next){
    console.log("[Middle] ## Received HTTP Request ##");
    console.log("[Middle] Request : " + req.method + " " + req.url);
    console.log("[Middle] Content-Type : " + req.header("Content-Type"));

    next();
});

// Route Start
app.use("/user", userRouter);
app.use("/calendar", calenderRouter);
app.use("/publicmoney", publicMoneyRouter);
app.use("/board", BoardRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Server Start
app.listen(port, function(){
    console.log("[Server] Server on (Port : " + port + ")");
});
