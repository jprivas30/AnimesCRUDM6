const chai = require("chai");
const chaihttp = require("chai-http");
const app = require("../app/server.js");
const assert = chai.assert;
let servidor = app.listen(3000)
chai.use(chaihttp)


describe("PRUEBAS RUTA GET", () =>{
    let respuesta
    before((done) => {
        chai.request(servidor)
            .get("/api/v1/animes")
            .end((error, res) => {
                respuesta = res.body;
                done();
            });
    }); 
            it("validar que respuesta sea un objeto", (done) =>{
                assert.isObject(respuesta, "Respuesta no es un objeto")
                done()
            });
            it("validar que respuesta tenga un code en el body", (done) =>{
                assert.exists(respuesta.code, "no existe la propiedad code")
                done()
            });
            it("validar que respuesta tenga un message en el body", (done) =>{
                assert.exists(respuesta.message, "no existe la propiedad message")
                done()
            });
            it("validar que respuesta sea un objeto", (done) =>{
                assert.isObject(respuesta, "Respuesta no es un objeto")
                done()
            });
})




    describe("PRUEBAS RUTA DELETE", () => {
        let respuesta;
    
        before((done) => {
            chai.request(servidor)
                .delete("/api/v1/animes/aaa")
                .end((error, res) => {
                    respuesta = res.body;
                   done();
                });
        });
    
        it("Código de respuesta debe ser 200", (done) => {
            assert.equal(respuesta.code, 200, "Código de estado no corresponde.");
            done();
        });
    
        it("La propiedad 'message' de la respuesta debe ser 'Anime eliminado con éxito'", (done) => {
            let animeEliminado;
            let respuesta = {body: {message: `Anime ${animeEliminado} eliminado con éxito`}};
            let mensaje = respuesta.body.message;
            assert.equal(mensaje, `Anime ${animeEliminado} eliminado con éxito`, "El mensaje no coincide.");
            done();
          });
      
    });




describe("PRUEBAS RUTA PUT", () => {

    let nuevosDatos = {
            nombre: "Naruto",
            genero: "Shonen",
            year: 2002,
            autor: "Masashi Kishimoto",
            imagen: "/public/img/naruto.jpg",
    };

    let responsePut;
    chai.request(servidor)
        .put("/api/v1/animes/" + 10)
        .send(nuevosDatos)
        .end((error, res) => {
            responsePut = res;
        });

    it("código respuesta 200, retorne objeto modificado.", (done) => {
        let body = responsePut.body;
        assert.equal(responsePut.status, 200, "código de respuesta no corresponde.");
        assert.equal(body.code, 200, "código de respuesta no corresponde.");
        done();
    });

    it("Retorno sea un objeto, y cuente con id que igual al ingresado.", (done) => {
        let body = responsePut.body;
        let producto = responsePut.body.data;
        assert.isObject(body.data, "Retorno no es un objeto");
        assert.exists(producto.id, "No retorna producto con un id");
        done();
    });
});


describe("PRUEBAS RUTA POST", () => {

    let nuevoAnime = {
        nombre: "test",
        genero: "test",
        autor: "test",
        imagen: "test",
        year: 1999  
    }
    

    let responsePost;
    chai.request(servidor)
        .post("/api/v1/animes")
        .send(nuevoAnime)
        .end((error, res) => {
            responsePost = res;
        });
    it("Validar código de estados sea 201 y propiedad code exista y tambien sea 201", (done) => {
        assert.equal(responsePost.status, 201, "Código de estado diferente a 201");
        assert.exists(responsePost.body.code, "Debe existir propiedad code en objeto data.");
        assert.propertyVal(responsePost.body,"code",201,"código de respuesta no es 201.");
        done();
    });
    it("Validar que anime creado sea retornado y tenga propiedad data, la cual sea un objeto", (done) => {
        assert.exists(responsePost.body.data, "No existe propiedad data en la respuesta");
        assert.isObject(responsePost.body.data,"Data retornada no es un objeto.");
        done();
    });

    it("Validar si anime retornado nos trae un id", (done) => {
        assert.exists(responsePost.body.data.id,"Objeto de respuesta no tiene propiedad id.");
        done();
    });

    it("Verificar si anime recientemente creado se encuentra en base de datos.", (done) => {
        let productoCreado = responsePost.body.data;
        let { id } = productoCreado;

      chai.request(servidor)
            .get("/api/v1/animes" + id)
            .end((error, res) => {
              assert.isObject(res.body, "Respuesta no es un objeto.");
              assert.equal(res.status, 200, "código de respuesta esperado 200");
            })
        done();
    });
});
