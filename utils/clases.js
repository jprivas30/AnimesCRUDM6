const { v4: uuid } = require("uuid");

class Anime {

    constructor({ id, nombre, genero, year, autor, imagen }) {
        this.id = id || uuid().slice(0, 2);
        this.nombre = nombre;
        this.genero = genero;
        this.year = year;
        this.autor = autor;
        this.imagen = imagen
    }

}

module.exports = Anime
