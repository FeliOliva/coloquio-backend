const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RoutesClientes = require("./routes/clientRoutes");
const Routes_Cuentas_Corrientes = require("./routes/cuenta_corrientesRoutes");
const RoutesRemitos = require("./routes/remitoRoutes");
const RoutesEntregas = require("./routes/entregaRoutes");
const RoutesChat = require("./routes/chatRoutes");
app.use("/api", RoutesClientes, Routes_Cuentas_Corrientes, RoutesRemitos, RoutesEntregas, RoutesChat);

app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce" +
        ", X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId" +
        ", X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "HEAD,OPTIONS,GET,PUT,POST,DELETE"
    );
    next();
});

module.exports = app;

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
