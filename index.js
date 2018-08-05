import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import copydir from 'copy-dir';
import mkdirp from 'mkdirp';

function statSync(f) {
    try {
        return fs.statSync(f)
    } catch (error) {
        console.error(error);
        return null
    }
}
export default class {
    constructor(config) {
        this.setting = Object.assign({
            dirs: [path.resolve(process.cwd(), 'node_modules')],
            filter: /\.json$/,
            dist: "dist"
        }, config);

        let dirs = this.setting.dirs;

        if (!_.isArray(dirs)) {
            dirs = [dirs]
        }
        this.setting.dirs = dirs;

        const noDir = _.find(dirs, (dir) => {
            const stat = statSync(dir);
            return stat && !stat.isDirectory()
        })

        if (noDir) {
            console.error(`非可用目录 , 请更改后重启编译 ${noDir}`)
            process.exit(1);
            return;
        }
    }
    apply(op) {
        let setting = this.setting;
        if (!op.code) {
            op.next();
            return
        }
        if (!setting.filter.test(op.file)) {
            op.next();
            return
        }
        const config = JSON.parse(op.code);

        if (!config.usingComponents) {
            op.next();
            return
        }

        const dirs = setting.dirs;
        const files = []
        _.each(dirs, (dir) => {
            _.each(Object.keys(config.usingComponents), (key) => {
                const s = config.usingComponents[key];
                const p = path.resolve(dir, s);
                files.push({
                    p: p,
                    s: s,
                    k: key
                });
            })
        })

        if (!files.length) {
            op.next();
            return
        }

        op.output && op.output({
            action: '编译',
            file: op.file
        });

        _.each(files, (file) => {
            const stat = statSync(file.p);
            if (stat && stat.isDirectory()) {
                const usingcomponents = `usingcomponents/${file.s}`
                const dist = `${setting.dist}/${usingcomponents}`
                const p = path.resolve(process.cwd(), dist);
                mkdirp.sync(p);
                copydir.sync(file.p, p);
                const f = path.parse(op.file);
                const relative = path.relative(f.dir, p);
                config.usingComponents[file.k] = `${relative}`;
            }
        })

        op.code = JSON.stringify(config);

        op.next();
    }
}