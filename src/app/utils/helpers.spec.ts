import {
  formatResponse,
  prepareTreeData,
  collectItemIds
} from './helpers';
import {
  ApiResponse,
  Folder,
  Item,
  ItemNode,
  TreeNode
} from '../models/types';

describe('helpers', () => {

  describe('formatResponse', () => {
    it('should convert column-based API response into object arrays', () => {
      const apiResponse: ApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Audio', null],
            [2, 'Speakers', 1]
          ]
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [10, 'Speaker Item', 2]
          ]
        }
      };

      const result = formatResponse(apiResponse);

      expect(result.folders).toEqual([
        { id: 1, title: 'Audio', parent_id: null },
        { id: 2, title: 'Speakers', parent_id: 1 }
      ]);

      expect(result.items).toEqual([
        { id: 10, title: 'Speaker Item', folder_id: 2 }
      ]);
    });
  });

  describe('prepareTreeData', () => {
    let folders: Folder[];
    let items: Item[];

    beforeEach(() => {
      folders = [
        { id: 1, title: 'Audio', parent_id: null },
        { id: 2, title: 'Speakers', parent_id: 1 },
        { id: 3, title: 'Passive', parent_id: 2 }
      ];

      items = [
        { id: 100, title: 'Item A', folder_id: 2 },
        { id: 101, title: 'Item B', folder_id: 3 }
      ];
    });

    it('should build a hierarchical tree', () => {
      const tree = prepareTreeData(folders, items);

      expect(tree.length).toBe(1);
      expect(tree[0].title).toBe('Audio');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const speakers = (tree[0] as any).children[0];
      expect(speakers.title).toBe('Speakers');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const passive = speakers.children.find((c: any) => c.title === 'Passive');
      expect(passive).toBeTruthy();
    });

    it('should sort folders before items and alphabetically', () => {
      const tree = prepareTreeData(folders, items);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const speakers = (tree[0] as any).children[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childrenTitles = speakers.children.map((c: any) => c.title);

      expect(childrenTitles).toEqual([
        'Passive',
        'Item A'
      ]);
    });
  });

  describe('collectItemIds', () => {
    it('should collect all item ids recursively', () => {
      const tree: TreeNode = {
        id: 1,
        title: 'Root',
        type: 'folder',
        children: [
          {
            id: 10,
            title: 'Item 1',
            type: 'item'
          },
          {
            id: 2,
            title: 'Subfolder',
            type: 'folder',
            children: [
              {
                id: 11,
                title: 'Item 2',
                type: 'item'
              }
            ]
          }
        ]
      };

      const ids = collectItemIds(tree);

      expect(ids).toEqual([10, 11]);
    });

    it('should return single id when node is item', () => {
      const itemNode: ItemNode = {
        id: 42,
        title: 'Single Item',
        type: 'item'
      };

      const ids = collectItemIds(itemNode);

      expect(ids).toEqual([42]);
    });
  });

});
