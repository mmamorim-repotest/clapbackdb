import appRootPath from 'app-root-path'
import fs from "fs"
import Collection from "./Collection"
import _log from "../utils/logs"
import { resolve } from 'path';
import initServer from "./Server"
import { Request, Response } from "express";

type CollectionList = {
    [key: string]: Collection;
};

const dbsPath = 'databases';

class Database {
    public disclosure: string = '🌠🚀 Just a realtime json database 🗃️ ';
    private name: string;
    private pathDir: string;
    private pathDb: string;
    private collections: CollectionList;
    private config: Collection;
    private io: any;
    private socket: any;
    private serverOn: boolean = false;
    private listners: any;
    constructor(name: string) {
        this.name = name;
        this.pathDb = dbsPath + "/" + name;
        this.pathDir = appRootPath + "/" + this.pathDb;
        if (!fs.existsSync(appRootPath + "/" + dbsPath)) {
            _log.warn("'database' folder does not exist! ...creating");
            fs.mkdirSync(appRootPath + "/" + dbsPath);
        }
        _log.ok(`Database [/${dbsPath}] folder ok!`);
        if (!fs.existsSync(this.pathDir)) {
            _log.warn(`[${this.name}] folder does not exist! ...creating`);
            fs.mkdirSync(this.pathDir);
        }
        _log.ok(`[/${dbsPath}/${this.name}] folder ok!`);
        this.collections = {};
        this.config = new Collection(this.pathDb, "_Config", "_config.json")
        this.listners = {};
    }

    async addCollection(entity: string, file: string) {
        let collection = new Collection(this.pathDb, entity, file);
        this.collections[collection.entity] = collection;
        await collection.init();
        this.config.push({ id: entity, entity, file });
    }

    async query(entity: string, statement: string) {
        let collection = this.collections[entity];
        let result = await collection.query(statement);
        return result;
    }

    push(entity: string, elem: any) {
        let collection = this.collections[entity];
        if (elem.id == undefined || elem.id == null || elem.id.trim().length == 0) {
            _log.err("No ID found! Push ignored.");
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

    async init() {
        await this.config.init();
        let collections = this.config.get();
        //console.log("collections",collections);
        for (let key in collections) {
            let entity = collections[key].entity;
            let file = collections[key].file;
            let c = new Collection(this.pathDb, entity, file);
            await c.init();
            this.collections[entity] = c;
        }
        console.log('🌠🚀 database is on 🗃️ ');
    }

    async serve(port: any) {
        let self = this;
        let io = await initServer(port, this);
        this.io = io;
        this.serverOn = true;
        this.io.on('connection', (socket: any) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('chat message', (msg: any) => {
                console.log('message: ' + msg);
            });
            this.socket = socket;
        });
    }

    listen(entity: string, callback: Function) {
        this.listners[entity] = { entity, callback };
    }

    get(req: Request, res: Response) {
        //console.log(req.query);        
        let entity: any = req.query.entity;
        let _query: any = req.query.query;
        if (_query == undefined || entity == undefined) {
            res.status(200).json({ message: '🚀 Houston, we have a problem!', error: true });
        } else {
            //console.log("entity",entity);
            //console.log("_query",_query);              
            this.query(entity,_query).then((data) => {
                res.status(200).json(data);                
            }).catch((data) => {
                res.status(200).json(data);                            
            });
        }
    }

    post(req: Request, res: Response) {
        //console.log(req.body);        
        let entity: any = req.body.entity;
        let data: any = req.body.data;
        if (data == undefined || entity == undefined) {
            res.status(200).json({ message: '🚀 Houston, we have a problem!', error: true });
        } else {
            //console.log("entity",entity);
            data = JSON.parse(data);
            //console.log("data",data);              
            this.push(entity,data);
            res.status(200).json({ error: false });
        }
    }

    status() {
        console.log(this);
    }
}

export default Database;