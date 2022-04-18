"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../clapbackdb/Database"));
//
let db = new Database_1.default("db1");
//
db.init().then(() => {
    //db.push('Person',{ id: "abreu", nome: "Abreu", idade: 20 });
    //console.log(db.query('Person',`*[nome='Abreu']`));
    db.listen('Person', () => {
        console.log("Person has changed");
    });
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
