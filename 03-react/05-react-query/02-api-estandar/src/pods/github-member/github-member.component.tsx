import React from "react";
import { GithubMemberVm } from "./github-member.vm";
import classNames from "classnames";
import classes from "./github-member.component.module.css";

interface Props {
  githubMember: GithubMemberVm;
}

export const GithubMemberComponent: React.FC<Props> = (props) => {
  const { githubMember } = props;

  return (
    <div className={classNames(classes.container, classes.someAdditionalClass)}>
      <span className={classes.header}>Avatar</span>
      <span className={classes.header}>Name</span>
      <span className={classes.header}>Bio</span>
      <img src={githubMember.avatarUrl} />
      <span>{githubMember.id}</span>
      <span>{githubMember.bio}</span>
    </div>
  );
};
