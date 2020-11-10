const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const pool = require("../database");
router.get("/add", (req, res) => {
  res.render("carreras/add");
});

router.post("/add", isLoggedIn, async function (req, res) {
  const { nombre } = req.body;
  const newCarrera = {
    nombre,
  };

  await pool.query("INSERT INTO  carreras  set ?", [newCarrera]);

  // res.send('recibido');
  req.flash("success", "Carrera Guardado Correctamente");
  res.redirect("/carreras");
});

router.get("/", isLoggedIn, async (req, res) => {
  const carreras = await pool.query("select * from carreras ");
  console.log(carreras);
  res.render("carreras/list", { carreras });
});

router.get("/delete/:id", async (req, res) => {
  // console.log(req.params.id);
  const { id } = req.params;
  await pool.query("DELETE FROM carreras WHERE ID = ?", [id]);
  req.flash("success", "Carrera Eliminada Correctamente");

  res.redirect("/carreras");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  // console.log(req.params.id);
  const { id } = req.params;
  const carrera = await pool.query("SELECT * FROM carreras WHERE id = ?", [id]);
  // console.log(usuario);
  res.render("carreras/edit", { carrera: carrera[0] });
});
router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const edCarrera = {
    nombre,
  };

  await pool.query("UPDATE carreras set ? WHERE id = ?", [edCarrera, id]);
  req.flash("success", "Carrera Actualizada Correctamente");
  res.redirect("/carreras");
});

module.exports = router;
