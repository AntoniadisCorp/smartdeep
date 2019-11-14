import { Category } from '../interfaces';
import { ImageSnippet } from '.';

export class BookDimension {
    x: 0;
    y: 0;
}

export class Book {

    name: '';
    _id=0;
    bookcase: '';
    author: '';
    publisher: '';
    year: '';
    pages: 0;
    dimensions: BookDimension;
    isbn10: 0;
    isbn13: 0;
    status: true;
    notes: '';
    avatar: ImageSnippet;
    // tslint:disable-next-line: variable-name

    libraryName: string = ''
    libraryId: string = ''
    categoryId: string = ''
    categoryName: Category = { name: '' };
    constructor() {
        this.dimensions = new BookDimension();
    }
}
