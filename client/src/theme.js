import { red } from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

// A custom theme for this app
const baseTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#556cd6"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: red.A400
    }
  }
});

const theme = responsiveFontSizes(baseTheme /*, {
  factor: 1
}*/)

export default theme;
