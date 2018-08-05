import path from 'path';
import fs from 'fs';
import _ from 'lodash';

export default class {
    constructor({
        dirs = [],
        filter = "*.config"
    }) {

        if (!_.isArray(dirs)) {
            dirs = [dirs]
        }


        const noDir = _.find(dirs, (dir) => {
            const stat = fs.statSync(dir);
            return !stat.isDirectory()
        })

        if (noDir) {
            console.error(`非可用目录 , 请更改后重启编译 ${noDir}`)
            process.exit(1);
            return;
        }

        this.setting = {
            dirs,
            filter
        };
    }
    apply(op) {

        let setting = this.setting;

        if (op.code !== null && setting.filter.test(op.file)) {
            op.output && op.output({
                action: '变更',
                file: op.file
            });

            let config = setting.config;
            let configs = [];

            if (config instanceof Array) {
                configs = configs.concat(config);
            } else if (config instanceof Object && !config.find) {
                for (let key in config) {
                    let value = config[key];
                    if (value.find) {
                        configs.push(value);
                    }
                }
            } else if (config instanceof Object && config.find) {
                configs.push(config);
            }

            configs.forEach((config) => {
                op.code = op.code.replace(config.find, config.replace);
            })
        }


        op.next();
    }
}