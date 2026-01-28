import { ApiResponse, Folder, FormattedResponse, Item, TreeNode } from "../models/types";

export const formatResponse = (response: ApiResponse): FormattedResponse => {
    const  formatData = ({columns, data}: {columns: string[], data: [number, string, number | null][];}) => {
        return data.map((el) => {
            const obj: Record<string, any> = {};
            columns.forEach((col: string, index: number) => {
                obj[col] = el[index];
            });
            return obj;
        });
    }
    const folders = formatData(response.folders) as Folder[];
    const items = formatData(response.items) as Item[];
    return {folders, items};
}


export const prepareTreeData = (folders: Folder[], items: Item[]) => {
    type TreeNode = (Folder & { children: TreeNode[]; type: string }) | (Item & { type: string });
    const folderMap: Record<number, Folder & { children: TreeNode[]; type: string }> = {};
    const rootFolders: TreeNode[] = [];

    folders.forEach(folder => {
        folderMap[folder.id] = { ...folder, children: [], type: 'folder' };
    });

    folders.forEach(folder => {
        if (folder.parent_id === null) {
            rootFolders.push(folderMap[folder.id]);
        } else {
            const parentFolder = folderMap[folder.parent_id];
            if (parentFolder) {
                parentFolder.children.push(folderMap[folder.id]);
            }
        }
    });

    items.forEach(item => {
        const parentFolder = folderMap[item.folder_id];
        if (parentFolder) {
            parentFolder.children.push({ ...item, type: 'item' } as Item & { type: string });
        }
    });

    const sortChildren = (node: TreeNode) => {
        if (node.type === 'folder' && 'children' in node) {
            node.children.sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.title.localeCompare(b.title);
            });
            node.children.forEach(sortChildren);
        }
    };

    rootFolders.forEach(sortChildren);
    rootFolders.sort((a, b) => a.title.localeCompare(b.title));

    return rootFolders;
}

export const collectItemIds = (node: TreeNode): number[] => {
    if(node.type !== 'folder') return [node.id];
    const childrenItemIds = node.children.flatMap(child => collectItemIds(child));
    return [...childrenItemIds];
}