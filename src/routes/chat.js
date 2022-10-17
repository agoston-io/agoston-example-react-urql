import {useState} from 'react';
import { useQuery, useMutation, useSubscription } from 'urql';
import { gql } from '@urql/core';

const ChatMessagesFragment = gql`
  fragment MessageNode on ChatMessage {
    id
    createdTs
    userId
    message
  }
`;

const ChatMessages = gql`
  query chatMessages($chatId: Int!) {
    chatMessages(condition: {chatId: $chatId}, orderBy: ID_DESC, first: 25) {
      nodes {
        ...MessageNode
      }
    }
  }
  ${ChatMessagesFragment}
`;

const NewChatMessages = gql`
  subscription chatMessages($chatId: Int!, $topic: String!) {
    listen(topic: $topic) {
      query {
        chatMessages(condition: {chatId: $chatId}, orderBy: ID_DESC, first: 25) {
          nodes {
            ...MessageNode
          }
        }
      }
    }
  }
  ${ChatMessagesFragment}
`;

const CreateChatMessage = gql`
  mutation createChatMessage($chatId: Int!, $message: String!) {
    createChatMessage(
      input: {chatMessage: {chatId: $chatId, message: $message}}
    ) {
      clientMutationId
    }
  }
`;

function ChatBoxInput() {

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const [, createChatMessage] = useMutation(CreateChatMessage);

  const submitMessage = (event) => {

    if (event.key === 'Enter') {
      setNotification('executing mutation and waiting for result from endpoint...');

      // We send the new message to the endpoint using a Mutation
      // to our trigger notification that will let us know when new messages are inserted
      var variables = { chatId: 1, message: document.getElementById("chat-input").value };

      if (document.getElementById("chat-input").value.length>0){
        setIsLoading(loading => !loading);
        createChatMessage(variables).then(result => {
          if (result.error) {
            setNotification(result.error.toString())
            setIsLoading(loading => !loading);
          }else{
            document.getElementById("chat-input").value = '';
            setIsLoading(loading => !loading);
            setNotification('')
          }
        });
    }
    }
  }

  return (
    <div >
      <div className="input">
          Yield something great! 👉 <input id="chat-input" type="text" onKeyDown={submitMessage}></input>
      </div>
      <div className={isLoading ? 'loader' : 'loader d-none'}></div>
      <div className="loading-message">{notification}</div>
      <div className="reset"></div>
    </div>
  );
};

function ChatBoxMessages() {

  const chatId = 1;

  // We do a first initial query to load our chat data
  const [resultQuery] = useQuery({
    query: ChatMessages,
    variables: { chatId },
  });

  // We create a subscription using the urql hook to start listening
  // to our trigger notification that will let us know when new messages are inserted
  const [resultSubscription] = useSubscription({ query: NewChatMessages, variables: { chatId, topic: `chat_messages:chat_id:${chatId}` } });

  if (resultQuery.fetching) return <p>Loading...</p>;
  if (resultQuery.error) return <p>Oh no... {resultQuery.error.message}</p>;

  var messages = []
  if (!resultSubscription.data){
    messages = resultQuery.data.chatMessages.nodes;
  }else{
    messages = resultSubscription.data.listen.query.chatMessages.nodes;
  }

  return (
    <div className="messages">
      {messages.map(message => (
        <div key={message.id}>
          <p className="message-line"> ⏱ {message.createdTs.substring(0,19).replace("T", " ")} <span className='user-id'>👤 {message.userId===0?'anonymous':`User ${message.userId}`}</span> <span className="message">🗣 {message.message}</span></p>
        </div>
      ))}
    </div>
  );
};


const Chat = () => {
    return (
      <div className="chatbox">
        <ChatBoxInput />
        <ChatBoxMessages />
      </div>
    );
}

export default Chat
