import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Book } from '../shared/book';
import { Validation } from './validation';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-book-form',
  templateUrl: 'book-form.component.html'
})
export class BookFormComponent implements OnInit {
  book: Book = Book.empty();
  validation = new Validation();
  isUpdatingBook: boolean = false;
  myForm: FormGroup;
  authors: FormArray;
  thumbnails: FormArray;

  constructor(
    private fb: FormBuilder,
    private bs: BookStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initBook(this.book);
    this.myForm.valueChanges.subscribe(() => this.updateErrorMessages());

    this.route.params.subscribe(params => {
      let isbn = params['isbn'];
      if (isbn) {
        this.isUpdatingBook = true;
        let book = this.bs.getSingle(isbn);
        this.initBook(book);
      }
    });
  }

  initBook(book: Book) {
    this.myForm = this.fb.group({
      title: [book.title, Validators.required],
      subtitle: [book.subtitle],
      isbn: [book.isbn, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13)
      ])],
      description: [book.description],
      authors: this.buildAuthorsArray(book.authors),
      thumbnails: this.buildThumbnialsArray(book.thumbnails),
      published: [
        book.published,
        Validators.pattern('([1-9]|0[1-9]|(1|2)[0-9]|3[0-1])\.([1-9]|0[1-9]|1[0-2])\.[0-9]{4}')
      ]
    });
  }

  buildAuthorsArray(authors): FormArray {
    this.authors = this.fb.array(authors, Validators.required);
    return this.authors;
  }

  buildThumbnialsArray(thumbnails): FormArray {
    this.thumbnails = this.fb.array(
      thumbnails.map(
        t => this.fb.group({
          url: this.fb.control(t.url),
          title: this.fb.control(t.title)
        })
      )
    );
    return this.thumbnails;
  }

  addAuthorControl() {
    this.authors.push(this.fb.control(null));
  }

  addThumbnailControl() {
    this.thumbnails.push(this.fb.group({ url: null, title: null }));
  }

  submitForm() {
    if (this.isUpdatingBook) {
      this.bs.update(this.myForm.value);
      this.router.navigate(['../../books', this.myForm.value.isbn], { relativeTo: this.route });
    } else {
      this.bs.create(this.myForm.value);
      this.myForm.reset();
    }
  }

  updateErrorMessages() {
    for (let field in this.validation) {
      this.validation[field].error = '';     
      let control = this.myForm.get(field);

      if (control && control.dirty && control.invalid) {
        for (let key in control.errors) {
          this.validation[field].error = this.validation[field].messages[key];
        }
      }
    };
  }
}
