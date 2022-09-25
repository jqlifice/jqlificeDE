let canvas = document.getElementById("contentBoxInteractiveShell");
let canvasCTX = canvas.getContext("2d");
let canvasContainer = document.getElementById("contentBoxInteractiveShellWrapper");
let currentLine,
    canvasContent,
    shellLineHeight,
    shellOpen,
    shellCursorAtChar,
    shellCursorAtLine,
    shellBackgroundColor,
    shellTextColor,
    shellDirectoryTreeRoot,
    shellPath,
    cwd;

function folder(name, parent){
    this.parent = parent;
    this.name = name;
    this.type = "folder";
    this.items = [];
    this.fullName = function (){
        return this.name;
    };
    this.appendChild = function (child) {
        this.items.push(child);
    };
    this.path = function(){
        if(this.parent){
            return this.parent.path().concat("\\").concat(this.name);
        }else{
            return this.fullName();
        }
    };
    this.createFolder = function(name){
        let temp = new folder(name, this);
        this.appendChild(temp);
        return temp;
    };
    this.createFile = function(name, content){
        let temp = new file(name, this);
        this.appendChild(temp);
        temp.content = content;
        return temp;
    };
    this.getChild = function(name){
        let returnValue = false;
        this.items.forEach((item) => {
            if(item.fullName() === name){
                returnValue = item;
            }
        });
        return returnValue;
    };
    this.tree = function(indent){
        let line = " ";
        for (let i=0; i<indent; i++){
            line = line.concat("        ");
        }
        line = line.concat("|--");
        line = line.concat(this.fullName());
        indent++;
        canvasContent.push({text: line, isInput:false, inDir:cwd.path()});
        currentLine++;
        this.items.forEach((item) => {
            item.tree(indent);
        });
    }
}

function file(name, parent){
    name = name.split(".");
    this.parent = parent;
    this.name = name.shift();
    this.extensions = name;
    this.type = "file";
    this.content = [];
    this.fullName = function (){
        if(this.extensions[0]){
            return this.name.concat(".", this.extensions.join("."));
        }
        return this.name;
    }
    this.path = function(){
        return this.parent.path().concat("\\").concat(this.fullName());
    }
    this.tree = function(indent){
        let line = " ";
        for (let i=0; i<indent; i++){
            line = line.concat("        ");
        }
        line = line.concat("|--");
        line = line.concat(this.fullName());
        canvasContent.push({text: line, isInput:false, inDir:cwd.path()});
        currentLine++;
    }
    this.print = function(){
        this.content.forEach((line) => {
            canvasContent.push({text: line, isInput:false, inDir:cwd.path()});
            currentLine++;
        })
    }
}

loadVariableBaseValues();

function loadVariableBaseValues(){
    currentLine = 0;
    canvasContent = [];
    shellLineHeight = 20;
    shellOpen = false;
    shellCursorAtChar = 0;
    shellCursorAtLine = 0;
    shellBackgroundColor = "black";
    shellTextColor = "floralwhite";
    shellDirectoryTreeRoot = new folder("C:", null);
    cwd = shellDirectoryTreeRoot.createFolder("jqlificeDE");
    let Program = cwd.createFolder("Program");
    Program.createFile("info.txt", [
        "Ever since I got introduced to Robot Karol in school I loved coding. That small 'toy' to learn basics of object oriented Programming had my entire attention and I remember spending entire evenings just writing new procedures.",
        "This also prompted me to learn basic batch scripting when I was 13-ish (i don't recall the exact age). I used this to write small tools like a script that accidentally flooded the schools public drive. oops",
        "Next I my interest shifted more and more towards hacking/exploiting so I started fiddling around with Kali for a while. I didn't understand much of it at the time, so I was a stereotypical script kiddy I suppose :D",
        "After learning Java basics in 10th grade I started creating actual programs, the first notable one being a digital version of 'Settlers of Catan' with 2 of my friends as a school project in grade 11.",
        "My affection for programming got me into studying CS at university, which lead to me doing even more coding on the side. Some of it is public on my GitHub - link in the socials bar on the right hand side.",
        "Today I mainly write my scripts in bash, create my bots in NodeJS, and wrap the rest into web-applications, one of which you are using right now :)"
    ]);
    Program.createFile("privateProjects.txt", [
        "My 'flagship' project is this Website, I am currently transferring some of my other web-applications to this server and will integrate them into this website sooner or later.",
        "I have some smaller other projects I have not released as of now, but I am aiming to add some of my other utility to my GitHub.",
        "This Website is constant WIP, there will always be new ideas I have and want to implement, but can't due to a lack of time, some of them will come - like this CLI :)",
        "If you are interested in how this Website works: the repo of it is public."
    ]);
    cwd = Program;
}


