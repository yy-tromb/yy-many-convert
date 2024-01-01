import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
const run = promisify(execFile);

if (process.argv.length < 4) {
    console.error(
        `Arguments is not enough
Usage: path_to_Node.js path_to_yy-many-convert.js {source_folder} {output_folder}`
    );
}

const MAX_PROCESS = 15;
const CONVERT_COMMAND = "ffmpeg";
const compile_args = (source_file, output_file) => {
    return [
        "-i",
        source_file,
        "-c:v",
        "libaom-av1",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-still-picture",
        "1",
        "-y",
        output_file,
    ];
};
const OUTPUT_EXTENTION = ".avif"; // please include "."
const source_folder = process.argv[2];
const output_folder = process.argv[3];

const processes = Array.from({ length: MAX_PROCESS }, (_, id) =>
    Promise.resolve(id).then(on_convert_end)
);
const isrunnings = Array.from({ length: MAX_PROCESS }, () => true);
const converting = Array(MAX_PROCESS);

let successed = 0;
let failed = 0;
let converted = 0;

const source_file_dirents = await fs
    .readdir(source_folder, {
        withFileTypes: true,
        encoding: "utf-8",
    })
    .then((dirents) => dirents.filter((dirent) => dirent.isFile()));
const source_files_len = source_file_dirents.length;
// loop files in source directory
for (const [index, dirent] of source_file_dirents.entries()) {
    if (dirent.isDirectory()) {
        console.warn(
            `"${path.resolve(
                source_folder,
                dirent.name
            )}" is directory. This can't be converted.`
        );
        continue;
    } else {
        const source_file = path.resolve(source_folder, dirent.name);
        const output_file = path.resolve(
            output_folder,
            path.parse(dirent.name).name + OUTPUT_EXTENTION
        );
        let id;
        await Promise.race(processes) // await a process that is successed or failed.
            .finally(() => (id = get_not_running_id()))
            .catch(handle_error);
        const new_process = run( // make new process
            CONVERT_COMMAND,
            compile_args(source_file, output_file),
            {
                maxBuffer: 8 * 1024 * 1024,
            }
        )
            .then(on_convert_end.bind(undefined, id, "successed")) // close id in scope
            .catch(
                ((id) => {
                    return (e) => {
                        handle_error(e);
                        return on_convert_end(id, "failed"); // close id in scope
                    };
                })(id)
            ); // this instance function returns function
        processes[id] = new_process;
        isrunnings[id] = true;
        converting[id] = source_file;
        console.info(
            `[${source_file}] is started to convert. (${index+1}/${source_files_len}) is started to convert.`
        );
    }
}
Promise.allSettled(processes).then(() => {
    console.info("\nAll Finished!");
    console.info(
        `Successed is ${successed}/${source_files_len}.
Failed is ${failed}/${source_files_len}.`
    );
});

function on_convert_end(id, status) {
    isrunnings[id] = false;
    if (converting[id] !== undefined) {
        converted++;
        console.info(
            `Converting [${converting[id]}] is ${status}. (${converted}/${source_files_len}) is completed.`
        );
        if (status === "successed") {
            successed++;
        } else if (status === "failed") {
            failed++;
        } else {
            throw Error("status message is incorrent.");
        }
    }
    return id;
}

function get_not_running_id() {
    const id = isrunnings.indexOf(false);
    if (id === -1) {
        throw Error("not running process is not found.");
    } else {
        return id;
    }
}

function handle_error(error) {
    console.error(error);
}
