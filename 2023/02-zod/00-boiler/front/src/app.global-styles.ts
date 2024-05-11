import { injectGlobal } from '@emotion/css';
import { theme } from './core/theme';

injectGlobal`
* {
	margin: 0;
	padding: 0;
	border: 0;
  box-sizing: border-box;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}

ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
}

#root {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${theme.palette.secondary.main};
}
`;
