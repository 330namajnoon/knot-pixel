// theme.ts
import { createTheme } from "@mui/material/styles";

let theme = createTheme({
	palette: {
		primary: {
		  main: "#4caf50",   // verde
		  light: "#80e27e",
		  dark: "#087f23",
		  contrastText: "#fff",
		},
		secondary: {
		  main: "#ff9800",   // naranja
		  light: "#ffc947",
		  dark: "#c66900",
		  contrastText: "#000",
		},
		background: {
		  default: "#f5f5f5",
		  paper: "#fff",
		},
		text: {
		  primary: "#212121",
		  secondary: "#757575",
		},
	  },
});

theme = createTheme(theme, {
	palette: {
		primary: theme.palette.augmentColor({
			color: {
				main: "#90E0EF",
			},
			name: "primary",
		}),
		secondary: theme.palette.augmentColor({
			color: {
				main: "#00B4D8",
			},
			name: "secondary",
		}),
		packground: theme.palette.augmentColor({
			color: {
				main: "#CAF0F8",
			},
			name: "background",
		}),
		text: theme.palette.augmentColor({
			color: {
				main: "#03045E",
			},
			name: "text",
		}),
	}
});

export default theme;