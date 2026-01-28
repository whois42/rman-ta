import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DataService } from './services/dataService';
import { FolderTreeComponent } from './components/folder-tree/folder-tree';
import { FormattedResponse } from './models/types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FolderTreeComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly dataService = inject(DataService);

  readonly treeData$: Observable<FormattedResponse> =
    this.dataService.fetchData();
}
