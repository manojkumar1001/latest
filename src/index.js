import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette :{
        type: 'dark'
    },

})

ReactDOM.render(<createMuiTheme> <App /></createMuiTheme>, document.getElementById("root")); 
    
