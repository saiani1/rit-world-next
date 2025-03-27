type ItemId = string;

type TreeItem = {
  id: ItemId;
  children: ItemId[];
  hasChildren: boolean;
  isExpanded?: boolean;
  data: {
    title: string;
  };
};

export type TreeDataType = {
  rootId: ItemId;
  items: {
    [key: string]: TreeItem;
  };
};
