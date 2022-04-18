
import Database from "../clapbackdb/Database";
//
let db = new Database("db1");
//
db.init().then(() => {

    //db.push('Person',{ id: "abreu", nome: "Abreu", idade: 20 });
    //console.log(db.query('Person',`*[nome='Abreu']`));
    db.listen('Person', () => {
        console.log("Person has changed");
    })

    db.serve(3333).then(() => { 

        setTimeout(() => {
            db.push('Person', { id: "abreu", nome: "Abreu", idade: 20 });
            setTimeout(() => {
                db.push('Person', { id: "abreu", nome: "Abreu", idade: 20 });
            }, 1000);

        }, 1000);

    });
    //db.push('Person',{ id: "abreu", nome: "Abreu", idade: 20 });
});
