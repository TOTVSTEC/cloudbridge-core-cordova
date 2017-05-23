var RemoveTask = require('./remove'),
	InstallTask = require('./install');

module.exports.run = function run(cli, targetPath, projectData) {
	var task = new UpdateTask(cli, targetPath, projectData);

	return task.run();
};

class UpdateTask {

	constructor(cli, targetPath, projectData) {
		this.cli = cli;
		this.projectDir = targetPath;
		this.projectData = projectData;
	}

	run() {
		var _this = this;

		return RemoveTask.run(this.cli, this.projectDir, this.projectData)
			.then(function() {
				return InstallTask.run(_this.cli, _this.projectDir, _this.projectData);
			});

		/*
		//TODO: Converter tudo para classes de tasks
		var remove = new RemoveTask(this.cli, this.projectDir, this.projectData),
			install = new InstallTask(this.cli, this.projectDir, this.projectData);

		return remove.run()
			.then(function() {
				return install.run();
			});
		*/
	}
}

