import React from "react";
import { getGithubMemberDetail } from "./github-member.repository";
import { createDefaultMemberDetail } from "./github-member.vm";

interface Props {
  id: string;
}

export const GithubMemberPod: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState(createDefaultMemberDetail());

  React.useEffect(() => {
    const loadGithubMember = async () => {
      const member = await getGithubMemberDetail(id);
      setMember(member);
    };
    loadGithubMember();
  }, []);

  return (
    <div>
      <h1>{id}</h1>
      <h1>{member.name}</h1>
    </div>
  );
};
