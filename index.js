// Config for send message api
var myapikey = '108cd50d5ed14e05ce69423bd188469f';
var mybotname = 'ashdbausdfasufbasdf';

function MessageHandler(context, event) {
    // Input from user/any other bot received by main bot
  var text = event.message;
  var msg = text.toLowerCase();
    // ChannelName
  var channelName = event.contextobj.channeltype;
  var destbotname;
  console.log('Message received by brandbot -> ' + msg);
    // Message sent by other bots or user received by main bot
  if (channelName == 'ibc') {
        // Refid of incoming message
    var refid = event.contextobj.refid;
        // Name of bot/user that message is received from
        // sender of incoming message
    var senderName = event.senderobj.channelid;
    console.log('msg:' + msg);
    var contextobj = context.simpledb.botleveldata[refid];
        // 		SendMessageToUser(context, event, contextobj, msg, function(c, e) {
        // 			delete context.simpledb.botleveldata[refid];
        // 			context.sendResponse("msg:" + msg);
        // 		});

        // message received from brandA bot
    if (senderName == 'brandA') {
            // Message received from brandA bot to be sent to user that is mapped with refid
      destbotname = context.simpledb.botleveldata[refid];
            // Deleting refid as it transaction of user query is completed
      delete (context.simpledb.botleveldata[refid]);
            // Sending message to user/initiator on ibc channel
      sendMessageToUser(context, event, destbotname, text, function () {});
      sendIBC(context, destbotname, refid, text);
    }
        // Message received from brandB bot
    else if (senderName == 'brandB') {
      destbotname = context.simpledb.botleveldata[refid];
      delete (context.simpledb.botleveldata[refid]);
      sendMessageToUser(context, event, destbotname, text, function () {});
      sendIBC(context, destbotname, refid, text);
    }
        // Message received from brandC bot
    else if (senderName == 'brandC') {
      destbotname = context.simpledb.botleveldata[refid];
      delete (context.simpledb.botleveldata[refid]);
      sendMessageToUser(context, event, destbotname, text, function () {});
      sendIBC(context, destbotname, refid, text);
    }
        // Message received from user
    else {
            // If user says hi, hello to main bot
      if (msg == 'hi' || msg == 'hey' || msg == 'hello' || msg == 'hay' || msg == 'start') {
        destbotname = senderName;
        var resp = 'I\'m a Brand Bot for my sub-brands - Brand A, B and C. You can ask me about price and availability for each of these Brands';
        sendIBC(context, destbotname, refid, resp);
      }
            // All other user messages are sent to the destination bot
      else {
        context.simpledb.botleveldata[refid] = senderName;
        destbotname = getDestinationBotName(context, event);
        context.simpledb.saveData(sendIBC(context, destbotname, refid, msg));
      }
    }
  }
    // Message received on fb channel by main bot
  else {
    destbotname = getDestinationBotName(context, event);
    refId(context, event, destbotname, msg, function (c, e) {
      console.log('got \'em->' + msg);
      console.log(e.getresp);
      context.sendResponse('msg:' + msg);
    });
  }
}

// Identify which bot to route the user query to
function getDestinationBotName(context, event) {
  var msg = event.message.toLowerCase();
  var destbotname;
  if (msg.includes('one') || msg.includes('product a') || msg.includes('brand a') || msg.includes('product 1') || msg.includes('brand 1') || msg.includes('product one') || msg.includes('brand one')) {
    destbotname = 'brandA';
  } else if (msg.includes('two') || msg.includes('product b') || msg.includes('brand b') || msg.includes('product 2') || msg.includes('brand 2') || msg.includes('product two') || msg.includes('brand two')) {
    destbotname = 'brandB';
  } else if (msg.includes('three') || msg.includes('product c') || msg.includes('brand c') || msg.includes('product 3') || msg.includes('brand 3') || msg.includes('product three') || msg.includes('brand three')) {
    destbotname = 'brandC';
  }
  return destbotname;
}

function EventHandler(context, event) {
  context.simpledb.roomleveldata = {};
  MessageHandler(context, event);
}

// Send message api used to send message to user on fb channel
function sendMessageToUser(context, event, contextobj, botsays, callback) {
  var url = 'https://api.gupshup.io/sm/api/bot/' + mybotname + '/msg';
  var header = {
    apikey: myapikey,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  var param = 'context=' + encodeURI(JSON.stringify(contextobj)) + '&message=' + encodeURIComponent(botsays) + '&botname=' + encodeURI(mybotname);
  context.simplehttp.makePost(url, param, header, callback);
}

// Send message api used to send message through ibc channel
function sendMsg(context, ctx, destbotname, msg, callback) {
  var contextParam = JSON.stringify(ctx);
  var url = 'https://ibc.gupshup.io/ibc/bot/' + mybotname + '/sendmsg';
  var param = 'context=' + contextParam + '&destbotname=' + destbotname + '&message=' + msg;
  var header = {
    apikey: myapikey,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  context.simplehttp.makePost(url, param, header, callback);
}

function sendIBC(context, botname, refid, msg, callback) {
  var bname = [
    mybotname,
    botname
  ];
  bname.sort();

  var ctx = {
    botname: mybotname,
    channeltype: 'ibc',
    contextid: bname[0] + '-' + bname[1],
    contexttype: 'p2p',
    refid: refid
  };
  sendMsg(context, ctx, botname, msg, callback);
}

// Each message on ibc channel has refid and is tracked by the refid so we need to generate a refid before sending a message to other bots
function refId(context, event, botname, msg, callback) {
  var url = 'https://api.gupshup.io/ibc/bot/' + mybotname + '/refid';
  var param = '';
  var header = {
    apikey: myapikey,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  context.simplehttp.makePost(url, param, header, function (c, e) {
    var refid = e.getresp;
    console.log('refid:' + refid);
        // Map refid with initiator of request
        // main bot will respond to the initiator after receiving response from another bot
    context.simpledb.botleveldata[refid] = event.contextobj;
    sendIBC(context, botname, refid, msg, callback);
  });
}

function HttpResponseHandler(context, event) {
  if (event.geturl === 'http://ip-api.com/json') {
    context.sendResponse('This is response from http \n' + JSON.stringify(event.getresp, null, '\t'));
  }
}

function DbGetHandler(context, event) {
  context.sendResponse('testdbput keyword was last sent by:' + JSON.stringify(event.dbval));
}

function DbPutHandler(context, event) {
  context.sendResponse('testdbput keyword was last sent by:' + JSON.stringify(event.dbval));
}

function HttpEndpointHandler(context, event) {
  context.sendResponse('This is response from http \n' + JSON.stringify(event, null, '\t'));
}

function LocationHandler(context, event) {
  context.sendResponse('Got location');
}

exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if (typeof LocationHandler === 'function') {
  exports.onLocation = LocationHandler;
}
if (typeof HttpEndpointHandler === 'function') {
  exports.onHttpEndpoint = HttpEndpointHandler;
}
