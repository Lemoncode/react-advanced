import { useQuery } from "@tanstack/react-query";
import { getGithubMembersCollection } from "./github-collection.repository";


export const useGithubCollectionQuery = (filter: string) => {
  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });

  return { githubMembers, isSuccess, refetch };
};