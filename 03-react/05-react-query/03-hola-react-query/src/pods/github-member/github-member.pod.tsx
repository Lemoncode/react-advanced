import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGithubMemberDetail } from "./github-member.repository";
import { createDefaultMemberDetail } from "./github-member.vm";
import { GithubMemberComponent } from "./github-member.component";
import { githubKeys } from "@/core/react-query/query-keys";

interface Props {
  id: string;
}

export const GithubMemberPod: React.FC<Props> = (props) => {
  const { id } = props;

  const { data: member = createDefaultMemberDetail() } = useQuery({
    queryKey: githubKeys.member(id),
    queryFn: () => getGithubMemberDetail(id),
  });

  return (
    <div>
      <GithubMemberComponent githubMember={member} />
    </div>
  );
};
