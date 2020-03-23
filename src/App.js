import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";
import { DepositForm } from "./components/DepositForm";
import { WithdrawForm } from "./components/WithdrawForm";
import { TokenInfo } from "./components/TokenInfo";

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <p>zUNIPoolz</p>
          </Col>
          <Col>
            {currentUser && currentUser.username ? (
              <p>{currentUser.username}</p>
            ) : (
              <Web3SignIn setCurrentUser={setCurrentUser} />
            )}
          </Col>
        </Row>
        <Row className="Hero">
          <Col>
            <h2>
              ZIP into a Uniswap Pool to earn extra rewards for your liquidity.
            </h2>
            <a href="/about">Learn More</a>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            {currentUser && currentUser.username ? (
              <DepositForm />
            ) : (
              <p>Must sign in first</p>
            )}
          </Col>
          <Col>
            <TokenInfo />
          </Col>
          <Col>
            {currentUser && currentUser.username ? (
              <WithdrawForm />
            ) : (
              <p>Must sign in first</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
