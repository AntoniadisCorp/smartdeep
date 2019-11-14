import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize, tap, map } from "rxjs/operators";
import { Book } from '../classes';
import { Logger } from './logger.service';
import { SmartEngineService } from './smartengine.service';
import { config, middlebar } from '../variables';



export class customDataSource implements DataSource<Book> {

    private Subject = new BehaviorSubject<Book[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public f: { pages?: any, current?: any } = {}

    constructor(private httpService?: SmartEngineService,
        private logger?: Logger) {

    }

    load(_id: string,
        filter: string,
        sortDirection: string,
        pageIndex: number,
        pageSize: number) {

        this.loadingSubject.next(true);

        const apiUrl = `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}book${middlebar}search`

        this.httpService.find(_id, filter, sortDirection,
            pageIndex, pageSize, 'book', apiUrl).pipe(
                tap((res: any) => {
                    this.f = {
                        pages: res['pages'],
                        current: res['current']
                    }
                }),
                map((res: any) => res['result']),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(books => this.Subject.next(books));

    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        this.logger.log('Σύνδεση δεδομένων..')
        return this.Subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Subject.complete();
        this.loadingSubject.complete();
    }

}