"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("./config"));

var _LoggingLevels = _interopRequireDefault(require("./const/LoggingLevels"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SlackMessage = /*#__PURE__*/function () {
  function SlackMessage() {
    _classCallCheck(this, SlackMessage);

    var slackNode = require('slack-node');

    this.slack = new slackNode();
    this.slack.setWebhook(_config["default"].webhookUrl);
    this.loggingLevel = _config["default"].loggingLevel;
    this.messages = [];
    this.errorMessages = [];
  }

  _createClass(SlackMessage, [{
    key: "addMessage",
    value: function addMessage(message) {
      this.messages.push(message);
    }
  }, {
    key: "addErrorMessage",
    value: function addErrorMessage(message) {
      this.errorMessages.push(message);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(message) {
      var slackProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.slack.webhook(Object.assign({
        channel: _config["default"].channel,
        username: _config["default"].username,
        text: message
      }, slackProperties), function (err, response) {
        if (!_config["default"].quietMode) {
          if (err) {
            console.log('Unable to send a message to slack');
            console.log(response);
          } else {
            console.log("The following message is send to slack: \n ".concat(message));
          }
        }
      });
    }
  }, {
    key: "sendTestReport",
    value: function sendTestReport(nrFailedTests) {
      this.sendMessage(this.getTestReportMessage(), nrFailedTests > 0 && this.loggingLevel === _LoggingLevels["default"].TEST ? {
        "attachments": [{
          color: 'danger',
          text: "".concat(nrFailedTests, " test failed")
        }]
      } : null);
    }
  }, {
    key: "getTestReportMessage",
    value: function getTestReportMessage() {
      var message = this.getSlackMessage();
      var errorMessage = this.getErrorMessage();

      if (errorMessage.length > 0 && this.loggingLevel === _LoggingLevels["default"].TEST) {
        message = message + "\n\n\n```" + this.getErrorMessage() + '```';
      }

      return message;
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage() {
      return this.errorMessages.join("\n\n\n");
    }
  }, {
    key: "getSlackMessage",
    value: function getSlackMessage() {
      return this.messages.join("\n");
    }
  }]);

  return SlackMessage;
}();

exports["default"] = SlackMessage;