import { GithubMemberApiModel } from "./api";
import { GithubMemberVm } from "./github-member.vm";

export const mapGithubMemberFromApiToVm = (
  githubMember: GithubMemberApiModel
): GithubMemberVm => ({
  id: githubMember.id.toString(),
  login: githubMember.login,
  name: githubMember.name,
  avatarUrl: githubMember.avatar_url,
  company: githubMember.company,
  bio: githubMember.bio,
});
