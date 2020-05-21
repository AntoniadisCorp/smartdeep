import { Category, BookCase } from '../interfaces';
import { ImageSnippet } from '.';

export class BookDimension {
    x: 0;
    y: 0;
}

export class Book {

    name: '';
    _id = 0;
    SKU = 0;
    bookcase: { _id: string, whatnot: string, bookshelf: string, bookshelfNo?: number };
    author: '';
    publisher: '';
    year: '';
    pages: 0;
    volume: null;
    version: null;
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
