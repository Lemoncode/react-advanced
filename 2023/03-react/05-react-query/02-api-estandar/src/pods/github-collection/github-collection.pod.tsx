import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubMemberVm } from "./github-collection.vm";
import { GithubCollectionComponent } from "./github-collection.component";

export const GithubCollectionPod: React.FC = () => {
  const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm[]>(
    []
  );

  React.useEffect(() => {
    const loadGithubMembers = async () => {
      const members = await getGithubMembersCollection("lemoncode");
      setGithubMembers(members);
    };

    loadGithubMembers();
  }, []);

  return (
    <div>
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
