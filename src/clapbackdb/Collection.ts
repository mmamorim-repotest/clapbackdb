
import Writer from './Writer'
import appRootPath from 'app-root-path'
import fs from "fs"
import _log from '../utils/logs';
import Database from './Database';
import jsonata from "jsonata"

interface IElem {
    id: string;
}

type CollectionData = {
    [key: string]: any;
};


class Collection {
    entity: string;
    private filePath: string;
    private file: string;
    private writer;
    private data: CollectionData;
    private _oninit: Function;
    private dbPath: string;
    constructor(dbPath: string, entity: string, file: string = "db.json") {
        this.entity = entity;
        this.file = file;
        this.dbPath = dbPath;
        this.filePath = appRootPath + "/" + this.dbPath + "/" + this.file;
        this.writer = new Writer(this.filePath);
        this.data = {};
        this._oninit = () => { };
    }

    onInit(func: Function) {
        this._oninit = func;
    }

    init() {
        let file = this.filePath;
        return new Promise((resolve, rejects) => {
            //console.log(file);            
            if (!fs.existsSync(file)) {
                _log.warn(`collection [/${this.dbPath}/${this.file}] file does not exist! ...creating`);
                fs.writeFileSync(file, "{}");
            }
            _log.ok(`[/${this.dbPath}/${this.file}] file collection ok!`);
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    rejects(err);
                }
                this.data = JSON.parse(data);
                this._oninit();
                resolve(true);
            })
        })
    }

    get(id?: any): any {
        if (id == undefined) {
            return this.data;
        } else {
            return this.data[id];
        }
    }

    query(queryText: string): Promise<any> {
        //console.log(`${this.entity}:`,this.data);        
        return new Promise((resolve, rejects) => {
            try {
                let expression = jsonata(queryText);
                let result = expression.evaluate(this.data);
                //console.log(result);
                if (result != undefined) {
                    delete result.sequence;
                    resolve(result);
                }
            } catch (e) {
                rejects(e);
            }
            resolve(null);
        });
    }

    push(item: any) {
        this.data[item.id] = item;
        this.write();
    }

    async write() {
        await this.writer.write(JSON.stringify(this.data));
    }

}

export default Collection;
