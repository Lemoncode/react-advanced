import { css } from "@emotion/css";
import { theme } from "@/core/theme";
import {
  inputClasses,
  tableCellClasses,
  tableHeadClasses,
  tableRowClasses,
  typographyClasses,
} from "@mui/material";

export const root = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${theme.spacing(3)};

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

export const textFieldsContainer = css`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: ${theme.spacing(3)};

  & > :nth-child(n) {
    width: 100%;
  }

  @media (min-width: ${theme.breakpoints.values.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing(6)};
  }
`;

export const title = css`
  font-size: 28px;
  font-weight: bold;
`;

export const goBack = css`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${theme.palette.primary.main};

  & > span {
    font-size: 16px;
    font-weight: bold;
  }
`;
