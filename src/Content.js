/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import './Content.css';

const mapSign = {
  ok: '+',
  still: '',
  ko: ''
}
class Main extends Component {

  render() {
    const { situation, total, kmDiff, kmMax, timePassed, totalAllowedToday, kmPerDayAllowed } = this.props;
    if (kmMax > 0) {
      return (
        <div className={situation}>
          <Row middle="xs">
            <Col xs={12}>
              <p className="km">{mapSign[situation]}{kmDiff}km</p>
              <p> Pour rappel : </p>
              <ul>
                <li><b>{total}</b>km / {kmMax} en {timePassed} jours</li>
                <li><b>{totalAllowedToday}km</b> autorisés aujourd'hui</li>
                <li>Il faudrait faire <b>{kmPerDayAllowed}km</b> par jour </li>
              </ul>
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div className={situation}>
        <Row middle="xs">
          <Col xs={12}>
            Merci de commencer par saisir un kilométrage.
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main;
