import { MemberEntityApi } from "./list.api-model";

export const getMemberCollection = (): Promise<MemberEntityApi[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
    response.json()
  );
