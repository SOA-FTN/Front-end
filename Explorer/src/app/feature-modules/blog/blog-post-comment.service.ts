import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogPostComment } from './model/blog-post-comment.model';
import { Observable } from 'rxjs'
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogPostCommentService {

  constructor(private http: HttpClient) { }

  getBlogPostComments() : Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>(environment.apiHost + 'blogPostComment');
  }

  addComment(comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.post<BlogPostComment>(environment.apiHost + 'blogPostComment', comment);
  }

  updateComment(comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.put<BlogPostComment>(environment.apiHost + 'blogPostComment/' + comment.id, comment);
  }
  deleteComment(comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.delete<BlogPostComment>(environment.apiHost + 'blogPostComment/' + comment.id);

  }
}
