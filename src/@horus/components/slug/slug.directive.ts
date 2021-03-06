import { Directive, AfterViewInit, ElementRef, Input, Output, OnChanges, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SlugService } from '@horus/components/slug/slug.service';
import { Subject, merge, from, fromEvent } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Directive({
    selector: '[dh2Slug]'
})
export class SlugDirective implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
    @Input() model;
    @Input() object: any;
    @Input() column = 'slug';
    @Input() value: string;
    @Input() hasCheckLang: boolean = true;
    @Output() checkingSlug = new EventEmitter<boolean>();

    private $onDestroy = new Subject();
    private running = false; // boolean true when is consulting through Http
    private buffer: any;
    private value$: BehaviorSubject<string>;

    constructor(
        private element: ElementRef,
        private control: NgControl,
        private slugService: SlugService
    ) { }

    ngOnChanges(): void {
        if (this.value$) this.value$.next(this.value);
    }

    ngOnInit(): void {
        this.value$ = new BehaviorSubject<string>(this.value);
    }

    ngAfterViewInit(): void
    {
        merge(
            fromEvent(this.element.nativeElement, 'change'),
            this.value$
        ).pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(async (event: any) => {

                let source = null;
                if (typeof event === 'string' && event)
                {
                    source = event;
                }
                else if (event) {
                    source = event.target.value;
                }

                // check if there are value and there isn't a request in progress
                if (source)
                {
                    if (! this.running)
                    {
                        this.checkingSlug.emit(true);
                        this.running = true;
                        let data: any;

                        data = await this.slugService
                            .checkSlug(
                                this.model,
                                source,
                                this.hasCheckLang,
                                this.object,
                                this.column
                            );

                        // check buffer
                        while (this.buffer)
                        {
                            const bufferValue = this.buffer;
                            data = await this.slugService
                                .checkSlug(
                                    this.model,
                                    this.buffer,
                                    this.hasCheckLang,
                                    this.object,
                                    this.column
                                );
                            // reset buffer
                            this.buffer = undefined;
                        }

                        if (environment.debug) console.log('DEBUG - Data from slug Query: ', data.data);
                        if (data)
                        {
                            this.control.control.parent.controls[this.column].setValue(data.data.slug);
                        }

                        this.running = false;
                        this.checkingSlug.emit(false);

                        return data;
                    }
                    else
                    {
                        // add event tu buffer
                        this.buffer = source;
                        return from([]);
                    }
                }
                else
                {
                    return from([]);
                }
            }),
            takeUntil(this.$onDestroy)
        )
        .subscribe();
    }

    ngOnDestroy(): void
    {
        this.$onDestroy.next();
        this.$onDestroy.complete();
        if (environment.debug) console.log('DEBUG - SlugDirective destroyed');
    }
}
