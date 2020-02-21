#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const packageJSON = require(path.join(process.cwd(), './package.json'))
const { exec } = require('child_process');

const currentVersion = packageJSON.version

program
    .option('-M, --major', 'Bump major version.')
    .option('-m, --minor', 'Bump minor version.')
    .option('-p, --patch', 'Bump patch version.')
    .parse(process.argv)
if (program.patch) {
    bump(currentVersion, 2)
} else if (program.minor) {
    bump(currentVersion, 1)
} else if (program.major) {
    bump(currentVersion, 0)
} else {
    bump(currentVersion, 2)
}

function createBuild(version) {
    exec(`zip -r builds/bixuit-text-changer.v${version}.zip dist/*`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        console.log(`\nBuild done: builds/bixuit-text-changer.v${version}.zip\n\nBye.\n`);
    });
}

function splitVersion(versionString) {
    return versionString.split('.').map(s => s * 1)
}

function newPackageJSON(version) {
    let newVersionJSON = packageJSON;
    newVersionJSON.version = version;

    fs.writeFile('package.json', JSON.stringify(newVersionJSON, null, 2), (err) => {
        if (err) throw err;
        createBuild(version);
    })
}

function bump(versionString, index) {
    let version = splitVersion(versionString);
    version[index] += 1
    if (index === 0) {
        version[1] = 0
        version[2] = 0
    } else if (index === 1) {
        version[2] = 0
    }
    newPackageJSON(version.join('.'))
}