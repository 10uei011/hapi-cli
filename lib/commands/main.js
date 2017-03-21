const program = require('commander');
const pkgVersion = require('../../package.json').version;
const shell = require('shelljs');
const logUpdate = require('log-update');
const chalk = require('chalk');
const elegantSpinner = require('elegant-spinner');

const frame = elegantSpinner();

const selectedVariant = require('../../variants.json')[0];

program
    .version(pkgVersion)
    .usage('app_name')
    .description('Initialize a Hapi powered project')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}

if (program.args.length === 1) {
    if (shell.test('-d', program.args[0])) {
        console.log(chalk.red(`${program.args[0]} directory already exits! Please choose another name!!!`));
        shell.exit(1);
    }

    shell.mkdir('-p', program.args[0]);
    shell.cd(program.args[0]);
    shell.exec('git init');

    const interval = setInterval(() => {
    	logUpdate(`Fetching the boilerplate...${chalk.cyan.bold.dim(frame())}`);
	}, 50);

	shell.exec(`git pull ${selectedVariant.git} ${selectedVariant['git-branch']}`, (code) => {
        clearInterval(interval);
        logUpdate.clear();
        if (code !== 0) {
            console.log(chalk.red.bold('Error! Try again'));
            shell.exit(1);
        }
        console.log(chalk.green.bold('Completed.....You are good to go!'));
    });

}