import { TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {Video} from './video';

import { Component , ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
 
// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


let fixture: ComponentFixture<LoginComponent>;

describe('Login component', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [LoginComponent] });
        fixture = TestBed.createComponent(LoginComponent);
        fixture.detectChanges();
    });

    it('should display a title', async(() => {
        const titleText = fixture.nativeElement.querySelector('h1').textContent;
        expect(titleText).toEqual('CROSSOVER');
    }));
});

