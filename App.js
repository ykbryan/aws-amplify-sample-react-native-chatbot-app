import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import Amplify, { Analytics, Interactions } from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

const botName = "BookTrip"
const botUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_960_720.png',
};
let chatId = 1;

export default class App extends React.Component {
  state = {
    messages: [
      {
        _id: chatId,
        text: "Hello developer, this is a BookTrip Lex Chatbot. Try \"I want to reserve a hotel for tonight\"",
        user: botUser,
        createdAt: new Date(),
      }
    ]
  };

  componentDidMount() {
    Analytics.record('componentDidMount')
  }

  sendMessageToBot = async (userInput) => {
    // Provide a bot name and user input
    const response = await Interactions.send(botName, userInput);

    // Log chatbot response
    this.appendChatMessages([this.formatMessage(response.message)])
    Analytics.record('sendMessageToBot')
  }

  formatMessage = (message) => {
    chatId = chatId + 1;
    return {
      _id: chatId,
      createdAt: new Date(),
      text: message,
      user: botUser
    }
  }

  onSend = (messages) => {
    console.log(messages)
    messages.map(msg => this.sendMessageToBot(msg.text))
    this.appendChatMessages(messages)
  }

  appendChatMessages = (messages) => {
    console.log(messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    // Try "I want to reserve a hotel for tonight"
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
