import { css } from "@emotion/css";
import {
  typographyClasses,
  inputClasses,
  tableHeadClasses,
  tableRowClasses,
  tableCellClasses,
} from "@mui/material";
import { theme } from "@/core/theme";

export const root = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;

  .${typographyClasses.h1} {
    font-size: 28px;
    font-weight: bold;
  }

  .${typographyClasses.caption} {
    font-size: 14px;
    font-weight: bold;
  }

  .${inputClasses.input} {
    background-color: ${theme.palette.background.paper};
    padding: ${theme.spacing(1)};
  }

  .${tableHeadClasses.root} {
    background-color: ${theme.palette.primary.main};
  }

  .${tableCellClasses.head} {
    font-size: 18px;
    font-weight: bold;
    color: ${theme.palette.secondary.main};
  }

  .${tableRowClasses.root} {
    &:nth-of-type(even) {
      background-color: ${theme.palette.grey[100]};
    }
  }
`;

