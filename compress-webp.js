const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const yargs = require('yargs');

const argv = yargs
	.usage('Usage: $0 --g [game-name]')
	.option('game', {
		alias: 'g',
		describe: 'the games name',
		type: 'string',
		demandOption: false,
	})
	.option('quality', {
		alias: 'q',
		describe: 'Compression quality',
		type: 'number',
		demandOption: false,
	})
	.help('h')
	.alias('h', 'help')
	.argv;

const directoryPath = path.resolve(`/Users/louisraetz/dev/SLAY/pengu-games/${argv.game}/game-files/images`);
const outputPath = directoryPath

fs.readdir(directoryPath, (err, files) => {
	if (err) {
		console.error("Could not list the directory.", err);
		process.exit(1);
	}

	files.forEach(file => {
		if (path.extname(file) === '.webp') {
			const inputFilePath = path.join(directoryPath, file);
			const outputFilePath = path.join(outputPath, file);

			sharp(inputFilePath)
				.webp({ quality: argv.quality ? argv.quality : 85 })
				.toBuffer()
				.then(data => {
					fs.writeFile(outputFilePath, data, err => {
						if (err) {
							console.error(`Error writing compressed file ${file}`, err);
						} else {
							console.log(`${file} has been compressed and saved at ${outputFilePath}`);
						}
					});
				})
				.catch(err => {
					console.error(`Error processing ${file}`, err);
				});
		}
	});
});
