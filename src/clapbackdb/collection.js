
import createWriter from "./writer.js";

export default async function createDB(alias,filePath) {
    const db = {
        disclaimer: '🌠🚀 Just a realtime json database 🗃️ ',
        write: async () => {
            await db.writer(db.data);
        }, 
        writer: null,
        data: {},
    }
    return new Promise((resolve, reject) => {
        createWriter(filePath,db.data).then((write) => {
            db.writer = write;
            resolve(db);
        }).catch((e) => {
            reject(e);
        })
    });
}