var path = require('path'),
	shelljs = null,
	RestoreTask = require('./restore');

module.exports.run = function run(cli, targetPath, projectData) {
	var task = new InstallTask(cli, targetPath, projectData);

	return task.run();
};

class InstallTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;

		shelljs = cli.require('shelljs');
	}

	run() {
		shelljs.cp('-Rf', path.join(__dirname, 'src'), this.projectDir);

		return RestoreTask.run(this.cli, this.projectDir, this.projectData);

		/*
		//TODO: Converter tudo para classes de tasks
		var restore = new RestoreTask(this.cli, this.projectDir, this.projectData);

		return restore.run();
		*/
	}

}
