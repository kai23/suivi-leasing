/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ContentAdd from 'material-ui/svg-icons/content/add';

import DatePicker from 'material-ui/DatePicker';


import Content from './Content';
import moment from 'moment';

import './App.css';

const muiTheme = getMuiTheme();

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const startDate = localStorage.getItem('startDate') || moment().format('YYYY-MM-DD');
    const total = localStorage.getItem('total') || 0;
    const kmMax = localStorage.getItem('kmMax') || 0;
    const { situation, kmDiff, daysPassed, totalAllowedToday, kmPerDayAllowed } = this.calculateAll(startDate, total, kmMax);

    this.state = {
      open: false,
      openModal: false,
      total,
      situation,
      kmDiff,
      kmMax,
      isEmpty: kmMax === 0,
      daysPassed,
      startDate,
      totalAllowedToday,
      kmPerDayAllowed
    };
  }

  calculateAll = (startDate, total, kmMax) => {
    if (total > 0) {
      const kmPerDayAllowed = Math.round(kmMax / 365, 2);

      const currentDate = moment();
      const startDateMoment = moment(startDate, 'YYYY-MM-DD');

      const daysPassed = parseInt(currentDate.diff(startDateMoment, 'days'), 10)
      const totalAllowedToday = Math.round(daysPassed * kmPerDayAllowed, 2);
      const kmDiff = totalAllowedToday - total;

      if (kmDiff < 0) return { situation: 'ko', kmDiff, daysPassed, totalAllowedToday, kmPerDayAllowed }
      if (kmDiff > 0) return { situation: 'ok', kmDiff, daysPassed, totalAllowedToday, kmPerDayAllowed }
      else return { situation: 'still', kmDiff, daysPassed, totalAllowedToday, kmPerDayAllowed }
    }
    return { situation: 'still', kmDiff: 0, daysPassed: 0, totalAllowedToday: 0, kmPerDayAllowed: 0}
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  handleOpenModal = () => this.setState({ openModal: true });
  handleCloseModal = () => this.setState({ openModal: false });

  handleSubmit = () => {
    const startDate = moment(this.state.startDate).format('YYYY-MM-DD');
    const { situation, kmDiff } = this.calculateAll(startDate, this.state.total, this.state.kmMax);
    this.setState({ situation, startDate, kmDiff, isEmpty: false });
    this.updateLocalStorage(this.state.total, startDate, this.state.kmMax)
    this.handleCloseModal();
  }

  updateLocalStorage(total, startDate, kmMax) {
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('total', total);
    localStorage.setItem('kmMax', kmMax);
  }

  render() {
    const propsContent = {
      situation: this.state.situation,
      total: this.state.total,
      kmDiff: this.state.kmDiff,
      kmMax: this.state.kmMax,
      timePassed: this.state.daysPassed,
      totalAllowedToday: this.state.totalAllowedToday,
      kmPerDayAllowed: this.state.kmPerDayAllowed
    }

    const actions = [
      <FlatButton
        label="Envoyer"
        primary={true}
        onTouchTap={this.handleSubmit}
      />,
      <FlatButton
        label="Annuler"
        primary={false}
        keyboardFocused={true}
        onTouchTap={this.handleCloseModal}
      />,
    ];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='app'>
          <AppBar
            title=""
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <MenuItem onTouchTap={this.handleClose}>Options</MenuItem>
            <MenuItem onTouchTap={this.handleClose}>Historique</MenuItem>
          </Drawer>
          <FloatingActionButton className="fab" onTouchTap={this.handleOpenModal}>
            <ContentAdd />
          </FloatingActionButton>
          <Dialog
            title="Mise à jour"
            actions={actions}
            modal={false}
            open={this.state.openModal}
            onRequestClose={this.handleCloseModal}
          >
          {this.state.isEmpty && ([
            <TextField key="kmMax" type="number" hintText="Kilométrage max" onChange={(event) => this.setState({ kmMax: event.target.value })} />,
            <DatePicker key="startDate"  hintText="Date de début" onChange={(event, date) => this.setState({ startDate: date })} />
          ]
          )}
          <TextField type="number" hintText="Kilométrage actuel" onChange={(event) => this.setState({ total: event.target.value })} />
          </Dialog>
          <Content {...propsContent} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
