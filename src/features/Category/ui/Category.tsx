"use client";
import { useState } from "react";
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData,
} from "@atlaskit/tree";
import { BiSolidRightArrow } from "react-icons/bi";
import { LuBook, LuBookOpen } from "react-icons/lu";
import { motion } from "framer-motion";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { treeData } from "../lib/constants";
import { Hashtag } from "shared/index";

const HashtagList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`absolute left-[30px] bottom-[25px] w-[220px] px-[15px] ${isOpen ? "py-[20px]" : "py-[10px]"} bg-black-EEE rounded-t-[5px] border-b-[3px] border-black-DDD`}
    >
      <div className="flex justify-between items-center">
        <p className="text-[12px] font-medium text-black-777">Hashtag</p>
        <button
          type="button"
          className={`flex justify-center items-center w-[14px] h-[14px] rounded-[2px] bg-black-FFF`}
          onClick={handleClick}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowIcon />
          </motion.div>
        </button>
      </div>
      {isOpen && (
        <motion.ul className="flex flex-wrap justify-between gap-y-[10px] mt-[20px]">
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
          <Hashtag tagName="Design" hasBorder size="s" />
        </motion.ul>
      )}
    </div>
  );
};

export const Category = () => {
  const [tree, setTree] = useState<TreeData>(treeData);
  const [isDNDMode, setIsDNDMode] = useState(false);
  const isDirectChildOfRoot = (item: TreeItem) =>
    tree.items[tree.rootId].children.includes(item.id);

  const getIcon = (
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void
  ) => {
    if (
      (item.children && item.children.length > 0) ||
      isDirectChildOfRoot(item)
    ) {
      return item.isExpanded ? (
        <div className="flex mr-[10px]" onClick={() => onCollapse(item.id)}>
          <LuBookOpen stroke="#888" onClick={() => onCollapse(item.id)} />
        </div>
      ) : (
        <div className="flex mr-[10px]" onClick={() => onExpand(item.id)}>
          <LuBook stroke="#888" onClick={() => onExpand(item.id)} />
        </div>
      );
    }
    return <BiSolidRightArrow size={9} fill="#aaa" className="mr-[10px]" />;
  };

  const onExpand = (itemId: ItemId) => {
    const transformTree = mutateTree(tree, itemId, { isExpanded: true });
    setTree(transformTree);
  };

  const onCollapse = (itemId: ItemId) => {
    const transformTree = mutateTree(tree, itemId, { isExpanded: false });
    setTree(transformTree);
  };

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    if (!destination) return;
    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);
  };

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
        <span>{item.data ? item.data.title : ""}</span>
      </div>
    );
  };

  return (
    <nav className="relative flex flex-col grow mt-[10px] py-[25px] px-[30px] w-[280px] bg-white rounded-xl">
      <p className="mb-[30px] text-[#888] font-medium text-[13px]">Category</p>
      <div className="flex flex-col justify-between h-full">
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          isDragEnabled={isDNDMode}
        />
        <HashtagList />
      </div>
    </nav>
  );
};
