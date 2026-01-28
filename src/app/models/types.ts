export interface ApiResponse {
    folders: {
        columns: ['id', 'title', 'parent_id'];
        data: [number, string, number | null][];
    };
    items: {
        columns: ['id', 'title', 'folder_id'];
        data: [number, string, number][];
    };
}


export interface Folder{
  id: number;
  title: string;
  parent_id: number | null;
}

export interface Item {
  id: number;
  title: string;
  folder_id: number;
}

export interface FormattedResponse {
  folders: Folder[];
  items: Item[];
}

export interface BaseNode {
  id: number;
  title: string;
}


export interface ItemNode extends BaseNode {
  type: 'item';
}

export interface FolderNode extends BaseNode {
  type: 'folder';
  children: TreeNode[];
}

export type TreeNode = FolderNode | ItemNode & {children?: TreeNode[];};