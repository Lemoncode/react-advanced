import { css } from "@emotion/css";
import { theme } from "@/core/theme";

export const chipsContainer = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
  min-width: 100%;
`;

export const hiddeLabel = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
