import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubCollectionComponent } from "./github-collection.component";
import { useQuery } from "@tanstack/react-query";
import { FilterComponent } from "./components";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("lemoncode");

  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),

  });

  return (
    <div>
      <FilterComponent
        initialValue={filter}
        onSearch={(value) => setFilter(value)}
      />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
