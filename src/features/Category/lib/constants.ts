export const treeData = {
  rootId: "1",
  items: {
    '1': { id: '1', children: ['2', '3'], hasChildren: true, isExpanded: true, data: { title: 'Root' }},
    '2': { id: '2', children: ['4', '5'], hasChildren: true, isExpanded: true, data: { title: 'Child 1' }},
    '3': { id: '3', children: ['6', '7'], hasChildren: true, isExpanded: true, data: { title: 'Child 2' }},
    '4': { id: '4', children: [], hasChildren: false, isExpanded: false, data: { title: 'Child 4' }},
    '5': { id: '5', children: [], hasChildren: false, isExpanded: false, data: { title: 'Child 5' }},
    '6': { id: '6', children: [], hasChildren: false, isExpanded: false, data: { title: 'Child 6' }},
    '7': { id: '7', children: [], hasChildren: false, isExpanded: false, data: { title: 'Child 7' }},
  },
}