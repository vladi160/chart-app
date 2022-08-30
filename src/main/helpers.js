const fs = require('fs');
const chokidar = require('chokidar');
import settings from 'electron-settings';

export const getDataFromFile = (path) => {
    return fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) {
            console.log('------------------------------------------------------888888888888888888888888888')
            console.log(err);

            return { error: err };
        }
        const obj = JSON.parse(data);
        return obj;

    });
}

export const setToWatch = (path2Watch) => {
    console.log(chokidar)
    const watcher = chokidar.watch(path2Watch, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    const fileToWatch = settings.getSync('path');
    return watcher
        .on('add', path => {
            console.log(`File ${path} has been added`)
        })
        .on('change', path => {
            console.log(`File ${path} has been changed`)
            if (fileToWatch === path) {
                return { status: 'changed' };
            }
        })
        .on('unlink', path => console.log(`File ${path} has been removed`));
}