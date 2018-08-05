'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
    function _class(_ref) {
        var _ref$dirs = _ref.dirs,
            dirs = _ref$dirs === undefined ? [] : _ref$dirs,
            _ref$filter = _ref.filter,
            filter = _ref$filter === undefined ? "*.config" : _ref$filter;
        (0, _classCallCheck3.default)(this, _class);


        if (!_lodash2.default.isArray(dirs)) {
            dirs = [dirs];
        }

        var noDir = _lodash2.default.find(dirs, function (dir) {
            var stat = _fs2.default.statSync(dir);
            return !stat.isDirectory();
        });

        if (noDir) {
            console.error('\u975E\u53EF\u7528\u76EE\u5F55 , \u8BF7\u66F4\u6539\u540E\u91CD\u542F\u7F16\u8BD1 ' + noDir);
            process.exit(1);
            return;
        }

        this.setting = {
            dirs: dirs,
            filter: filter
        };
    }

    (0, _createClass3.default)(_class, [{
        key: 'apply',
        value: function apply(op) {

            var setting = this.setting;

            if (op.code !== null && setting.filter.test(op.file)) {
                op.output && op.output({
                    action: '变更',
                    file: op.file
                });

                var config = setting.config;
                var configs = [];

                if (config instanceof Array) {
                    configs = configs.concat(config);
                } else if (config instanceof Object && !config.find) {
                    for (var key in config) {
                        var value = config[key];
                        if (value.find) {
                            configs.push(value);
                        }
                    }
                } else if (config instanceof Object && config.find) {
                    configs.push(config);
                }

                configs.forEach(function (config) {
                    op.code = op.code.replace(config.find, config.replace);
                });
            }

            op.next();
        }
    }]);
    return _class;
}();

exports.default = _class;
