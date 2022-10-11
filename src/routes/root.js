import { useQuery } from 'urql';
import Chat from "./chat";
import {
    AGOSTON_URL,
    AGOSTON_GRAPHIQL_URL,
    AGOSTON_CHAT_GITHUB_URL,
    AGOSTON_AUTH_GOOGLE,
    AGOSTON_AUTH_LOGOUT
} from '../config';

// Graphql query that works by default on Agoston's backend.
// This will tell us if the server has recognized the cookie
// and authenticated the user. We also get the user role and user id.
const AgostonSessionData = `query agostonSessionData {
    isSessionAuthenticated
    getCurrentRole
    getCurrentUserId
}`

function RootWithSessionData() {

    // Execute the query
    const [resultQuery] = useQuery({
      query: AgostonSessionData
    });

    if (resultQuery.fetching) return <p>Loading...</p>;
    if (resultQuery.error) return (
          <div>
            <p>☠ App fails to load | ❌ {resultQuery.error.message}</p>
          </div>
          );

    var sessionData = resultQuery.data;

    return (
        <div >
            <p className='banner'>------------------------------------------------------------------------------------------</p>
            <p className='banner'>🔥 Raw chat using GraphQL query, mutation, and subscription via React and the urql client.</p>
            <p className='banner'>🔥 Free backend from <a href={AGOSTON_URL} target='_blank' rel="noreferrer">agoston.io</a>.</p>
            <p className='banner'>🔥 Project hosted on GitHub <a href={AGOSTON_CHAT_GITHUB_URL} target='_blank' rel="noreferrer">on GitHub</a>.</p>
            <p className='banner'>🔥 Try the Graphql requests <a href={AGOSTON_GRAPHIQL_URL} target='_blank' rel="noreferrer">here</a>.</p>
            <p className={sessionData.isSessionAuthenticated?'banner d-none':'banner'}>🔥 Authenticate yourself <a href={AGOSTON_AUTH_GOOGLE} rel="noreferrer">here</a>.</p>
            <p className={sessionData.isSessionAuthenticated?'banner':'banner d-none'}>
                🔥 Authenticated as <span className="user-id">user {sessionData.getCurrentUserId}</span> Logout <a href={AGOSTON_AUTH_LOGOUT} rel="noreferrer">here</a>.
            </p>
            <p className='banner'>------------------------------------------------------------------------------------------</p>
            <Chat />
        </div>
      );
  };


const Root = () => {
    return (
      <div>
        <RootWithSessionData />
      </div>
    );
}

export default Root
