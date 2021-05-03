import { Pipe, PipeTransform } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
@Pipe({
  name: 'authpipe'
})
export class AuthpipePipe implements PipeTransform {
  constructor(
    private http: HttpClient,
  ) { }

  async transform(src: string): Promise<string> {
    try {
      const token = localStorage.getItem("token");
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const blob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
    catch {
      return 'assets/fallback.png'
    }
  }

}
