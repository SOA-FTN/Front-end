import { Component } from '@angular/core';
import { BlogPost } from '../model/blogpost.model';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog.service';

@Component({
  selector: 'xp-blog-post-update',
  templateUrl: './blog-post-update.component.html',
  styleUrls: ['./blog-post-update.component.css']
})
export class BlogPostUpdateComponent {
  blogPostForUpdate: BlogPost;
  postId: number;
  
  constructor(private service: BlogService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.getById(this.postId);
    });
  }

  getById(blogPostId: number): void{
    this.service.getById(blogPostId).subscribe({
      next: (result: BlogPost) => {
        this.blogPostForUpdate = result;
        this.blogPostForUpdate.creationDate = new Date(this.blogPostForUpdate.creationDate);
        console.log(this.blogPostForUpdate);
      },
      error: (err: any) =>{
        console.log(err);
      }
    })
  }

  isDraft(post: BlogPost):boolean{
    return post.status == "DRAFT";
  }

}
