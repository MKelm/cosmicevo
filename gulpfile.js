var gulp = require('gulp');

var fs = require('fs');

var versionJson = JSON.parse(fs.readFileSync('./version.json'));

gulp.task('default', function() {
  
    var packageJson = JSON.parse(fs.readFileSync('./package.json')),
        exec = require('child_process').exec, child;
    
    var cmd = "git rev-list --count HEAD";
    child = exec(cmd,
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
        if (stderr === "") {
            var gitRevisionData = stdout.split("\n"),
                gitRevision = parseInt(gitRevisionData[0]);
            
            // version change if package file property has been changed
            if (packageJson.version != versionJson.version) {
                versionJson.version = packageJson.version;
                versionJson.gitLastVersionRevision = gitRevision;
            }
            versionJson.gitVersionRevision = gitRevision - versionJson.gitLastVersionRevision;
            
            // build number change on every revision change
            versionJson.buildNumber = versionJson.buildNumber;
            if (gitRevision != versionJson.gitRevision) {
                versionJson.buildNumber = 0;
            }
            versionJson.buildNumber++;
            
            // finally update revision property, version string and json
            versionJson.gitRevision = gitRevision;
            versionJson.versionString = packageJson.version + "." + versionJson.gitVersionRevision + "." + versionJson.buildNumber;
            fs.writeFileSync("version.json", JSON.stringify(versionJson));

        } else {
            console.log('stderr: ' + stderr);
        }
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    
});