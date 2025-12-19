import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor(private http: HttpClient) { }

  // 讀取
  getApi<T>(url: string) {
    return this.http.get<T>(url);
  }

  // 新增
  postApi<T>(url: string, postDate: any) {
    return this.http.post<T>(url, postDate);
  }

  // 更新
  putApi(url: string, postDate: any) {
    return this.http.put(url, postDate);
  }

  // 刪除
  delApi(url: string) {
    return this.http.delete(url);
  }
}
