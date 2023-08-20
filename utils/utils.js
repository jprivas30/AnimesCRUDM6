const fs = require("fs/promises")
const path = require('path');

let ubicacion = path.resolve(__dirname, "../database/animes.json");

const leerAnime = async () => {
    try {
        let data = await fs.readFile(ubicacion, "utf8")
        data = JSON.parse(data)
        return data
    } catch (error) {
        throw new Error("ha ocurrido un error")
    }
}

const leerPorNombreiD = async (indice) => {
    try {
        let data = await leerAnime()
        let animeBusqueda = data.animes[indice]
        return animeBusqueda
        }
    catch (error) {
        throw new Error("ha ocurrido un error")
        
    }
}
const crearAnime = async (nuevoAnime) => {

    
    try {
        let data = await leerAnime()
        data.animes.push(nuevoAnime)
        data = JSON.stringify(data, null, 4)
        await fs.writeFile(ubicacion, data, "utf8")
    } catch (error) {
        throw new Error("ha ocurrido un error")
    }
}

const modificarAnime = async (id, animeEditado) => {
    try {
        let data = await leerAnime()
        let { nombre, genero, year, autor, imagen } = animeEditado
        let animeEncontrado = data.animes.find((anime) => anime.id == id)
        if(animeEncontrado){
            animeEncontrado.nombre = nombre
            animeEncontrado.genero = genero
            animeEncontrado.year = year 
            animeEncontrado.autor = autor
            animeEncontrado.imagen = imagen
            data = JSON.stringify(data, null, 4)
            await fs.writeFile(ubicacion, data, "utf8")
        } 
    } catch (error) {
        throw new Error("ha ocurrido un error")
    }
    
}

const eliminarAnime = async (index) => {
    try {
        let data = await leerAnime()
        data.animes.splice(index, 1)
        data = JSON.stringify(data, null, 4)
        await fs.writeFile(ubicacion, data, "utf8")

    } catch (error) {
        throw new Error("ha ocurrido un error")
    }
}

let funciones = {
    leerAnime,
    leerPorNombreiD,
    modificarAnime,
    eliminarAnime,
    crearAnime,
}

module.exports = funciones