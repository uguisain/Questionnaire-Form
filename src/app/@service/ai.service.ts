import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AiService {

constructor(private aiService: HttpClient) { }

  // 讀取
  getApi(url: string): any {
    return this.aiService.get(url);
  }

  // 新增
  postApi(url: string, postDate: any) {
    return this.aiService.post(url, postDate);
  }

  // 更新
  putApi(url: string, postDate: any) {
    return this.aiService.put(url, postDate);
  }

  // 刪除
  delApi(url: string) {
    return this.aiService.delete(url);
  }
}
