const assert = require('chai').assert;
let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const fs = require('fs-extra');
const init = require('../../../cli-commands/init/init');

const contractsDir = './contracts';
const contractFileDestination = `${contractsDir}/LimeFactory.sol`;
const contractError = "LimeFactory.sol already exists in ./contracts directory. You've probably already initialized etherlime for this project."

const deploymentDir = './deployment';
const deploymentFileDestination = `${deploymentDir}/deploy.js`;
const deploymentError = "deploy.js already exists in ./deployment directory. You've probably already initialized etherlime for this project."

const testDir = './test';
const testFileDestination = `${testDir}/exampleTest.js`;
const testError = "example.js already exists in ./test directory. You've probably already initialized etherlime for this project."

const packageJsonDestination = './package.json';
const gitignoreFileDestination = './.gitignore';


describe('Init cli command', () => {
    let currentDir;

    before( async function() {
        currentDir = process.cwd();
        process.chdir('/tmp');
    });

    it('should execute init without parameters', async() => {
        await assert.isFulfilled(init.run(), 'It is successfully executed');
    })

    it('should have contracts folder and example file', async() => {
        let dirExists = fs.existsSync(contractsDir);
        assert.isTrue(dirExists, "The 'contracts' folder should exist.");

        let fileExists = fs.existsSync(contractFileDestination)
        assert.isTrue(fileExists, "The 'contract example file' should be copied in deployment folder")
    });

    it('should have test folder and example file', async() => {
        let dirExists = fs.existsSync(testDir);
        assert.isTrue(dirExists, "The 'contracts' folder should exist.");

        let fileExists = fs.existsSync(testFileDestination);
        assert.isTrue(fileExists, "The 'test example file' should be copied in deployment folder")
    });

    it('should have deployment folder and example file', async () => {
        let dirExists = fs.existsSync(deploymentDir);
        let fileExists = fs.existsSync(deploymentFileDestination);

        assert.isTrue(dirExists, "The 'deployment' folder should exist.");
        assert.isTrue(fileExists, "The 'deployment example file' should be copied in deployment folder");
    });

    it('should throw error if contract example file already exists', async () => {
        await assert.isRejected(init.run(), contractError, "Expected throw not received");
    });

    it('should throw error if deployment example file already exists', async () => {
        fs.removeSync(contractsDir);
        await assert.isRejected(init.run(), deploymentError, "Expected throw not received");
    });

    it('should throw error if test example file already exists', async () => {
        fs.removeSync(contractsDir);
        fs.removeSync(deploymentDir);
        await assert.isRejected(init.run(), testError, "Expected throw not received");
    });
    
    it('should have .gitignore file', async () => {
        let gitignoreFile = fs.existsSync(gitignoreFileDestination);
        assert.isTrue(gitignoreFile, "The 'gitignoreFile' file should exist.");
    });

    it('should not override .gitignore file if it was already created', async () => {
        fs.removeSync(deploymentDir);
        fs.removeSync(testDir);
        fs.removeSync(contractsDir);
        fs.removeSync('./.gitignore');
        fs.writeFileSync('.gitignore', "myCustomFile");
        await init.run();
        let file = fs.readFileSync('.gitignore', "utf8");
        assert.notInclude('build')
    });

    after(async function() {
        fs.removeSync(deploymentDir);
        fs.removeSync(testDir);
        fs.removeSync(contractsDir);
        fs.removeSync(packageJsonDestination);
        fs.removeSync('./package-lock.json');
        fs.removeSync('./node_modules');
        fs.removeSync('./.gitignore');
        process.chdir(currentDir);
    });

});

