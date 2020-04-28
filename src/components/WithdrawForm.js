import React, { useContext, useState } from "react";

import { Formik } from "formik";
import { Form, Row, Col, Modal, ButtonGroup } from "react-bootstrap";

import {
  Web3ConnectContext,
  CurrentUserContext,
  ContractContext,
} from "../contexts/Store";

import { DepositSchema } from "./Validation";
import { CONTAINER, DEPOSITFORM, BUTTON } from "./Form.styled";

export const WithdrawForm = () => {
  const [web3Connect] = useContext(Web3ConnectContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [contracts] = useContext(ContractContext);
  // Transfer Modal
  const [showTransfer, setShowTransfer] = useState(false);
  const handleCloseTransfer = () => setShowTransfer(false);
  const handleShowTransfer = () => setShowTransfer(true);
  // Zip Out Modal
  const [showZipOut, setShowZipOut] = useState(false);
  const handleCloseZipOut = () => setShowZipOut(false);
  const handleShowZipOut = () => setShowZipOut(true);

  return (
    <CONTAINER className="Card">
      <h2>Unwrap</h2>
      <Row>
        <Col>
          <p className="Label">Balance</p>
          <p className="Value">
            {currentUser.zuniBalance &&
              parseInt(currentUser.zuniBalance).toFixed(2)}{" "}
            zUNI
          </p>
        </Col>
        <Col>
          <p className="Label">Rewards Earned (NA)</p>
          <p className="Value">0.00 LP</p>
        </Col>
      </Row>
      <ButtonGroup>
        <BUTTON variant="primary" onClick={handleShowTransfer}>
          Transfer
        </BUTTON>
        <BUTTON variant="secondary" onClick={handleShowZipOut}>
          Zip Out
        </BUTTON>
      </ButtonGroup>

      <Modal show={showTransfer} onHide={handleCloseTransfer} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transfer zUNI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              amount: 0,
              recipient: '',
            }}
            validationSchema={DepositSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                const weiValue = web3Connect.web3.utils.toWei(
                  "" + values.amount
                );
                await contracts.zuni.methods
                  .transfer(values.recipient, weiValue)
                  .send({ from: currentUser.username });
                setCurrentUser({
                  ...currentUser,
                  ...{ lpBalance: +currentUser.lpBalance - values.amount },
                });
              } catch (err) {
                console.log(err);
              } finally {
                setSubmitting(false);
                resetForm();
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <DEPOSITFORM onSubmit={handleSubmit} className="mx-auto Form">
                <Form.Group controlId="transferForm">
                  <Form.Label>Recipient</Form.Label>
                  <Form.Control
                    type="text"
                    name="recipient"
                    placeholder="recipient (address)"
                    value={values.recipient}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.recipient && errors.recipient ? "error" : null}
                  />
                  {touched.recipient && errors.recipient ? (
                    <div className="error-message">{errors.recipient}</div>
                  ) : null}

                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Amount to wrap"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.amount && errors.amount ? "error" : null}
                  />
                  {touched.amount && errors.amount ? (
                    <div className="error-message">{errors.amount}</div>
                  ) : null}
                </Form.Group>

                <BUTTON type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Loading…" : "Submit"}
                </BUTTON>
              </DEPOSITFORM>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <Modal show={showZipOut} onHide={handleCloseZipOut} centered>
        <Modal.Header closeButton>
          <Modal.Title>Zip Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              amount: 0,
            }}
            validationSchema={DepositSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              try {
                const weiValue = web3Connect.web3.utils.toWei(
                  "" + values.amount
                );
                await contracts.zuni.methods
                  .getMyStakeOut(weiValue)
                  .send({ from: currentUser.username });
                setCurrentUser({
                  ...currentUser,
                  ...{ lpBalance: +currentUser.lpBalance - values.amount },
                });
              } catch (err) {
                console.log(err);
              } finally {
                setSubmitting(false);
                resetForm();
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <DEPOSITFORM onSubmit={handleSubmit} className="mx-auto Form">
                <Form.Group controlId="zipoutForm">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Amount to wrap"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.amount && errors.amount ? "error" : null}
                  />
                  {touched.amount && errors.amount ? (
                    <div className="error-message">{errors.amount}</div>
                  ) : null}
                </Form.Group>

                <BUTTON type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Loading…" : "Submit"}
                </BUTTON>
              </DEPOSITFORM>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </CONTAINER>
  );
};
