import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import TryGame from './pages/TryGame';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: inherit;
  ${prop => prop.isLeaderboard && 'max-height: 100vh;'};
`;

const Main = styled.main`
  padding: 20px;
`;

const MainContainer = withRouter(({ location, children }) => {
  const isLeaderboard = location.pathname === '/leaderboard';
  return <Container isLeaderboard={isLeaderboard}>{children}</Container>;
});

class App extends Component {
  render() {
    return (
      <Router>
        <MainContainer>
          <Header />
          <Main>
            <Route exact path="/" component={Home} />
            <Route path="/try" component={TryGame} />
            <Route path="/leaderboard" component={Leaderboard} />
          </Main>
          <Footer />
        </MainContainer>
      </Router>
    );
  }
}

export default App;
