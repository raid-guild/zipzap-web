import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";
import { DepositForm } from "./components/DepositForm";
import { WithdrawForm } from "./components/WithdrawForm";
import { TokenInfo } from "./components/TokenInfo";
import BgTopLeft from "./assets/bg--topleft.png";
import BgTopRight from "./assets/bg--topright.png";

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <div className="App">
      <Container style={{ zIndex: "1", position: "relative" }}>
        <Row className="Header">
          <Col>
            <h1>zUNIPoolz</h1>
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
        <Row className="FormWrapper">
          <Col>
            {currentUser && currentUser.username ? (
              <DepositForm />
            ) : (
              <p>Must sign in first</p>
            )}
          </Col>
          <Col>
            {currentUser && currentUser.username ? (
              <WithdrawForm />
            ) : (
              <p>Must sign in first</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <TokenInfo />
          </Col>
        </Row>
      </Container>
      <img className="bg--topleft" src={BgTopLeft} />
      <img className="bg--topright" src={BgTopRight} />
    </div>
  );
}

export default App;
