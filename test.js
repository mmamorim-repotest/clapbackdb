
import clapbackdb from "./src/clapbackdb/clapbackdb.js"

console.log(clapbackdb);
clapbackdb.createDB("teste", "/teste.json")
    .then(main)
    .catch((e) => {
        console.log(e);
    });

function main(db) {
    console.log(db);
    db.data.pessoas = {};
    db.data.pessoas.ana = { id: "ana", nome: "Ana Silva" };
    db.write();
    console.log(db.data);
}