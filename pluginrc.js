const path = require('path')
const root = __dirname
const srcFolder = path.join(root, "src")
const destFolder = path.join(root, "dist")
const certPath = path.join(destFolder, "cert.p12")
module.exports = {
    extensionBundleId: 'com.unggyu.everysecond',
    extensionBundleName: 'everysecond',
    extensionBundleVersion: '1.0.1',
    cepVersion: '10.0',
    panelName: 'EverySecond',
    width: '400',
    height: '600',
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate : {
        customCert: {
            path: '',
            password: 'password'
        },
        selfSign: {
            country: 'KR',
            province: 'province',
            org: 'org',
            name: 'unggyu',
            password: 'password',
            locality: 'locality',
            orgUnit: 'orgUnit',
            email: 'cdr982116@gmail.com',
            output: certPath
        }
    }
}
