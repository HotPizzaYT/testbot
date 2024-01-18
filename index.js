const usr = "TestBot";
const clr = "#808080";
const getMsg = async function(room){
    const response = await fetch("http://3dstownsquare.com/chat/fmsg.php?room=blue");
    const jsona = await response.json();
    botMain(jsona, room);
};
const sendMessage = async function(username, color, message, room){
    await fetch("http://3dstownsquare.com/chat/send.php", {
        "credentials": "include",
        "headers": {
            "User-Agent": "TestBot v1.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "referrer": "http://3dstownsquare.com/chat/room.php?r=blue",
        "body": `nick=${encodeURIComponent(username)}&color=${encodeURIComponent(color)}&msg=${encodeURIComponent(message)}&room=${encodeURIComponent(room)}`,
        "method": "POST",
        "mode": "cors"
    });
}
const botMain = function(jsona, room){
    const cont = jsona["content"];
    const color = jsona["color"];
    const time = jsona["time"];
    const usernme = jsona["username"];
    if(cont.startsWith("?")){
        if(usernme !== usr){
            sendMessage(usr, clr, "Test (written in NodeJS)", room);
        }
        
    }

}
setInterval(function(){ getMsg("blue"); getMsg("green"); }, 1000);