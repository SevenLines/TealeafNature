import path from "path";
import fs from "fs";
import {Buffer} from "buffer";
import marked from "marked";
import _ from 'lodash'

export async function uploadFileFunc(file: File, jekyll_folder) {
    let assets_folder = path.join('assets', "tasks");
    let folder = path.join(jekyll_folder, assets_folder)

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    let length = fs.readdirSync(folder).length
    let filename = `${String(length).padStart(3, '0')}_${file.name.trim()}`

    let arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    fs.writeFile(path.join(folder, filename), (buffer as any), err => {
        if (err) return console.log(err);
    })

    return {
        link: path.join("/", assets_folder, filename).replace(/\s/, "%20").replace(/\\/g, "/"),
    }
}

export function previewRenderFunc(text: string, jekyll_folder) {
    let dir = "file://" + jekyll_folder.replace(/\\/g, "/");
    text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `$1${dir}$2$3`)
    text = marked(text)
    return text;
}

export default function setDefault(obj, prop, deflt) {
  return _.has(obj, prop) ? obj[prop] : (obj[prop] = deflt);
}