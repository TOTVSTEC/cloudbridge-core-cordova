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
		var pluginDir = path.join(__dirname, 'plugins', 'cordova-plugin-cdvwebsocketport'),
			options = {
				cwd: this.projectDir
			};

		shelljs.cp('-Rf', path.join(__dirname, 'src'), this.projectDir);
		shelljs.cp('-Rf', path.join(__dirname, 'build'), this.projectDir);
		//shelljs.cp('-Rf', path.join(__dirname, 'plugins'), this.projectDir);

		shelljs.exec('cordova plugin add ' + pluginDir, options);
		shelljs.exec('cordova plugin save', options);

		return Q();
	}

}
