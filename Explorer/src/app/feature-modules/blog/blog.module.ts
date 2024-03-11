import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from 'ngx-markdown';
import { BlogpostFormComponent } from './blogpost-form/blogpost-form.component';
import { BlogPostCardComponent } from './blog-post-card/blog-post-card.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostDetailComponent } from './blog-post-detail/blog-post-detail.component';
import { BlogPostCreationComponent } from './blog-post-creation/blog-post-creation.component';
import { MatButtonModule } from '@angular/material/button';
import { BlogPostUpdateComponent } from './blog-post-update/blog-post-update.component';



@NgModule({
  declarations: [
    BlogpostFormComponent,
    BlogPostCardComponent,
    BlogComponent,
    BlogPostDetailComponent,
    BlogPostCreationComponent,
    BlogPostUpdateComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MarkdownModule.forRoot(),
    MatSelectModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    MatDialogModule
  ],
  exports: [
    BlogpostFormComponent
  ]
})
export class BlogModule { }
