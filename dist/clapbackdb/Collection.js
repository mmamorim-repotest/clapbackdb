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
const Writer_1 = __importDefault(require("./Writer"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const fs_1 = __importDefault(require("fs"));
const logs_1 = __importDefault(require("../utils/logs"));
const jsonata_1 = __importDefault(require("jsonata"));
class Collection {
    constructor(dbPath, entity, file = "db.json") {
        this.entity = entity;
        this.file = file;
        this.dbPath = dbPath;
        this.filePath = app_root_path_1.default + "/" + this.dbPath + "/" + this.file;
        this.writer = new Writer_1.default(this.filePath);
        this.data = {};
        this._oninit = () => { };
    }
    onInit(func) {
        this._oninit = func;
    }
    init() {
        let file = this.filePath;
        return new Promise((resolve, rejects) => {
            //console.log(file);            
            if (!fs_1.default.existsSync(file)) {
                logs_1.default.warn(`collection [/${this.dbPath}/${this.file}] file does not exist! ...creating`);
                fs_1.default.writeFileSync(file, "{}");
            }
            logs_1.default.ok(`[/${this.dbPath}/${this.file}] file collection ok!`);
            fs_1.default.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    rejects(err);
                }
                this.data = JSON.parse(data);
                this._oninit();
                resolve(true);
            });
        });
    }
    get(id) {
        if (id == undefined) {
            return this.data;
        }
        else {
            return this.data[id];
        }
    }
    query(queryText) {
        //console.log(`${this.entity}:`,this.data);        
        return new Promise((resolve, rejects) => {
            try {
                let expression = (0, jsonata_1.default)(queryText);
                let result = expression.evaluate(this.data);
                //console.log(result);
                if (result != undefined) {
                    delete result.sequence;
                    resolve(result);
                }
            }
            catch (e) {
                rejects(e);
            }
            resolve(null);
        });
    }
    push(item) {
        this.data[item.id] = item;
        this.write();
    }
    write() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write(JSON.stringify(this.data));
        });
    }
}
exports.default = Collection;
