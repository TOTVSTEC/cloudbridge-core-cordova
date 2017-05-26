var path = require('path'),
	Q = null,
	shelljs = null;

module.exports.run = function run(cli, targetPath, projectData) {
	var task = new RemoveTask(cli, targetPath, projectData);

	return task.run();
};

class RemoveTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;

		shelljs = cli.require('shelljs');
		Q = cli.require('q');
	}

	run() {
		var src = path.join(this.projectDir, 'advpl', 'plugins', 'www', 'hooks');

		shelljs.rm('-rf', src);

		return Q();
	}
}
