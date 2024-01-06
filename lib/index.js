'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _copyDir = require('copy-dir');

var _copyDir2 = _interopRequireDefault(_copyDir);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function statSync(f) {
    try {
        return _fs2.default.statSync(f);
    } catch (error) {
        console.error(error);
        return null;
    }
}

var _class = function () {
    function _class(config) {
        (0, _classCallCheck3.default)(this, _class);

        this.setting = (0, _assign2.default)({
            dirs: [_path2.default.resolve(process.cwd(), 'node_modules')],
            filter: /\.json$/,
            dist: "dist"
        }, config);

        var dirs = this.setting.dirs;

        if (!_lodash2.default.isArray(dirs)) {
            dirs = [dirs];
        }
        this.setting.dirs = dirs;

        var noDir = _lodash2.default.find(dirs, function (dir) {
            var stat = statSync(dir);
            return stat && !stat.isDirectory();
        });

        if (noDir) {
            console.error('\u975E\u53EF\u7528\u76EE\u5F55 , \u8BF7\u66F4\u6539\u540E\u91CD\u542F\u7F16\u8BD1 ' + noDir);
            process.exit(1);
            return;
        }
    }

    (0, _createClass3.default)(_class, [{
        key: 'apply',
        value: function apply(op) {
            var setting = this.setting;
            if (!op.code) {
                op.next();
                return;
            }
            if (!setting.filter.test(op.file)) {
                op.next();
                return;
            }
            var config = JSON.parse(op.code);

            if (!config.usingComponents) {
                op.next();
                return;
            }

            var dirs = setting.dirs;
            var files = [];
            _lodash2.default.each(dirs, function (dir) {
                _lodash2.default.each((0, _keys2.default)(config.usingComponents), function (key) {
                    var s = config.usingComponents[key];
                    var p = _path2.default.resolve(dir, s);
                    files.push({
                        p: p,
                        s: s,
                        k: key
                    });
                });
            });

            if (!files.length) {
                op.next();
                return;
            }

            op.output && op.output({
                action: '编译',
                file: op.file
            });

            _lodash2.default.each(files, function (file) {
                var stat = statSync(file.p);
                if (stat && stat.isDirectory()) {
                    var usingcomponents = 'usingcomponents/' + file.s;
                    var dist = setting.dist + '/' + usingcomponents;
                    var p = _path2.default.resolve(process.cwd(), dist);
                    _mkdirp2.default.sync(p);
                    _copyDir2.default.sync(file.p, p);
                    var f = _path2.default.parse(op.file);
                    var relative = _path2.default.relative(f.dir, p);
                    config.usingComponents[file.k] = '' + relative;
                }
            });

            op.code = (0, _stringify2.default)(config);

            op.next();
        }
    }]);
    return _class;
}();

exports.default = _class;
