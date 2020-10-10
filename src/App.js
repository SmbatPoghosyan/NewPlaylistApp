import React from 'react';
import './App.css';
import {getPlaylists} from './api';
import {baseUrl} from './config';
import axios from "axios";
import {loadProgressBar} from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
import Player from './Player';
import {isEqual,cloneDeep} from "lodash";

const isEmpty = (object) =>
{
  if (Object.keys(object).length === 0)
  {
    return true;
  } else return false;
};

class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.timeOutId = '';
    this.state = {
      playlist: null,
      loaded: false,
      files: null,
      screens: 0,
      ticker: null
    }
  }

  componentDidMount()
  {
    this.getPlaylistInitialFunction();
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (this.state.playlist && !isEmpty(this.state.playlist) && !isEqual(this.state.playlist, prevState.playlist))
    {
      loadProgressBar();
      axios.post(`${baseUrl}/download`, {files: this.state.playlist.files})
          .then(res =>
          {
            this.setState({
              files: this.state.playlist.files,
              screens: this.state.playlist.screens,
              ticker: this.state.playlist.playlist.ticker,
              loaded: true,
            })
          })
          .catch(err =>
          {
            alert(err);
          });
    }
  }

  getPlaylistInitialFunction = (current) =>
  {
    window.clearTimeout(this.timeOutId);

    let tempPl = cloneDeep(current);
    getPlaylists().then(result => {
      if (result?.data?.length)
      {
        const dateNow = new Date().valueOf();
        let match = false;
        const playlists = result.data;
        playlists.forEach(pl =>
        {
          if (!match)
          {
            const start = new Date(pl.playlist["startDate"]).valueOf();
            const end = new Date(pl.playlist["endDate"]).valueOf();
            if (dateNow >= start && dateNow <= end && (!tempPl || tempPl.playlist["updatedAt"] !== pl.playlist["updatedAt"]))
            {
              this.setState({playlist: pl});
              match = true;
            }
            tempPl = pl;
          }
        })
      } else
      {
        throw new Error('no playlist');
      }
      this.timeOutId = window.setTimeout(() =>
      {
        this.getPlaylistInitialFunction(tempPl);
      }, 10000);

    }).catch((err) => {
      if (err?.response?.data?.message)
      {
        alert(err.response.data.message);
        console.log(err.response);
      } else
      {
        alert(err.message);
        console.log(err);
      }
    });
  };

  render()
  {
    const {loaded, files, screens, ticker} = this.state;
    return (
        <div className="App">
          {loaded && files && screens && ticker ?
              <Player {...this.state} /> : null
          }
        </div>
    );
  }
}

export default App;

