import { CategoryType } from "entities/category";

export const filteredCategory = (data: CategoryType[]) => {
  const topLevelCategories: CategoryType[] = [];
  const childCategoriesMap = new Map<string, CategoryType[]>();

  data.forEach((category) => {
    if (category.parent_id === null) {
      topLevelCategories.push(category);
    } else {
      const children = childCategoriesMap.get(category.parent_id) || [];
      children.push(category);
      childCategoriesMap.set(category.parent_id, children);
    }
  });

  return { topLevelCategories, childCategoriesMap };
};
