import colors from "colors";

const _log = {
    ok: (text: string) => {
        console.log(colors.green(text));
    },
    err: (text: string) => {
        console.log(colors.red(text));
    },
    warn: (text: string) => {
        console.log(colors.yellow(text));
    }
};

export default _log;