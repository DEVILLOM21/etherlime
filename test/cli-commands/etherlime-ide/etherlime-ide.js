const assert = require('chai').assert;
const chai = require('chai')
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const runCmdHandler = require('../utils/spawn-child-process').runCmdHandler;
const killProcessByPID = require('../utils/spawn-child-process').killProcessByPID

describe.only('etherlime-ide cli command', () => {

    before(async function () {
        fs.mkdirSync('./contracts');
        fs.copyFileSync('./test/cli-commands/examples/LimeFactory.sol', './contracts/LimeFactory.sol');
    })


    it('should run etherlime ide', async function () {
        let expectedOutput = "Starting solc server"
        let childProcess = await runCmdHandler(`etherlime ide`, expectedOutput);
        assert.include(childProcess.output, expectedOutput)
        console.log("process", process)
        process.kill(childProcess.process.pid)
        // killProcessByPID(childProcess.process.pid)
        await exec(`kill $(lsof -t -i :8081)`)
    })

    it('should update ide repo if it was already cloned', async () => {
        let expectedOutput = "Run IDE"
        let childProcess = await runCmdHandler(`etherlime ide`, expectedOutput);
        assert.include(childProcess.output, expectedOutput)
        killProcessByPID(childProcess.process.pid)
    })

    // it('should run etherlime ide on specific port', async () => {
    //     let expectedOutput = "Starting solc server"
    //     let childProcess = await runCmdHandler(`etherlime ide --port=5000`, expectedOutput);
    //     assert.include(childProcess.output, expectedOutput)
    //     killProcessByPID(childProcess.process.pid)
    // })

    after(async function () {
        fs.removeSync('./contracts');
        fs.removeSync('./Solidity-IDE');
    })


})