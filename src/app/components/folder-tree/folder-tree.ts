import { Component, input, signal, computed, effect } from '@angular/core';
import { Folder, FolderNode, Item, TreeNode } from '../../models/types';
import { FolderNodeComponent } from "../folder-node/folder-node";
import { collectItemIds, prepareTreeData } from '../../utils/helpers';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  templateUrl: './folder-tree.html',
  imports: [FolderNodeComponent],
})
export class FolderTreeComponent {
  readonly folders = input.required<Folder[]>();
  readonly items = input.required<Item[]>();

  readonly selectedItemIds = signal<Set<number>>(new Set());
  readonly expandedFolderIds = signal<Set<number>>(new Set());

  constructor() { 
    effect(() => {
      this.expandedFolderIds.set(new Set(this.folders().map(f => f.id)));
    });
  }

  readonly selectedItemIdsStr = computed(() => {
    return Array.from(this.selectedItemIds()).join(',');
  });
  readonly treeData = computed<FolderNode[]>(() => {
    return prepareTreeData(this.folders(), this.items()) as FolderNode[];
  })

  handleItemSelect(item: TreeNode): void {
    this.selectedItemIds.update(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.add(item.id)
      }
      return next;
    });
  }

  handleFolderSelect(folder: TreeNode): void {
    const itemIds = collectItemIds(folder);

    this.selectedItemIds.update(prev => {
      const next = new Set(prev);
      const allSelected = itemIds.every(id => next.has(id));

      for (const id of itemIds) {
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  }

  handleFolderExpand(folderId: number): void {
    this.expandedFolderIds.update(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }

  clearSelection(): void {
    this.selectedItemIds.set(new Set());
  }
}
