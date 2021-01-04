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
  return {
    reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var startTimeFormatted;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.slack = new _SlackMessage["default"]();
                _this.startTime = startTime;
                _this.testCount = testCount;
                startTimeFormatted = _this.moment(_this.startTime).format('M/D/YYYY h:mm:ss a');

                _this.slack.sendMessage("".concat(_emojis["default"].rocket, " ", 'Starting TestCafe:', " ").concat((0, _textFormatters.bold)(startTimeFormatted), "\n").concat(_emojis["default"].computer, " Running ").concat((0, _textFormatters.bold)(testCount), " tests in: ").concat((0, _textFormatters.bold)(userAgents), "\n"));

              case 5:
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
                if (loggingLevel === _LoggingLevels["default"].TEST) _this2.slack.addMessage((0, _textFormatters.bold)(_this2.currentFixtureName));

              case 2:
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
        var hasErr, message;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                hasErr = !!testRunInfo.errs.length;
                message = null;

                if (!testRunInfo.skipped) {
                  _context3.next = 6;
                  break;
                }

                message = "".concat(_emojis["default"].fastForward, " ").concat((0, _textFormatters.italics)(name), " - ").concat((0, _textFormatters.bold)('skipped'));
                _context3.next = 13;
                break;

              case 6:
                if (!hasErr) {
                  _context3.next = 12;
                  break;
                }

                message = "".concat(_emojis["default"].fire, " ").concat((0, _textFormatters.italics)(name), " - ").concat((0, _textFormatters.bold)('failed'));
                _context3.next = 10;
                return _this3.renderErrors(testRunInfo.errs);

              case 10:
                _context3.next = 13;
                break;

              case 12:
                message = "".concat(_emojis["default"].checkMark, " ").concat((0, _textFormatters.italics)(name));

              case 13:
                if (loggingLevel === _LoggingLevels["default"].TEST) _this3.slack.addMessage(message);

              case 14:
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
                  _this4.slack.addErrorMessage(_this4.formatError(error, "".concat(id + 1, " ")));
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
        var endTimeFormatted, durationMs, durationFormatted, finishedStr, durationStr, summaryStr, message;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                endTimeFormatted = _this5.moment(endTime).format('M/D/YYYY h:mm:ss a');
                durationMs = endTime - _this5.startTime;
                durationFormatted = _this5.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
                finishedStr = "".concat(_emojis["default"].finishFlag, " Testing finished at ").concat((0, _textFormatters.bold)(endTimeFormatted), "\n");
                durationStr = "".concat(_emojis["default"].stopWatch, " Duration: ").concat((0, _textFormatters.bold)(durationFormatted), "\n");
                summaryStr = '';
                if (result.skippedCount) summaryStr += "".concat(_emojis["default"].fastForward, " ").concat((0, _textFormatters.bold)("".concat(result.skippedCount, " skipped")), "\n");
                if (result.failedCount) summaryStr += "".concat(_emojis["default"].noEntry, " ").concat((0, _textFormatters.bold)("".concat(result.failedCount, "/").concat(_this5.testCount, " failed")));else summaryStr += "".concat(_emojis["default"].checkMark, " ").concat((0, _textFormatters.bold)("".concat(result.passedCount, "/").concat(_this5.testCount, " passed")));
                message = "\n\n".concat(finishedStr, " ").concat(durationStr, " ").concat(summaryStr);

                _this5.slack.addMessage(message);

                _this5.slack.sendTestReport(_this5.testCount - passed);

              case 11:
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