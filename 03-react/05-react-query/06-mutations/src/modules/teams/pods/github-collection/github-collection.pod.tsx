import React from "react";
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { useGithubCollectionQuery } from "./github-collection-query.hook";
import { queryClient } from "@/modules/teams/core/react-query";
import { githubKeys } from "@/modules/teams/core/react-query/query-keys";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("lemoncode");
  const { githubMembers, isSuccess } = useGithubCollectionQuery(filter);

  React.useEffect(() => {
    if (isSuccess) {
      console.log("Aquí puedes hacer lo que quieras");
    }
  }, [githubMembers, isSuccess]);

  return (
    <div>
      <button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: githubKeys.all })
        }
      >
        Invalidar todas las consultas de github
      </button>
      <FilterComponent initialValue={filter} onSearch={setFilter} />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
