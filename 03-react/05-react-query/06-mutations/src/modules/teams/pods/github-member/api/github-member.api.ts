import Axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import {
  GithubMemberApiModel,
  validateGithubMember,
} from "./github-member.model";

export const getGithubMember = async (
  userName: string
): Promise<GithubMemberApiModel> => {
  const { data } = await Axios.get<GithubMemberApiModel>(
    `${ENV_VARIABLES.GITHUB_API_BASE_URL}/users/${userName}`
  );

  validateGithubMember(data);

  return data;
};
