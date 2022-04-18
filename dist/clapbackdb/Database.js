"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_1 = __importDefault(require("fs"));
const Collection_1 = __importDefault(require("./Collection"));
const logs_1 = __importDefault(require("../utils/logs"));
const Server_1 = __importDefault(require("./Server"));
const dbsPath = 'databases';
class Database {
    constructor(name) {
        this.disclosure = '🌠🚀 Just a realtime json database 🗃️ ';
        this.serverOn = false;
        this.name = name;
        this.pathDb = dbsPath + "/" + name;
        this.pathDir = app_root_path_1.default + "/" + this.pathDb;
        if (!fs_1.default.existsSync(app_root_path_1.default + "/" + dbsPath)) {
            logs_1.default.warn("'database' folder does not exist! ...creating");
            fs_1.default.mkdirSync(app_root_path_1.default + "/" + dbsPath);
        }
        logs_1.default.ok(`Database [/${dbsPath}] folder ok!`);
        if (!fs_1.default.existsSync(this.pathDir)) {
            logs_1.default.warn(`[${this.name}] folder does not exist! ...creating`);
            fs_1.default.mkdirSync(this.pathDir);
        }
        logs_1.default.ok(`[/${dbsPath}/${this.name}] folder ok!`);
        this.collections = {};
        this.config = new Collection_1.default(this.pathDb, "_Config", "_config.json");
        this.listners = {};
    }
    addCollection(entity, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = new Collection_1.default(this.pathDb, entity, file);
            this.collections[collection.entity] = collection;
            yield collection.init();
            this.config.push({ id: entity, entity, file });
        });
    }
    query(entity, statement) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collections[entity];
            let result = yield collection.query(statement);
            return result;
        });
    }
    push(entity, elem) {
        let collection = this.collections[entity];
        if (elem.id == undefined || elem.id == null || elem.id.trim().length == 0) {
            logs_1.default.err("No ID found! Push ignored.");
            return;
        }
        collection.push(elem);
        if (this.listners[entity] != undefined) {
            this.listners[entity].callback();
            if (this.serverOn) {
                this.io.emit(`changeEntity-${entity}`, { changed: true });
                console.log(`changeEntity-${entity} has send`);
            }
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.init();
            let collections = this.config.get();
            //console.log("collections",collections);
            for (let key in collections) {
                let entity = collections[key].entity;
                let file = collections[key].file;
                let c = new Collection_1.default(this.pathDb, entity, file);
                yield c.init();
                this.collections[entity] = c;
            }
            console.log('🌠🚀 database is on 🗃️ ');
        });
    }
    serve(port) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let io = yield (0, Server_1.default)(port, this);
            this.io = io;
            this.serverOn = true;
            this.io.on('connection', (socket) => {
                console.log('a user connected');
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                });
                socket.on('chat message', (msg) => {
                    console.log('message: ' + msg);
                });
                this.socket = socket;
            });
        });
    }
    listen(entity, callback) {
        this.listners[entity] = { entity, callback };
    }
    get(req, res) {
        //console.log(req.query);        
        let entity = req.query.entity;
        let _query = req.query.query;
        if (_query == undefined || entity == undefined) {
            res.status(200).json({ message: '🚀 Houston, we have a problem!', error: true });
        }
        else {
            //console.log("entity",entity);
            //console.log("_query",_query);              
            this.query(entity, _query).then((data) => {
                res.status(200).json(data);
            }).catch((data) => {
                res.status(200).json(data);
            });
        }
    }
    post(req, res) {
        //console.log(req.body);        
        let entity = req.body.entity;
        let data = req.body.data;
        if (data == undefined || entity == undefined) {
            res.status(200).json({ message: '🚀 Houston, we have a problem!', error: true });
        }
        else {
            //console.log("entity",entity);
            data = JSON.parse(data);
            //console.log("data",data);              
            this.push(entity, data);
            res.status(200).json({ error: false });
        }
    }
    status() {
        console.log(this);
    }
}
exports.default = Database;
