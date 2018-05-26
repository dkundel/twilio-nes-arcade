import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TryGame from './pages/TryGame';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: inherit;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Main>
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              <Route path="/try" component={TryGame} />
            </div>
          </Router>
        </Main>
        <Footer />
      </Container>
    );
  }
}

export default App;
