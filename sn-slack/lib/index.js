"use strict";

require("regenerator-runtime/runtime");

var _config = _interopRequireDefault(require("./config"));

var _SlackMessage = _interopRequireDefault(require("./SlackMessage"));

var _LoggingLevels = _interopRequireDefault(require("./const/LoggingLevels"));

var _emojis = _interopRequireDefault(require("./utils/emojis"));

var _textFormatters = require("./utils/textFormatters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var loggingLevel = _config["default"].loggingLevel;

exports['default'] = function () {
  var slack = new _SlackMessage["default"]();
  return {
    reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.startTime = startTime;
                _this.testCount = testCount;

                _this.write("Running tests in: ".concat(userAgents)).newline().newline();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    reportFixtureStart: function reportFixtureStart(name) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.currentFixtureName = name;

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    reportTestDone: function reportTestDone(name, testRunInfo) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var errors, warnings, hasErrors, hasWarnings, result, title, hasErr, message;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                errors = testRunInfo.errs;
                warnings = testRunInfo.warnings;
                hasErrors = !!errors.length;
                hasWarnings = !!warnings.length;
                result = hasErrors ? 'FAIL' : 'PASS';
                name = "".concat(_this3.currentFixtureName, " - ").concat(name);
                title = "\n".concat(result, ": ").concat(name);

                _this3.write(title);

                if (hasErrors) {
                  _this3.newline().write('\nErrors:');

                  errors.forEach(function (error) {
                    _this3.newline().write("".concat(_this3.formatError(error), "\n"));
                  });
                }

                if (hasWarnings) {
                  _this3.newline().write('\nWarnings:');

                  warnings.forEach(function (warning) {
                    _this3.newline().write("".concat(warning, "\n"));
                  });
                }

                hasErr = !!testRunInfo.errs.length;

                if (!hasErr) {
                  _context3.next = 16;
                  break;
                }

                message = "".concat(_emojis["default"].fire, " ").concat((0, _textFormatters.italics)(name), " - ").concat((0, _textFormatters.bold)('failed'));

                if (!(loggingLevel === _LoggingLevels["default"].TEST)) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 16;
                return _this3.renderErrors(testRunInfo.errs);

              case 16:
                slack.addMessage(message);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    renderErrors: function renderErrors(errors) {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                errors.forEach(function (error, id) {
                  slack.addErrorMessage(_this4.formatError(error, "".concat(id + 1, " ")));
                });

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    reportTaskDone: function reportTaskDone(endTime, passed, warnings, result) {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var durationMs, durationStr, footer, message;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                durationMs = endTime - _this5.startTime;
                durationStr = _this5.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
                footer = result.failedCount ? "\n\n".concat(result.failedCount, "/").concat(_this5.testCount, " failed") : "\n\n".concat(result.passedCount, " passed");
                footer += " (Duration: ".concat(durationStr, ")");
                footer += " (Skipped: ".concat(result.skippedCount, ")");
                footer += " (Warnings: ".concat(warnings.length, ")");

                _this5.write(footer).newline();

                if (result.failedCount) {
                  message = "".concat(_emojis["default"].noEntry, " ").concat((0, _textFormatters.bold)("".concat(result.failedCount, "/").concat(_this5.testCount, " failed")));
                  slack.addMessage(message);
                  slack.sendTestReport(_this5.testCount - passed);
                }

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    }
  };
};

module.exports = exports['default'];