function createShell(){
    document.defaultView.addEventListener("resize", shellResize);
    document.addEventListener("keydown", shellKeyPress);
    canvas.width = canvasContainer.getBoundingClientRect().width;
    canvas.height = canvasContainer.getBoundingClientRect().height;
    canvas.style.backgroundColor = shellBackgroundColor;
    document.getElementById("contentBoxInteractiveShellWrapper").style.backgroundColor = shellBackgroundColor;
    shellOpen = true;
    canvasContent.push({text:"", isInput:true, inDir:cwd.path()});
    reloadShell(0);
}

function reloadShell(line){
    canvasCTX.font = (shellLineHeight-2).toString().concat("px cmdFont");
    canvasCTX.fillStyle = shellTextColor;
    let printLines = [];
    canvasCTX.clearRect(0, 0, canvas.width, canvas.height);
    if(line === undefined) line = currentLine;
    let from = 0;
    let space = Math.trunc(canvas.height/shellLineHeight)-1;
    if(canvasContent.length>space){
        from = line-space;
    }
    canvasContent.forEach((obj, key) =>{
        if(obj.text.length > canvas.width/shellLineHeight){
            let lineChars = Math.floor(canvas.width/(shellLineHeight*0.38));
            let chunks = obj.text.chunk(lineChars);
            chunks.forEach((chunk) => {
                printLines.push({text: chunk, isInput: false, inDir: null})
            });
        }else if(key >= from && key<=line){
            printLines.push(obj);
        }
    });
    if(printLines.length>space) printLines.splice(0, printLines.length-space);
    printLines.forEach((line, lineKey) => {
        printLineAt((lineKey+1)*shellLineHeight, line.text, line.isInput, line.inDir)
    })
}

function printLineAt(height, text, isInput, inDir){
    if(!isInput){
        text = "    ".concat(text);
    }else{
        text = inDir.concat(">", text);
    }
    canvasCTX.fillText(text, 0, height);
}

function destroyShell(){
    loadVariableBaseValues();
    document.defaultView.removeEventListener("resize", shellResize);
    document.removeEventListener("keydown", shellKeyPress);
}

function exec(commandIn){
    let commandSplit = commandIn.split(" ");
    let command = commandSplit[0];
    let args = commandSplit.slice(1, commandSplit.length);
    switch(command.toLowerCase()){
        case "cd": shellCD(args[0]); break;
        case "cd..": shellCD(".."); break;
        case "cls": shellCLS(); break;
        case "color": shellColor(args[0]); break;
        case "dir": shellDIR(); break;
        case "exit": document.getElementById("contentBoxClose").click(); break;
        case "help": shellHelp(args[0]); break;
        case "mkdir": case "md": shellMkdir(args[0]); break;
        case "print": shellPrint(args[0]); break;
        case "cmd": case "reset": loadVariableBaseValues(); shellCLS(); break;
        case "tree": cwd.tree(0); break;
        default: canvasContent.push({text:command.concat(" is not a valid command. try 'help' for more information."), isInput:false, inDir:cwd.path()}); currentLine++; break;
    }
    canvasContent.push({text:"", isInput:true, inDir:cwd.path()});
    currentLine++;
    reloadShell();
}

function shellKeyPress(event){
    if(document.activeElement === document.querySelector("body")){
        if(event.key=="Enter"){
            exec(canvasContent[currentLine].text);
        }else if(event.key.length==1){
            canvasContent[currentLine].text = canvasContent[currentLine].text.concat(event.key);
            reloadShell();
        }else if(event.key=="Backspace"){
            canvasContent[currentLine].text = canvasContent[currentLine].text.slice(0, -1);
            reloadShell();
        }
    }
}

function shellResize(){
    canvas.width = Math.floor(canvasContainer.getBoundingClientRect().width);
    canvas.height = Math.floor(canvasContainer.getBoundingClientRect().height);
    reloadShell();
}



//shell commands
function shellCD(args){
    let tmp = args.split("\\");
    tmp.forEach((key) => {
        let child = cwd.getChild(key);
        if(key === "..") child = cwd.parent;
        if(!child){
            canvasContent.push({text: "folder does not exist", isInput:false, inDir:cwd.path()});
            currentLine++;
            return false;
        }else{
            cwd = child;
        }
    });
}

function shellCLS(){
    currentLine = -1; //as the currentLine is incremented in the exec function it needs to be set to -1 here, otherwise the next line is out of array bounds
    canvasContent = [];
}

