const Anime = require("../utils/clases.js")
const express = require("express");
const _ = require("lodash");
const app = express();
const fn = require("../utils/utils.js")
const { create } = require("express-handlebars")

app.use("/public", express.static(__dirname + "../../public"));



const hbs = create({ partialsDir: ["views/partials/"] })

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "../../views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//Vistas Renderizadas
app.get("/", async (req, res) => {
    let { busqueda } = req.query
    let data = await fn.leerAnime()
    let animes = data.animes


    if (busqueda) {
        let nombreEncontrado = data.animes.filter(
            (anime) =>
                anime.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                anime.genero.toLowerCase().includes(busqueda.toLowerCase()) ||
                String(anime.id).toLowerCase().includes(String(busqueda).toLowerCase()) ||
                String(anime.year).toLowerCase().includes(String(busqueda).toLowerCase()) ||
                anime.autor.toLowerCase().includes(busqueda.toLowerCase())

        );

        animes = nombreEncontrado
    }

    res.render("home", {
        animes,
        titulo: "Lista de Animes",
        homepage: true
    })
})

// Endpoints

//Endpoint Para Obtener Todos los Animes
app.get("/api/v1/animes", async (req, res) => {
    try {
        let animes = await fn.leerAnime();
        res.send({ code: 200, data: animes, message: "Animes encontrados con éxito" });
    } catch (error) {
        res.status(500).send({ code: 500, message: error });
    }
});

//Endpoint Para Obtener animes por nombre o ID
app.get("/api/v1/animes/:nameorid", async (req, res) => {
    try {
        let nameorid = req.params.nameorid;
        let data = await fn.leerAnime();
        let animeBuscado;
        let index = _.findIndex(data.animes, (anime) => _.isEqual(String(anime.id), String(nameorid)));
        let nombreEncontrado = data.animes.filter((anime) =>
            anime.nombre.toLowerCase().includes(nameorid.toLowerCase())
        );
        if (index != -1) {
            animeBuscado = await fn.leerPorNombreiD(index);
            res.send({ code: 200, data: animeBuscado, message: "Anime encontrado con éxito" });
        } else if (nombreEncontrado) {
            res.send({ code: 200, data: nombreEncontrado, message: "Anime encontrado con éxito" });
        } else {
            res.send({ code: 404, message: "Anime no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ code: 500, message: error });
    }
});

//Endpoint Para Crear Animes
app.post("/api/v1/animes", async (req, res) => {
    try {
        let data = await fn.leerAnime()
        let { nombre, genero, year, autor, imagen } = req.body
        let yearNumero = Number(year)
        let indice = data.animes.findIndex(anime => (anime.nombre.toLowerCase() == nombre.toLowerCase()))
        if (indice !== -1) {
            res.status(409).send({ code: 409, message: `ya existe un animé con el nombre ${nombre}` })
        } else {
            if (!isNaN(yearNumero)) {
                let animeNuevo = new Anime({ nombre, genero, year, autor, imagen})
                await fn.crearAnime(animeNuevo)
                res.status(201).send({ code: 201, message: `anime ${animeNuevo.nombre} fue creado con éxito `, data: animeNuevo })
            } else {
                res.status(409).send({ code: 409, message: `el año debe ser un número` })
            }
        }

    } catch (error) {
        res.status(500).send({ code: 500, message: error });
    }
})

//Endpoint Para Editar Animes
app.put("/api/v1/animes/:id", async (req, res) => {
    try {
        let id = req.params.id
        let { nombre, genero, year, autor, imagen } = req.body
        let yearNumero = Number(year)
        if (!isNaN(yearNumero)) {
            let animeEditar = new Anime({ nombre, genero, year, autor, imagen})
            await fn.modificarAnime(id, animeEditar)
            res.send({ code: 200, data: animeEditar, message: "Anime editado con éxito" })
        } else {
            res.status(409).send({ code: 409, message: `el año debe ser un número` })
        }
    } catch (error) {
        res.status(500).send({ code: 500, message: error });
    }
})

//Endpoint Para Eliminar Animes
app.delete("/api/v1/animes/:id", async (req, res) => {
    try {
        let animeId = req.params.id
        let data = await fn.leerAnime()
        let index = _.findIndex(data.animes, (anime) => _.isEqual(String(anime.id), String(animeId)))

        if (index != -1) {
            await fn.eliminarAnime(index)
            res.send({ code: 200, message: `Anime ${data.animes[index].nombre} eliminado con éxito` })
        } else {
            res.status(409).send({ code: 404, message: "Anime no encontrado" })
        }

    } catch (error) {
        res.status(500).send({ code: 500, message: error });
    }
})

//Vista Error 404
app.all("*", (req, res) => {
    res.render("error404", {
        layout: "error"
    })
})

module.exports = app;