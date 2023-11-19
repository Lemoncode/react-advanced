import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubCollectionComponent } from "./github-collection.component";
import { useQuery } from "@tanstack/react-query";
import { FilterComponent } from "./components";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });

  React.useEffect(() => {
    if (isSuccess) {
      console.log("Aquí puedes hacer lo que quieras");
    }
  }, [githubMembers, isSuccess]);

  return (
    <div>
      <button onClick={() => refetch()}>Refrescar</button>
      <FilterComponent
        initialValue={filter}
        onSearch={(value) => setFilter(value)}
      />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
