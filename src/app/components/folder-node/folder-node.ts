import { Component, input, output, computed } from '@angular/core';
import { TreeNode } from '../../models/types';

@Component({
  selector: 'app-folder-node',
  standalone: true,
  templateUrl: './folder-node.html',
})
export class FolderNodeComponent {
  readonly node = input.required<TreeNode>();
  readonly selectedItemIds = input.required<Set<number>>();
  readonly expandedFolderIds = input.required<Set<number>>();
  
  readonly folderSelected = output<TreeNode>();
  readonly expandToggled = output<number>();
  readonly itemSelected = output<TreeNode>();
  readonly isExpanded = computed(() => {
    return this.expandedFolderIds().has(this.node().id);
  });
  readonly checkboxState = computed(() => {
    const node = this.node();
    const itemIds = this.collectItemIds(node);
    const selected = itemIds.filter(id =>
      this.selectedItemIds().has(id)
    );

    return {
      checked: selected.length === itemIds.length,
      indeterminate: selected.length > 0 && selected.length < itemIds.length
    };
  });
  private collectItemIds(node: TreeNode): number[] {
    if(node.type !== 'folder') return [node.id];
    const childrenItemIds = node.children.flatMap(c => this.collectItemIds(c));
    return childrenItemIds;
  }
}  