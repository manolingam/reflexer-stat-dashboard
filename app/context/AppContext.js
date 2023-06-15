import React, { Component, createContext } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    zeroSafes: [],
    nonZeroSafes: [],
    systemStates: '',
    zeroSafesStored: false,
    nonZeroSafesStored: false
  };

  setZeroSafes = (_safes) => {
    this.setState({
      zeroSafes: _safes
    });
  };

  setNonZeroSafes = (_safes) => {
    this.setState({
      nonZeroSafes: _safes
    });
  };

  setSystemStates = (_systemStates) => {
    this.setState({
      systemStates: _systemStates
    });
  };

  setZeroSafesStored = (_bool) => {
    this.setState({
      zeroSafesStored: _bool
    });
  };

  setNonZeroSafesStored = (_bool) => {
    this.setState({
      nonZeroSafesStored: _bool
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setZeroSafes: this.setZeroSafes,
          setNonZeroSafes: this.setNonZeroSafes,
          setSystemStates: this.setSystemStates,
          setZeroSafesStored: this.setZeroSafesStored,
          setNonZeroSafesStored: this.setNonZeroSafesStored
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
