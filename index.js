const app = require("./app/server.js")

const main = () => {
    app.listen(3000, ()=> console.log("servidor escuchando en http://localhost:3000"))
}

main();