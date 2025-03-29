import React from "react";

export const NavigationContext = React.createContext();

export default class NavigationProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pathname: window.location.pathname,
      navigate: this.navigate,
    };

    window.onpopstate = () => {
      this.setState({ pathname: window.location.pathname });
    };
  }

  render() {
    return (
      <NavigationContext.Provider value={this.state}>
        {this.props.children}
      </NavigationContext.Provider>
    );
  }

  navigate = (pathname) => {
    this.setState({ pathname });

    window.history.pushState(null, null, pathname);
  };
}
