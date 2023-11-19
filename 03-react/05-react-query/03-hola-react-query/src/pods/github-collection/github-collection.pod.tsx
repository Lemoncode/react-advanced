import React from "react";
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { useGithubCollectionQuery } from "./github-collection-query.hook";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const { githubMembers, isSuccess, refetch } =
    useGithubCollectionQuery(filter);

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
