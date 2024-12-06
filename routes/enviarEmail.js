const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const googleKey = process.env.GOOGLE_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "facundolizardotrabajosia@gmail.com",
    pass: googleKey,
  },
});

router.post("/", async (req, res) => {
  const {
    nombre,
    ocupacion,
    telefono,
    ruc,
    direccion,
    productos,
    apiKey,
  } = req.body;
  const api_key = process.env.API_KEY;
  try {
    if (!apiKey) {
      console.error("Api key no proporcionada");
      return res.status(401).json({ message: "Api key no proporcionada" });
    }
    if (api_key !== apiKey) {
      console.error("Api key incorrecta");
      return res.status(401).json({ message: "Api key incorrecta", apiKey });
    }
    if (!nombre || !ocupacion || !ruc || !telefono || !direccion) {
      console.error("Los campos nombre, ocupacion, ruc, telefono y direccion son obligatorios");
      return res.status(400).json({
        message:
          "Los campos nombre, ocupacion, ruc, telefono y direccion son obligatorios",
      });
    }
    // Limpiar el string de productos eliminando escapes adicionales
    let arrayProductos;
    try {
      const cleanedProductos = productos.replace(/\\\\/g, "\\"); // Elimina \\ adicionales
      arrayProductos = JSON.parse(cleanedProductos); // Parsear el string limpio
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: "El campo productos no tiene un formato JSON válido",
        error: error.message,
      });
    }
    if (!Array.isArray(arrayProductos)) {
      console.error("El campo productos debe ser un array");
      return res
        .status(400)
        .json({ message: "El campo productos debe ser un array válido" });
    }
   
    const mailOptions = {
      from: "facundolizardotrabajosia@gmail.com",
      to: "facundolizardo75@gmail.com",
      subject: "Correo de test del agente de ventas de PLAUD",
      text: `Hola, este es un correo enviado para testear el agente de ventas.
      Informacion de la compra: 
      - Cliente
      Nombre: ${nombre}
      Ocupacion: ${ocupacion}
      Telefono: ${telefono} 
      RUC: ${ruc} 
      Direccion: ${direccion}
      - Productos
      ${arrayProductos
        .map((producto, index) => {
          const number = index + 1;
          return `
      ${number}. Nombre: ${producto.nombre}
        Cantidad: ${producto.cantidad}
      `;
        })
        .join("")}
      `,
    };
    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado con éxito", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el correo", error });
  }
});

module.exports = router;
