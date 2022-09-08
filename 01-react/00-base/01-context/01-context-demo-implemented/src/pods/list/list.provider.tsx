import React from "react";
import { MemberEntity } from "./list.vm";
import { MemberListContext, MemberListContextVm } from "./list.context";
import { getMemberCollection } from "./list.repository";

interface Props {
  children: React.ReactNode;
}

export const MemberListProvider: React.FC<Props> = ({ children }) => {
  const [memberList, setMemberList] = React.useState<MemberEntity[]>([]);

  const loadMemberList = () =>
    getMemberCollection().then((memberCollection) =>
      setMemberList(memberCollection)
    );

  return (
    <MemberListContext.Provider
      value={{
        memberList,
        loadMemberList,
      }}
    >
      {children}
    </MemberListContext.Provider>
  );
};

export const useMemberListContext = () => {
  const context = React.useContext<MemberListContextVm>(MemberListContext);
  if (!context) {
    throw new Error("MemberListContext must be used within a ProfileProvider");
  }
  return context;
};
