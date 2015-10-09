var gulp = require('gulp');

var fs = require('fs');

var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var versionJson = JSON.parse(fs.readFileSync('./version.json'));

var versionString = "";

gulp.task('default', function() {
  
    var exec = require('child_process').exec, child;
    
    var cmd = "git rev-list --count HEAD && git describe --always";
    child = exec(cmd,
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
        if (stderr === "") {
            var gitRevisionData = stdout.split("\n");
            
            var gitRevisionString = gitRevisionData[0] + " (" + gitRevisionData[1] + ")";
            console.log("git-revision: " + gitRevisionString);
            
            versionJson.buildNumber = parseInt(versionJson.buildNumber);
            if (gitRevisionString != versionJson.gitRevisionString) {
                versionJson.buildNumber = 0;
            }
            versionJson.buildNumber++;

            
            versionString = packageJson.version + "." + gitRevisionData[0] + "." + versionJson.buildNumber;
            console.log("version: "  + versionString);
            
            versionJson.versionString = versionString;
            versionJson.gitRevisionString = gitRevisionString;
            fs.writeFileSync("version.json", JSON.stringify(versionJson));
            
        } else {
            console.log('stderr: ' + stderr);
        }
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
    
});