function shellColor(args){
    if(args === undefined) args="";
    let colorArray = [];
    if(args.length == 2){
        for(let i=0; i<args.length; i++){
            switch(args.charAt(i).toLowerCase()){
                case '0': colorArray[i]="black"; break;
                case '1': colorArray[i]="blue"; break;
                case '2': colorArray[i]="green"; break;
                case '3': colorArray[i]="aquamarine"; break;
                case '4': colorArray[i]="darkred"; break;
                case '5': colorArray[i]="purple"; break;
                case '6': colorArray[i]="yellow"; break;
                case '7': colorArray[i]="floralwhite"; break;
                case '8': colorArray[i]="grey"; break;
                case '9': colorArray[i]="lightblue"; break;
                case 'a': colorArray[i]="lightgreen"; break;
                case 'b': colorArray[i]="aqua"; break;
                case 'c': colorArray[i]="red"; break;
                case 'd': colorArray[i]="mediumpurple"; break;
                case 'e': colorArray[i]="yellow"; break;
                case 'f': colorArray[i]="white"; break;
            }
        }
    }else if(args.length == 0){
        colorArray = ['black', 'floralwhite'];
    }else{
        canvasContent.push({text: "COLOR [arg]", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    arg    specifies the colors of the console", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "Console colors are a pair of 2 hex digits", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    the first one affecting the background", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    the second one affecting the text color", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    0 = black    8 = grey", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    1 = blue     9 = light blue", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    2 = green    A = light green", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    3 = aqua     B = light aqua", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    4 = red      C = light red", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    5 = purple   D = light purple", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    6 = yellow   E = light yellow", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "    7 = white    F = bright white", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "Example: 'color 05' produces purple text on a black background", isInput:false, inDir:cwd.path()});
        canvasContent.push({text: "Note: no specified arg resets the layout to black background with white text", isInput:false, inDir:cwd.path()});
        currentLine = currentLine+17;
    }

    if(colorArray[0] != colorArray[1]){
        shellBackgroundColor = colorArray[0];
        shellTextColor = colorArray[1];
        canvas.style.backgroundColor = shellBackgroundColor;
        document.getElementById("contentBoxInteractiveShellWrapper").style.backgroundColor = shellBackgroundColor;
    }
}

function shellDIR(){
    let folderCounter = 0;
    let fileCounter = 0;
    cwd.items.forEach((item) => {
        if(item.type === "folder"){
            canvasContent.push({text:"[DIR]  ".concat(item.fullName()), isInput:false, inDir:cwd.path()});
            folderCounter++;
        }
        if(item.type === "file"){
            canvasContent.push({text:"[FILE] ".concat(item.fullName()), isInput:false, inDir:cwd.path()});
            fileCounter++;
        }
        currentLine++;
    });
    canvasContent.push({text:fileCounter.toString().concat(" File(s)"), isInput:false, inDir:cwd.path()});
    canvasContent.push({text:folderCounter.toString().concat(" Dir(s)"), isInput:false, inDir:cwd.path()});
    currentLine = currentLine+2;
}

function shellHelp(){
    canvasContent.push({text:"list of available commands:", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    CD - Changes the current working directory. Syntax: CD [target directory]", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    CLS - Clears the history of the CLI. Syntax: CLS", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    COLOR - Clears the colors of the CLI. Syntax: COLOR [colors]", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    DIR - Displays contents of cwd. Syntax: DIR", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    EXIT - Exits the current CLI. Syntax: EXIT", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    HELP - prints this page. Syntax: HELP", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    MKDIR - Creates a new folder with the specified name. Syntax: MKDIR [name]", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    PRINT - Prints file contents to the CLI. Syntax: PRINT [file]", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    RESET - resets the CLI (basically equivalent to reloading). Syntax: RESET", isInput:false, inDir:cwd.path()});
    canvasContent.push({text:"    TREE - prints the filesystem structure below CWD. Syntax: TREE", isInput:false, inDir:cwd.path()});
    currentLine = currentLine+11;
}

function shellMkdir(name){
    let cwdBackup = cwd;
    let tmp = name.split("\\");
    tmp.forEach((name, key) => {
        if(key<tmp.length-1){
            let child = cwd.getChild(key);
            if(name === "..") child = cwd.parent;
            if(!child){
                canvasContent.push({text: "folder does not exist", isInput:false, inDir:cwd.path()});
                currentLine++;
                cwd = cwdBackup;
                return false;
            }else{
                cwd = child;
            }
        }else{
            if(cwd.getChild(name)){
                canvasContent.push({text: "folder already exists", isInput:false, inDir:cwd.path()});
                currentLine++;
            }else{
                cwd.createFolder(name);
                canvasContent.push({text: "folder created", isInput:false, inDir:cwd.path()});
                currentLine++;
            }
            cwd = cwdBackup;
        }
    });
}

function shellPrint(file){
    let cwdBackup = cwd;
    let tmp = file.split("\\");
    let print = false;
    tmp.forEach((name, key) => {
        if(key<tmp.length-1){
            let child = cwd.getChild(key);
            if(name === "..") child = cwd.parent;
            if(child){
                cwd = child;
            }
        }else{
            let fileItem = cwd.getChild(name);
            if(fileItem && fileItem.type === "file"){
                fileItem.print();
                print = true;
            }
        }
    });
    if(!print){
        canvasContent.push({text: "file does not exist", isInput:false, inDir:cwd.path()});
        currentLine++;
    }
    cwd = cwdBackup;
}





//other util
String.prototype.chunk = function(size) {
    return [].concat.apply([],
        this.split('').map(function(x,i){ return i%size ? [] : this.slice(i,i+size) }, this)
    )
}