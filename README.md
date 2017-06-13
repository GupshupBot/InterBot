Creating Bots for InterBot
===================

In this document, we will go through a sample InterBot use case and help you get started with building a bot for InterBot.

----------

#### <i class="icon-file"></i> **Use case: Brand Bot** 
Let’s assume company X has one customer facing bot. This is the X's brand bot. Now, X has multiple sub-bots (bot a, bot b, bot c) across other domains and geography's, that perform specific functions. As X markets & advertises only the brand bot, customers from all over the world engage with it. Now, what if the brand bot didn't have an answer to a customer query but one of the sub-bot’s do? For e.g., it could be about the price of a product that's available only in certain countries. Now based on the query, if the brand bot could route the query to the sub-bot and fetch the response for the customer, this would help the brand bot answer the query.

This is where InterBot comes in. InterBot makes it easy for a bot to call another bot and fetch the response, with very little coding effort from developers.  We’ve created a demo for you to understand and see this bot in action. Goto https://www.interbot.cc/consume and click on the Brand Bot in the Bot list. For the demo, the brand bot will give you the price and availability of products for each sub-brand.

Some sample queries you can ask are

 - "What's the price for product a?"
 - "Is product b available?"
 - "How much does product c cost?"
     
---------------------------------------------------------------
#### <i class="icon-upload"></i> **Build your own Brand bot**

To get you started, we've created a Brand Bot that talks to these 3 other sub-bots. Follow the instructions to view the bot code and test the bot.

Pre-requisites:
1. Node version 6.x
2. npm
3. Account on https://www.interbot.cc

To make this quick and easy, you have to install yeoman, which installs the scaffolding for the bot. Follow the steps in your command line:

    > npm install yo -g
    > npm install generator-gupshup-ibc-bot -g
    > yo gupshup-ibc-bot

This will now install the bot in your directory. Now, you will be asked some basic questions

    > what is your name?
    > what is your api key? 
    > name of your bot?
    > description of your bot (optional)?
    > what is your email id?

- To get your API key, click on your profile pic on the top right on interbot.cc -> https://www.interbot.cc

Once the installation is complete, you can now test the bot. Goto Mybots section on Interbot -> https://www.interbot.cc/mybots, click on your bot to chat with it. Use the sample queries listed above.   

The entry point for the bot is index.js. View the index.js file to make any changes to your Bot.
To understand how the Bot code executes, please view the documentation here -> https://www.gupshup.io/developer/docs/bot-platform/guide/intro-to-gupshup-bot-builder

**Happy Bot building!**
