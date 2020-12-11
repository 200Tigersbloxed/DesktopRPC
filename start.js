const activeWin = require('active-win');
const DiscordRPC = require('discord-rpc');
const fs = require("fs");
var configunparse = fs.readFileSync("config.json");
var config = JSON.parse(configunparse)

const clientId = '756568264813051965';
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

var apptitle = "";
var appdesc = "";
var currentapp = "";
var appimage = "unknown";

var debugmode = config.debugmode
var isPrivateMode = config.privatemode

function getOperatingSystem(){
    var opsys = process.platform;
    if (opsys == "darwin") {
        opsys = "MacOS";
    } 
    else if (opsys == "win32" || opsys == "win64") {
        opsys = "Windows";
    } 
    else if (opsys == "linux") {
        opsys = "Linux";
    }
    else{
        opsys = "unknown";
    }
    return opsys
}

function privateString(inputDesc){
    if(config.privatemode){
        return 'Private Mode'
    }
    return inputDesc
}

function checkPassthrough(appname){
    for(var k in config.passthrough){
        if(config.passthrough[k] == appname){
            return true
        }
    }
    return false
}

async function getAppInfo(currentappSC){
    //debug
    if(debugmode){
        console.log(await activeWin())
        console.log(currentappSC);
    }

    // apptitle, appimage, appdesc
    var appinfo = ['unknown', 'unknown', 'unknown']
    var apptitleSC = (await activeWin()).title

    switch(currentappSC){
        // editing applications
        case "WINWORD.EXE":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Word', 'word', 'Editing ' + appdescSC]
            break 
        case "POWERPNT.EXE":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['PowerPoint', 'powerpoint', 'Editing ' + appdescSC]
            break 
        case "EXCEL.EXE":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Excel', 'excel', 'Editing ' + appdescSC]
            break 
        case "MSACCESS.EXE":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Access', 'access', 'Editing ' + appdescSC]
            break 
        case "Photoshop.exe":
            var appdescSC = (await apptitleSC.split('@')[0])
            appinfo = ['Photoshop', 'photoshop', 'Editing ' + appdescSC]
            break 
        case "Illustrator.exe":
            var appdescSC = (await apptitleSC.split('@')[0])
            appinfo = ['Illustrator', 'illustrator', 'Editing ' + appdescSC]
            break 
        case "Adobe Premiere Pro.exe":
            var appdescSC = (await apptitleSC.split('-')[1])
            appinfo = ['Premiere Pro', 'premierepro', 'Editing ' + appdescSC]
            break 
        case "AfterFX.exe":
            var appdescSC = (await apptitleSC.split('-')[1])
            appinfo = ['After Effects', 'aftereffects', 'Editing ' + appdescSC]
            break 
        case "Adobe Audition.exe":
            appinfo = ['Audition', 'audition', 'Editing...']
            break 
        // chatting applications
        case "Discord.exe":
            var appdescSC = (await apptitleSC.split('-'))
            var discappdescSC = "";
            for(var keydisc in appdescSC){
                if(keydisc != appdescSC.length - 1){
                    discappdescSC = discappdescSC + appdescSC[keydisc] + "-"
                }
            }
            discappdescSC = discappdescSC.substring(0, discappdescSC.length - 2)
            appinfo = ['Discord', 'discord', 'Chatting in/with ' + discappdescSC]
            break 
        // browsers
        case "brave.exe":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Brave', 'brave', 'Browsing ' + appdescSC]
            break 
        case "chrome.exe":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Chrome', 'chrome', 'Browsing ' + appdescSC]
            break
        case "msedge.exe":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['Edge', 'msedge', 'Browsing ' + appdescSC]
            break
        case "firefox.exe":
            var appdescSC = (await apptitleSC.split('-')[0])
            appinfo = ['FireFox', 'firefox', 'Browsing ' + appdescSC]
            break
        case "safari.app":
            appinfo = ['Safari', 'safari', 'Browsing...']
            break
    }
    // custom apps
    if(config.customclientid != ""){
        for(var key in config.customapps){
            if(config.customapps[key].app == currentappSC){
                var targetconf = config.customapps[key]
                appinfo = [targetconf.apptitle, targetconf.largeimagename, targetconf.appdesc]
            }
        }
    }
    return appinfo;
}

async function setActivity() {
    var previousCURRENTAPP = currentapp;
    var previousDESC = appdesc;
    currentapp = (await activeWin()).owner.name
    var appIsNotPassThrough = checkPassthrough(currentapp)
    if(!appIsNotPassThrough){
        if(apptitle !== (await activeWin()).title){
            var appinfo = (await getAppInfo(currentapp))

            if(debugmode){
                console.log(appinfo[0] + " " + appinfo[1] + " " + appinfo[2])
            }

            apptitle = appinfo[0]
            appimage = appinfo[1]
            appdesc = appinfo[2]

            if(!isPrivateMode){
                if(appimage !== "unknown"){
                    if(appdesc != previousDESC){
                        var epoch = Date.now();
                        rpc.setActivity({
                            details: apptitle,
                            state: privateString(appdesc),
                            largeImageKey: appimage,
                            largeImageText: privateString(currentapp),
                            smallImageKey: getOperatingSystem().toLowerCase(),
                            smallImageText: getOperatingSystem(),
                            startTimestamp: epoch,
                            instance: false,
                        });
                    }
                }
                else{
                    if(currentapp != previousCURRENTAPP){
                        var epoch = Date.now();
                        rpc.setActivity({
                            details: privateString(currentapp),
                            state: "App not Supported",
                            largeImageKey: 'desktop',
                            largeImageText: 'Unsupported App',
                            smallImageKey: getOperatingSystem().toLowerCase(),
                            smallImageText: getOperatingSystem(),
                            startTimestamp: epoch,
                            instance: false,
                        });
                    }
                }
            }
            else{
                if(appimage != "unknown"){
                    if(currentapp != previousCURRENTAPP){
                        var epoch = Date.now();
                        rpc.setActivity({
                            details: apptitle,
                            state: privateString(appdesc),
                            largeImageKey: appimage,
                            largeImageText: privateString(currentapp),
                            smallImageKey: getOperatingSystem().toLowerCase(),
                            smallImageText: getOperatingSystem(),
                            startTimestamp: epoch,
                            instance: false,
                        });
                    }
                }
                else{
                    if(currentapp != previousCURRENTAPP){
                        var epoch = Date.now();
                        rpc.setActivity({
                            details: privateString(currentapp),
                            state: "App not Supported",
                            largeImageKey: 'desktop',
                            largeImageText: 'Unsupported App',
                            smallImageKey: getOperatingSystem().toLowerCase(),
                            smallImageText: getOperatingSystem(),
                            startTimestamp: epoch,
                            instance: false,
                        });
                    }
                }
            }
        }
    }
    else{
        rpc.clearActivity()
    }
}

rpc.on('ready', () => {
    setActivity();
  
    // activity can only be set every 15 seconds
    setInterval(() => {
      setActivity();
    }, 15e3);
  });

rpc.login({ clientId }).catch(console.error);