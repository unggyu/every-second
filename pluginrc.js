const path = require('path')
const pass = require('./password.js');
const root = __dirname
const srcFolder = path.join(root, "src")
const destFolder = path.join(root, "dist")
const certPath = path.join(destFolder, "cert.p12")
module.exports = {
    extensionBundleId: 'com.unggyu.everysecond',
    extensionBundleName: 'everysecond',
    extensionBundleVersion: '1.0.0',
    cepVersion: '9.0',
    panelName: 'EverySecond',
    width: '400',
    height: '600',
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate : {
        customCert: {
            path: '',
            password: pass.password
        },
        selfSign: {
            country: 'KR',
            province: 'province',
            org: 'org',
            name: 'unggyu',
            password: pass.password,
            locality: 'locality',
            orgUnit: 'orgUnit',
            email: 'cdr982116@gmail.com',
            output: certPath
        }
    }
}
