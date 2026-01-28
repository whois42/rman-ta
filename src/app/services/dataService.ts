import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ApiResponse, FormattedResponse } from '../models/types';
import { formatResponse } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'assets/response.json';

  fetchData(): Observable<FormattedResponse> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(formatResponse)
    );
  }
}
