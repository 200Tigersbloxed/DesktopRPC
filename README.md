# DesktopRPC
Discord Rich Presence for your whole PC

> ## Setup
Windows, Mac, and Linux are supported

### Perquisites
+ [NodeJS](https://nodejs.org/en/)

### npm Packages
+ [active-win](https://www.npmjs.com/package/active-win)
+ [discord-rpc](https://www.npmjs.com/package/discord-rpc)
+ fs

### Step 1
Get the latest release from [here](https://github.com/200Tigersbloxed/DesktopRPC/releases/latest).
Extract the compressed file anywhere

### Step 2
Run start.js with node
(You can also run start.bat)

> ## Config
Here's how the Config works

`debugmode (bool)` - Outputs debug in the console

`privatemode (bool)` - Hides description for apps

`customclientid (string)` - Discord Application Client ID

`customapps (object)` - JSON Object for all custom apps

What a custom app object looks like

> NOTICE: A Custom ID MUST be used for customapps to work!

```json
"coolapp1":{
    "app": "",
    "apptitle": "",
    "appdesc": "",
    "largeimagename": ""
}
```

and what the custom app object values mean

`app (string)` - EXACT name of the executable
`apptitle (string)` - Title of the App
`appdesc (string)` - Description for the App
`largeimagename (string)` - Name of the Rich Presence Asset

> ## Troubleshooting
Well, this is awkward :/

### Package is missing
Run `getpackage.bat`, and then you should be able to run start.js

### An error was returned
Report it on the [issues page](https://github.com/200Tigersbloxed/DesktopRPC/issues).
(Please check for same issue before submitting)
