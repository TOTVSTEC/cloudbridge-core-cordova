var path = require('path'),
	Q = null,
	shelljs = null;

module.exports.run = function run(cli, targetPath, projectData) {
	var task = new RestoreTask(cli, targetPath, projectData);

	return task.run();
};

class RestoreTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;

		Q = cli.require('q');
		shelljs = cli.require('shelljs');
	}

	run() {
		shelljs.cp('-Rf', path.join(__dirname, 'build'), this.projectDir);

		return Q();
	}

}
