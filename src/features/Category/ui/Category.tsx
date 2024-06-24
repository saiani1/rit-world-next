'use client'
import { useState } from "react";
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData
} from "@atlaskit/tree";
import { FaGear, FaCircleCheck } from "react-icons/fa6";
import { BiSolidRightArrow } from "react-icons/bi";
import { LuBook, LuBookOpen } from "react-icons/lu";

import { treeData } from "../lib/constants";

export const Category = () => {
  const [tree, setTree] = useState<TreeData>(treeData);
  const [isDNDMode, setIsDNDMode] = useState(false);
  const isDirectChildOfRoot = (item: TreeItem) => tree.items[tree.rootId].children.includes(item.id);

  const getIcon = (
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void
  ) => {

    if ((item.children && item.children.length > 0) || isDirectChildOfRoot(item)) {
      return item.isExpanded ? (
        <div
          className="flex mr-[10px]"
          onClick={() => onCollapse(item.id)}
        >
          <LuBookOpen
            stroke="#888"
            onClick={() => onCollapse(item.id)}
          />
        </div>
      ) : (
        <div
          className="flex mr-[10px]"
          onClick={() => onExpand(item.id)}
        >
          <LuBook
            stroke="#888"
            onClick={() => onExpand(item.id)}
          />
        </div>
      )}
    return (
      <BiSolidRightArrow
        size={9}
        fill="#aaa"
        className="mr-[10px]"
      />
    )
  }

  const onExpand = (itemId: ItemId) => {
    const transformTree = mutateTree(tree, itemId, { isExpanded: true });
    setTree(transformTree);
  };

  const onCollapse = (itemId: ItemId) => {
    const transformTree = mutateTree(tree, itemId, { isExpanded: false });
    setTree(transformTree);
  };

  const onDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    if (!destination) return;
    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);
  }

  const renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams) => {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="flex items-center font-semibold text-[#777]"
      >
        <span className="mr-[-3px]">{getIcon(item, onExpand, onCollapse)}</span>
        <span>{item.data ? item.data.title : ''}</span>
      </div>
    )
  }

  const handleClickDNDMode = () => setIsDNDMode((prev) => !prev);

  return (
    <nav className="mt-[10px] py-[25px] px-[30px] w-[280px] h-[450px] overflow-auto bg-white rounded-xl">
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-[#888] font-medium text-[11px]">Category</h2>
        <button
          type="button"
          onClick={handleClickDNDMode}
        >
          {isDNDMode ? (
            <FaCircleCheck size={15} fill="#888" />
          ) : (
            <FaGear size={15} fill="#888" />
          )}
        </button>
      </div>
      <Tree
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        isDragEnabled={isDNDMode}
      />
    </nav>
  );
};
