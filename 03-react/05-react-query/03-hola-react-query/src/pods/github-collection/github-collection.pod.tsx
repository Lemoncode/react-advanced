import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubCollectionComponent } from "./github-collection.component";
import { useQuery } from "@tanstack/react-query";

export const GithubCollectionPod: React.FC = () => {
  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", "lemoncode"],
    queryFn: () => getGithubMembersCollection("lemoncode"),
  });

  return (
    <div>
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
