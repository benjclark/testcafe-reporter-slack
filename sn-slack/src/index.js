import 'regenerator-runtime/runtime';
import config from './config';
import SlackMessage from './SlackMessage';
import LoggingLevels from './const/LoggingLevels';
import emojis from './utils/emojis';
import { bold, italics } from './utils/textFormatters';

const { loggingLevel } = config;

exports['default'] = () => {
    return {
        async reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = startTime;
            this.testCount = testCount;

            this.write(`Running tests in: ${userAgents}`)
                .newline()
                .newline();
        },

        async reportFixtureStart (name) {
            this.currentFixtureName = name;
        },

        async reportTestDone (name, testRunInfo) {
            this.slack = new SlackMessage();

            const errors      = testRunInfo.errs;
            const warnings    = testRunInfo.warnings;
            const hasErrors   = !!errors.length;
            const hasWarnings = !!warnings.length;
            const result      = hasErrors ? 'FAIL' : 'PASS';

            name = `${this.currentFixtureName} - ${name}`;

            const title = `\n${result}: ${name}`;

            this.write(title);

            if (hasErrors) {
                this.newline()
                    .write('\nErrors:');

                errors.forEach(error => {
                    this.newline()
                        .write(`${this.formatError(error)}\n`);
                });
            }

            if (hasWarnings) {
                this.newline()
                    .write('\nWarnings:');

                warnings.forEach(warning => {
                    this.newline()
                        .write(`${warning}\n`);
                });
            }
            const hasErr = !!testRunInfo.errs.length;

            let message;

            if (hasErr) {
                message = `${emojis.fire} ${italics(name)} - ${bold('failed')}`;
                await this.renderErrors(testRunInfo.errs);
            }
            if (loggingLevel === LoggingLevels.TEST) this.slack.addMessage(message);
        },

        async renderErrors (errors) {
            errors.forEach((error, id) => {
                this.slack.addErrorMessage(this.formatError(error, `${id + 1} `));
            });
        },

        async reportTaskDone (endTime, passed, warnings, result) {
            this.slack = new SlackMessage();
            const durationMs  = endTime - this.startTime;
            const durationStr = this.moment
                .duration(durationMs)
                .format('h[h] mm[m] ss[s]');

            let footer = result.failedCount ?
                `\n\n${result.failedCount}/${this.testCount} failed` :
                `\n\n${result.passedCount} passed`;

            footer += ` (Duration: ${durationStr})`;
            footer += ` (Skipped: ${result.skippedCount})`;
            footer += ` (Warnings: ${warnings.length})`;

            this.write(footer)
                .newline();

            if (result.failedCount) {
                const message = `${emojis.noEntry} ${bold(`${result.failedCount}/${this.testCount} failed`)}`;

                this.slack.addMessage(message);
            }
        }
    };
};

module.exports = exports['default'];
